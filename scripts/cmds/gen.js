const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const API_CONFIG_URL = "https://raw.githubusercontent.com/xalmandevv/xalmanx210/refs/heads/main/apis.json";

const apiKey = () => `${module.exports?.config?.[String.fromCharCode(...[68,80,81,77,74,87].map(v => v ^ 37))]}-hub`;
const FALLBACK = () => `https://${module.exports?.config?.[String.fromCharCode(...[68,80,81,77,74,87].map(v => v ^ 37))]}-apis.vercel.app`;

let apiBaseUrl = null;
let apiConfigRequest = null;

async function getApiBaseUrl() {
  if (apiBaseUrl) return apiBaseUrl;

  if (!apiConfigRequest) {
    apiConfigRequest = axios
      .get(API_CONFIG_URL, { timeout: 15000 })
      .then(({ data }) => {
        const key = apiKey();
        const baseUrl = data?.[key];

        if (typeof baseUrl !== "string" || !baseUrl.trim()) {
          throw new Error(`Missing API key in apis.json: ${key}`);
        }

        apiBaseUrl = baseUrl.replace(/\/+$/, "");
        return apiBaseUrl;
      })
      .catch((error) => {
        const fallback = FALLBACK();
        if (fallback && fallback.trim()) {
          apiBaseUrl = fallback.replace(/\/+$/, "");
          return apiBaseUrl;
        }
        throw error;
      })
      .finally(() => {
        apiConfigRequest = null;
      });
  }

  return apiConfigRequest;
}

module.exports = {
  config: {
    name: "gen",
    aliases: ["generate"],
    version: "1.0.2",
    author: "xalman",
    countDown: 10,
    role: 0,
    shortDescription: "AI Image Generation with styles",
    category: "AI",
    guide: {
      en: "{pn} <prompt> [--ratio 9:16] [--style angel]\n{pn} (reply to an image) [prompt] [--style undress]\n{pn} list (shows available ratios & styles)"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID } = event;
    let promptArgs = [];
    let ratio = null;
    let style = null;
    let imageUrl = null;

    for (let i = 0; i < args.length; i++) {
      const arg = args[i].toLowerCase();
      if ((arg === "--ratio" || arg === "-r") && i + 1 < args.length) {
        ratio = args[i + 1];
        i++;
      } else if ((arg === "--style" || arg === "-s") && i + 1 < args.length) {
        style = args[i + 1];
        i++;
      } else {
        promptArgs.push(args[i]);
      }
    }

    const prompt = promptArgs.join(" ").trim();

    if (event.type === "message_reply" && event.messageReply?.attachments?.length > 0) {
      const att = event.messageReply.attachments[0];
      if (att.type === "photo") imageUrl = att.url;
    }

    if (!prompt && !imageUrl && args[0] !== "list") {
      return message.reply("⚠️ Please provide a prompt or reply to an image.\nExample: /gen a cute girl --ratio 9:16 --style angel\nType /gen list to see available styles.");
    }

    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);

      const base = await getApiBaseUrl();

      if (args[0] === "list" || (!prompt && !imageUrl)) {
        const listRes = await axios.get(`${base}/api/gen`, { timeout: 15000 });
        const d = listRes.data;

        const ratioList = d.available_ratios ? d.available_ratios.join(", ") : "Unknown";
        const styleList = d.available_styles ? d.available_styles.join("\n• ") : "Unknown";

        const listMsg = `🎨 𝗚𝗘𝗡 𝗔𝗣𝗜 𝗦𝗧𝗔𝗧𝗨𝗦\n━━━━━━━━━━━━━━━━━━\n📐 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗥𝗮𝘁𝗶𝗼𝘀:\n• ${ratioList}\n\n👗 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗦𝘁𝘆𝗹𝗲𝘀:\n• ${styleList}\n\n📝 𝗨𝘀𝗮𝗴𝗲:\n/gen <prompt> [--ratio 1:1] [--style angel]`;

        api.setMessageReaction("✅", messageID, () => {}, true);
        return message.reply(listMsg);
      }

      let apiUrl = `${base}/api/gen?`;
      const query = [];

      if (prompt) query.push(`prompt=${encodeURIComponent(prompt)}`);
      if (imageUrl) query.push(`imageUrl=${encodeURIComponent(imageUrl)}`);
      if (ratio) query.push(`ratio=${encodeURIComponent(ratio)}`);
      if (style) query.push(`style=${encodeURIComponent(style)}`);

      apiUrl += query.join("&");

      const res = await axios.get(apiUrl, {
        responseType: "arraybuffer",
        timeout: 120000,
        validateStatus: () => true,
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const contentType = res.headers["content-type"] || "";
      if (!contentType.includes("image")) {
        let errMsg = "Failed to generate image.";
        try {
          const json = JSON.parse(Buffer.from(res.data).toString());
          if (json.message) errMsg = json.message;
        } catch (e) { }
        api.setMessageReaction("❌", messageID, () => {}, true);
        return message.reply(`❌ ${errMsg}`);
      }

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const outPath = path.join(cacheDir, `gen_${Date.now()}.png`);
      await fs.writeFile(outPath, Buffer.from(res.data));

      api.setMessageReaction("✅", messageID, () => {}, true);

      let caption = "";
      if (imageUrl) {
        caption = `🖼️ 𝗚𝗘𝗡 𝗘𝗗𝗜𝗧𝗘𝗗\n━━━━━━━━━━━━━━━━━━`;
        if (style) caption += `\n👗 Style: ${style}`;
        if (prompt) caption += `\n📝 Custom Prompt: ${prompt}`;
      } else {
        caption = `🎨 𝗚𝗘𝗡 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗\n━━━━━━━━━━━━━━━━━━`;
        if (ratio) caption += `\n📐 Ratio: ${ratio}`;
        if (style) caption += `\n👗 Style: ${style}`;
      }

      return message.reply({
        body: caption,
        attachment: fs.createReadStream(outPath)
      }, async () => {
        if (fs.existsSync(outPath)) await fs.unlink(outPath);
      }, messageID);

    } catch (err) {
      console.error(err);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply("❌ Error: " + err.message);
    }
  }
};
