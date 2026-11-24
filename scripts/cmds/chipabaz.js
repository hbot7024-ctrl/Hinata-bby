const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "chipabaz",
    version: "3.0",
    author: "Farhan",
    countDown: 5,
    role: 0,
    shortDescription: "Pic er upore chipabaz %",
    longDescription: "Pic er upore chipabaz meter bosano",
    category: "fun",
    guide: "{pn} [@tag]"
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID, mentions } = event;
    let targetID, targetName;

    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
      targetName = mentions[targetID].replace("@", "");
    } else if (event.type === "message_reply") {
      targetID = event.messageReply.senderID;
      const u = await usersData.get(targetID);
      targetName = u.name;
    } else {
      targetID = senderID;
      const u = await usersData.get(senderID);
      targetName = u.name;
    }

    let hash = 0;
    for (let i = 0; i < targetID.length; i++) hash += targetID.charCodeAt(i);
    const percent = hash % 101;

    const funnyLines = [
      "1 takar badam kine 3 din dhore khay 😂",
      "Dokaane giya bole 'mama ektu chaira den' 🤣",
      "Biriyani te mangso kom porle dokandar re jhari mare 🍗",
      "Wifi er password churi kore chalai 📶",
      "Friend er treat e giya bole 'amar pet kharap' 🤮",
      "Rickshaw vara 5 taka kom dewar jonno jhogra kore 🛺",
      "Fuchka khaia bole 'jhal beshi, taka dimu na' 🌶️",
      "Biyete giya 2 packet biriyani lukaiya ane 🍱",
      "Chayer dokane baki khay, pore rasta bodlaiya jay ☕",
      "Taka dhar nile, dhar newar por chine na 😎",
      "Free er jinis dekhlei pagol hoye jay 🤑"
    ];
    const randomFunny = funnyLines[Math.floor(Math.random() * funnyLines.length)];

    let title = "";
    if (percent >= 90) title = "👑 CHIPABAZ ER BAP 👑";
    else if (percent >= 75) title = "🥇 PRO MAX CHIPABAZ";
    else if (percent >= 55) title = "😏 CERTIFIED CHIPABAZ";
    else if (percent >= 35) title = "🙂 HALKA CHIPABAZ";
    else if (percent >= 15) title = "😇 VALO MANUSH";
    else title = "💎 BOROLOK DIL-DORIYA";

    const filled = Math.floor(percent / 10);
    const bar = "🟩".repeat(filled) + "⬜".repeat(10 - filled);

    const msg = `╭─── 🤣 𝗖𝗛𝗜𝗣𝗔𝗕𝗔𝗭 𝗥𝗘𝗣𝗢𝗥𝗧 🤣 ───╮\n\n👤 𝗡𝗮𝗺𝗲: ${targetName}\n📊 𝗖𝗵𝗶𝗽𝗮𝗯𝗮𝘇: ${percent}%\n🏆 𝗥𝗮𝗻𝗸: ${title}\n\n${bar} ${percent}%\n\n💬 ➡️ ${randomFunny}\n\n╰──────────────╯`;

    try {
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde566`;
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const outPath = path.join(cacheDir, `chipabaz_${targetID}.png`);

      // Canvas 800x800
      const canvas = createCanvas(800, 800);
      const ctx = canvas.getContext("2d");

      const avatar = await loadImage(avatarUrl);
      // Background blur / dark
      ctx.drawImage(avatar, 0, 0, 800, 800);
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, 800, 800);

      // Circle avatar middle
      ctx.save();
      ctx.beginPath();
      ctx.arc(400, 320, 180, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatar, 220, 140, 360, 360);
      ctx.restore();

      // White border
      ctx.beginPath();
      ctx.arc(400, 320, 180, 0, Math.PI * 2);
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#FFD700";
      ctx.stroke();

      // Name
      ctx.fillStyle = "#fff";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText(targetName, 400, 580);

      // Percent big
      ctx.fillStyle = percent >= 70 ? "#FF3B30" : percent >= 40 ? "#FFCC00" : "#00E676";
      ctx.font = "bold 90px Arial";
      ctx.fillText(`${percent}% CHIPABAZ`, 400, 680);

      // Title
      ctx.fillStyle = "#fff";
      ctx.font = "bold 32px Arial";
      ctx.fillText(title, 400, 730);

      const buffer = canvas.toBuffer("image/png");
      await fs.writeFile(outPath, buffer);

      return api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(outPath)
      }, threadID, () => fs.unlinkSync(outPath), messageID);

    } catch (e) {
      console.log(e);
      return api.sendMessage(msg, threadID, messageID);
    }
  }
};
