const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const API = process.env.MOODSWINGS_API_URL || "https://diablo-moodswings-api.onrender.com";
const CACHE = path.join(__dirname, "cache");
if (!fs.existsSync(CACHE)) fs.mkdirSync(CACHE, { recursive: true });

const API_TIMEOUT_MS = 90000;
const MAX_LINK_ATTEMPTS = 3;

function toBold(text) {
  const boldMap = { 'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙', 'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳', '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗' };
  return text.split('').map(char => boldMap[char] || char).join('');
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function downloadToFile(url, dest) {
  const writer = fs.createWriteStream(dest);
  const res = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    timeout: API_TIMEOUT_MS
  });
  res.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function fetchLinkList(mainCat, subCat) {
  let lastErr;
  for (let i = 0; i < 2; i++) {
    try {
      const res = await axios.get(`${API}/api/media/list`, {
        params: { category: mainCat, subcategory: subCat },
        timeout: API_TIMEOUT_MS
      });
      const links = Array.isArray(res.data && res.data.data) ? res.data.data : [];
      return links.filter((l) => typeof l === "string");
    } catch (e) {
      lastErr = e;
      if (e.response && e.response.status < 500) break;
    }
  }
  throw lastErr;
}

module.exports = {
  config: {
    name: "moodswings",
    aliases: ["msd", "diablomood"],
    version: "2.0",
    author: "protik",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: "Random videos from Diablo Moodswings API",
    guide: { en: "{pn} to open the menu" }
  },
  onStart: async function ({ message, event }) {
    try {
      const res = await axios.get(`${API}/api/categories`, { timeout: API_TIMEOUT_MS });
      const categories = Object.keys(res.data);
      if (!categories.length) return message.reply("❌ | No categories found.");
      let msg = "✦ ──『 𝐌𝐎𝐎𝐃𝐒𝐖𝐈𝐍𝐆𝐒 』── ✦\n\n";
      categories.forEach((cat, index) => {
        msg += ` ${toBold((index + 1).toString())} ❯ ${toBold(cat.toUpperCase())}\n`;
      });
      msg += `\n💬 | 𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐚 𝐧𝐮𝐦𝐛𝐞𝐫 𝐭𝐨 𝐬𝐞𝐥𝐞𝐜𝐭 𝐚 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲.`;
      return message.reply(msg, (err, info) => {
        if (err || !info) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: event.senderID,
          messageID: info.messageID,
          step: 1,
          categories: categories,
          rawData: res.data
        });
      });
    } catch (e) {
      return message.reply("❌ | API Error. Please try again later.\n" + e.message);
    }
  },
  onReply: async function ({ message, event, Reply }) {
    if (event.senderID !== Reply.author) return;
    const input = parseInt(String(event.body || "").trim());
    if (isNaN(input)) return message.reply("❌ | 𝐍𝐨𝐭𝐡𝐢𝐧𝐠 𝐡𝐞𝐫𝐞. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫.");

    if (Reply.step === 1) {
      if (input < 1 || input > Reply.categories.length) {
        return message.reply("❌ | 𝐍𝐨𝐭𝐡𝐢𝐧𝐠 𝐡𝐞𝐫𝐞. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫.");
      }
      const selectedMainCat = Reply.categories[input - 1];
      const subCatsData = Reply.rawData[selectedMainCat];
      const subCats = subCatsData.map(item => item.name);
      let msg = `✦ ──『 ${toBold(selectedMainCat.toUpperCase())} 』── ✦\n\n`;
      subCats.forEach((sub, index) => {
        msg += ` ${toBold((index + 1).toString())} ❯ ${toBold(sub.toUpperCase())}\n`;
      });
      msg += `\n💬 | 𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐚 𝐧𝐮𝐦𝐛𝐞𝐫 𝐭𝐨 𝐠𝐞𝐭 𝐭𝐡𝐞 𝐯𝐢𝐝𝐞𝐨.`;
      global.GoatBot.onReply.delete(Reply.messageID);
      try { await message.unsend(Reply.messageID); } catch (e) {}
      return message.reply(msg, (err, info) => {
        if (err || !info) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: event.senderID,
          messageID: info.messageID,
          step: 2,
          mainCat: selectedMainCat,
          subCats: subCats
        });
      });
    }

    if (Reply.step === 2) {
      if (input < 1 || input > Reply.subCats.length) {
        return message.reply("❌ | 𝐍𝐨𝐭𝐡𝐢𝐧𝐠 𝐡𝐞𝐫𝐞. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫.");
      }
      const selectedSubCat = Reply.subCats[input - 1];
      global.GoatBot.onReply.delete(Reply.messageID);
      try { await message.unsend(Reply.messageID); } catch (e) {}
      return sendVideo(message, Reply.mainCat, selectedSubCat);
    }
  }
};

async function sendVideo(message, mainCat, subCat) {
  const waitMsg = await message.reply(`⏳ | 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 ${toBold(subCat.toUpperCase())}...`);
  let filePath = null;
  try {
    const links = await fetchLinkList(mainCat, subCat);
    if (!links.length) throw new Error("No links returned for this category.");

    let lastErr;
    for (let i = 0; i < Math.min(MAX_LINK_ATTEMPTS, links.length); i++) {
      const url = pickRandom(links);
      let ext = ".mp4";
      try { ext = path.extname(new URL(url).pathname) || ".mp4"; } catch (_) {}
      const dest = path.join(CACHE, `mood_${Date.now()}_${i}${ext}`);
      try {
        await downloadToFile(url, dest);
        filePath = dest;
        break;
      } catch (e) { lastErr = e; }
    }
    if (!filePath) throw lastErr || new Error("Download failed.");

    try { await message.unsend(waitMsg.messageID); } catch (e) {}
    const stream = fs.createReadStream(filePath);
    stream.on("error", (e) => console.error("Mood stream error:", e.message));
    await message.reply({
      body: `✦ ──『 ${toBold(mainCat.toUpperCase())} 』── ✦\n\n 🎬 ❯ ${toBold(subCat.toUpperCase())}\n\n🔗 | 𝐃𝐢𝐚𝐛𝐥𝐨 𝐌𝐨𝐨𝐝𝐬𝐰𝐢𝐧𝐠𝐬 𝐀𝐏𝐈`,
      attachment: stream
    });
    const doneFile = filePath;
    setTimeout(() => { fs.remove(doneFile).catch(() => {}); }, 60000);
  } catch (error) {
    console.error("Video Download Error:", error && error.message ? error.message : error);
    if (filePath) fs.remove(filePath).catch(() => {});
    try { await message.unsend(waitMsg.messageID); } catch (e) {}
    return message.reply("❌ | 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐥𝐨𝐚𝐝 𝐯𝐢𝐝𝐞𝐨. Please try again.");
  }
}
