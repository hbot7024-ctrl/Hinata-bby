const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "wlc",
    version: "3.0",
    author: "Farhan",
    countDown: 3,
    role: 0,
    shortDescription: "Stylish random welcome + mention wlc",
    longDescription: "Join korle + wlc @mention dileo stylish welcome dibe",
    category: "box",
    guide: "{pn} @mention\n{pn} wlc @friend"
  },

  // 🎲 Random stylish welcome messages
  getRandomWelcome: function (name, groupName, memberCount) {
    const msgs = [
      `╭─── 🎉 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 🎉 ───╮\n\n👋 𝗛𝗲𝘆 @${name} !\n💖 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 ${groupName} 🥰\n👥 𝗧𝘂𝗺𝗶 ${memberCount} 𝗻𝗼𝗺𝗯𝗲𝗿 𝗺𝗲𝗺𝗯𝗲𝗿!\n✨ 𝗔𝘀𝗵𝗮 𝗸𝗼𝗿𝗶 𝘃𝗮𝗹𝗼 𝗹𝗮𝗴𝗯𝗲, 𝗮𝗰𝘁𝗶𝘃𝗲 𝘁𝗵𝗮𝗸𝗼! 😍\n\n╰─────────────────╯`,
      `꧁༒☬ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 ☬༒꧂\n\n🌸 𝗛𝗲𝗹𝗹𝗼 @${name} 🌸\n💫 ${groupName} 𝗲 𝘁𝗼𝗺𝗮𝗸𝗲 𝘀𝘄𝗮𝗴𝗼𝘁𝗼𝗺!\n👑 𝗧𝘂𝗺𝗶 𝗲𝗸𝗵𝗼𝗻 ${memberCount} 𝗻𝗼𝗺𝗯𝗲𝗿 𝗺𝗲𝗺𝗯𝗲𝗿!\n🔥 𝗠𝗼𝗷𝗮 𝗸𝗼𝗿𝗼, 𝗮𝗱𝗱𝗮 𝗱𝗮𝗼, 𝗮𝗰𝘁𝗶𝘃𝗲 𝘁𝗵𝗮𝗸𝗼!`,
      `╔═══ 🎀 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 🎀 ═══╗\n\n🥳 𝗔𝗿𝗲 𝗮𝗿𝗲 @${name} 𝗰𝗵𝗼𝗹𝗲 𝗮𝘀𝗰𝗵𝗲! 😍\n💐 ${groupName} 𝗲 𝘁𝗼𝗺𝗮𝗸𝗲 𝗳𝘂𝗹𝗲𝗿 𝘀𝘂𝘃𝗲𝗰𝗰𝗵𝗮!\n🎈 𝗘𝗸𝗵𝗼𝗻 𝘁𝗵𝗲𝗸𝗲 𝘁𝘂𝗺𝗶 𝗮𝗺𝗮𝗱𝗲𝗿 𝗽𝗼𝗿𝗶𝗯𝗮𝗿! 👨‍👩‍👧\n\n╚═══════════════════╝`,
      `✧･ﾟ: *✧･ﾟ:* 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 *:･ﾟ✧*:･ﾟ✧\n\n😘 𝗢𝗺𝗮𝗮𝗮 @${name} !\n🤍 ${groupName} 𝗲 𝘄𝗲𝗹𝗰𝗼𝗺𝗲 𝗷𝗮𝗻! 💋\n👥 𝗠𝗲𝗺𝗯𝗲𝗿 𝗻𝗼: ${memberCount}\n💌 𝗡𝗶𝗷𝗲𝗿 𝗽𝗼𝗿𝗶𝗰𝗵𝗼𝘆 𝗱𝗮𝗼 𝗮𝗿 𝗮𝗱𝗱𝗮 𝘀𝘂𝗿𝘂 𝗸𝗼𝗿𝗼!`,
      `◤─── 💎 𝗩𝗜𝗣 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 💎 ───◥\n\n👑 𝗞𝗶𝗻𝗴 / 𝗤𝘂𝗲𝗲𝗻 @${name} 𝗮𝘀𝗰𝗵𝗲! 👑\n🌟 ${groupName} 𝗲 𝘁𝗼𝗺𝗮𝗸𝗲 𝗩𝗜𝗣 𝘄𝗲𝗹𝗰𝗼𝗺𝗲!\n🎊 𝗣𝗮𝗿𝘁𝘆 𝘀𝘂𝗿𝘂! 🥳\n\n◣───────────────────◢`,
      `•°•°•°•°•°•°•°•°•°•°•°•°•°•\n\n🦋 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 @${name} 🦋\n🌈 ${groupName} 𝗲 𝘁𝗼𝗺𝗮𝗿 𝗷𝗼𝗻𝗻𝗼 𝗼𝗽𝗲𝗸𝗸𝗵𝗮 𝗸𝗼𝗿𝗰𝗵𝗶𝗹𝗮𝗺!\n💖 𝗔𝘀𝗮𝗿 𝗽𝗼𝗿 𝗮𝗿 𝗷𝗮𝗶𝘁𝗲 𝗱𝗶𝗯𝗼 𝗻𝗮! 😂\n\n•°•°•°•°•°•°•°•°•°•°•°•°•°•`,
      `🎉🎉🎉🎉🎉🎉🎉🎉\n\n😍 𝗛𝗲𝗹𝗹𝗼 𝗛𝗲𝗹𝗹𝗼 @${name} !\n🎁 ${groupName} 𝗲 𝘁𝗼𝗺𝗮𝗸𝗲 𝗪𝗲𝗹𝗰𝗼𝗺𝗲!\n👥 𝗧𝘂𝗺𝗶 ${memberCount} 𝗻𝗼. 𝗺𝗲𝗺𝗯𝗲𝗿, 𝗲𝗸𝗵𝗼𝗻 𝗳𝘂𝗹𝗹 𝗲𝗻𝗷𝗼𝘆! 🔥\n\n🎉🎉🎉🎉🎉🎉🎉🎉`,
      `╭──────────────╮\n│ 💌 𝗡𝗘𝗪 𝗠𝗘𝗠𝗕𝗘𝗥 │\n╰──────────────╯\n\n🌹 @${name} 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 ${groupName} 🌹\n💬 𝗛𝗶 𝗯𝗼𝗹𝗼, 𝗽𝗼𝗿𝗶𝗰𝗵𝗼𝘆 𝗱𝗮𝗼!\n✨ 𝗚𝗿𝗼𝘂𝗽 𝘁𝗮 𝗲𝗸𝗵𝗼𝗻 𝗮𝗿𝗼 𝘀𝘂𝗻𝗱𝗼𝗿 𝗵𝗼𝗹𝗼!`,
      `🔥 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗧𝗛𝗘 𝗙𝗔𝗠𝗜𝗟𝗬 🔥\n\n😎 @${name} 𝗷𝗼𝗶𝗻 𝗸𝗼𝗿𝗹𝗼!\n🏠 ${groupName} 𝗲 𝘁𝗼𝗺𝗮𝗿 𝗻𝗼𝘁𝘂𝗻 𝗯𝗮𝘀𝗮! 🏠\n🚀 𝗖𝗵𝗼𝗹𝗼 𝗲𝗸𝘀𝗮𝘁𝗵𝗲 𝗺𝗼𝗷𝗮 𝗸𝗼𝗿𝗶!`,
      `💝 𝗔𝗿𝗲 𝗪𝗮𝗵𝗵 @${name} 💝\n\n🌷 ${groupName} 𝗲 𝘁𝗼𝗺𝗮𝗸𝗲 𝗼𝗻𝗲𝗸 𝗼𝗻𝗲𝗸 𝘃𝗮𝗹𝗼𝗯𝗮𝘀𝗮! 💗\n🎀 𝗔𝗰𝘁𝗶𝘃𝗲 𝘁𝗵𝗮𝗸𝗹𝗲 𝗽𝗿𝗲𝗺 𝗲 𝗽𝗼𝗿𝗯𝗮 😜\n👥 𝗠𝗲𝗺𝗯𝗲𝗿: ${memberCount}`
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  },

  sendWelcome: async function (api, threadID, uid, name) {
    let groupName = "Ei Group";
    let memberCount = "?";
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      groupName = threadInfo.threadName || "Ei Group";
      memberCount = threadInfo.participantIDs.length;
    } catch (e) {}

    const msg = this.getRandomWelcome(name, groupName, memberCount);

    try {
      const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde566`;
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const outPath = path.join(cacheDir, `wlc_${uid}.jpg`);
      const res = await axios.get(avatarUrl, { responseType: "arraybuffer" });
      await fs.writeFile(outPath, res.data);
      await api.sendMessage({ body: msg, mentions: [{ tag: name, id: uid }], attachment: fs.createReadStream(outPath) }, threadID, () => fs.unlinkSync(outPath));
    } catch (e) {
      await api.sendMessage({ body: msg, mentions: [{ tag: name, id: uid }] }, threadID);
    }
  },

  // ✅ 1. Auto - keu join korle
  onEvent: async function ({ api, event }) {
    if (event.logMessageType !== "log:subscribe") return;
    const added = event.logMessageData.addedParticipants || [];
    for (const user of added) {
      if (user.userFbId == api.getCurrentUserID()) continue;
      await this.sendWelcome(api, event.threadID, user.userFbId, user.fullName);
    }
  },

  // ✅ 2. Manual - wlc @mention dileo wlc korbe
  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, mentions, senderID } = event;

    // wlc @Rahim likhle oi lok ke wlc korbe
    if (mentions && Object.keys(mentions).length > 0) {
      for (const uid of Object.keys(mentions)) {
        const name = mentions[uid];
        await this.sendWelcome(api, threadID, uid, name);
      }
      return;
    }

    // wlc likhle nijeke wlc korbe
    if (!args[0]) {
      const info = await api.getUserInfo(senderID);
      await this.sendWelcome(api, threadID, senderID, info[senderID].name);
      return;
    }

    return api.sendMessage("📌 Use koro: `wlc @friend` - jake mention diba takei wlc korbe! 🎉", threadID, messageID);
  }
};
