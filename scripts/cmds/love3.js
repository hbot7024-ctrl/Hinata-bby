
"use strict";

const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const TEMPLATE =
  "https://i.imgur.com/pJKECrY.jpeg";

module.exports = {
  config: {
    name: "love3",
    version: "1.0.0",
    author: "Farhan Abir",
    countDown: 5,
    role: 0,
    shortDescription: "Love Match Poster",
    longDescription: "Create a Love Match poster with mentioned user",
    category: "love",
    guide: "{pn} @mention"
  },

  onStart: async function ({ api, event }) {
    const mentionIDs = Object.keys(event.mentions || {});

    if (!mentionIDs.length) {
      return api.sendMessage(
        "💗 কাউকে Mention করো!\n\nExample: love3 @mention",
        event.threadID,
        event.messageID
      );
    }

    const senderID = event.senderID;
    const targetID = mentionIDs[0];

    if (senderID === targetID) {
      return api.sendMessage(
        "নিজেকে Mention করা যাবে না! 😅",
        event.threadID,
        event.messageID
      );
    }

    const output = path.join(
      os.tmpdir(),
      `love3_${Date.now()}.jpg`
    );

    try {
      // Get user information
      const getInfo = (uid) =>
        new Promise((resolve, reject) => {
          api.getUserInfo([uid], (err, data) => {
            if (err) return reject(err);
            resolve(data[uid] || {});
          });
        });

      const [sender, target] = await Promise.all([
        getInfo(senderID),
        getInfo(targetID)
      ]);

      const senderName =
        sender.name || "You";

      const targetName =
        target.name || event.mentions[targetID] || "Friend";

      const senderPhoto =
        sender.thumbSrc ||
        `https://graph.facebook.com/${senderID}/picture?type=large`;

      const targetPhoto =
        target.thumbSrc ||
        `https://graph.facebook.com/${targetID}/picture?type=large`;

      // Download template
      const response = await axios.get(TEMPLATE, {
        responseType: "arraybuffer",
        timeout: 30000
      });

      const background = await loadImage(
        Buffer.from(response.data)
      );

      const canvas = createCanvas(
        background.width,
        background.height
      );

      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        background,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Load profile pictures
      const [leftPhoto, rightPhoto] = await Promise.all([
        loadImage(senderPhoto),
        loadImage(targetPhoto)
      ]);

      // Draw circular profile photo
      function drawCirclePhoto(img, x, y, radius) {
        ctx.save();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const scale = Math.max(
          (radius * 2) / img.width,
          (radius * 2) / img.height
        );

        const width = img.width * scale;
        const height = img.height * scale;

        ctx.drawImage(
          img,
          x - width / 2,
          y - height / 2,
          width,
          height
        );

        ctx.restore();

        // Pink neon border
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = "#ff39bd";
        ctx.lineWidth = 9;
        ctx.shadowColor = "#ff1493";
        ctx.shadowBlur = 22;
        ctx.stroke();
        ctx.restore();
      }

      // Profile positions
      drawCirclePhoto(leftPhoto, 410, 665, 275);
      drawCirclePhoto(rightPhoto, 1125, 665, 275);

      // Name label
      function drawName(name, x, y) {
        ctx.save();

        ctx.font = "bold 65px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let displayName = name;

        while (
          ctx.measureText(displayName).width > 430 &&
          displayName.length > 4
        ) {
          displayName = displayName.slice(0, -1);
        }

        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ff1493";
        ctx.shadowBlur = 12;

        ctx.fillText(displayName, x, y);

        ctx.restore();
      }

      drawName(senderName, 330, 1060);
      drawName(targetName, 1200, 1060);

      // Random Love Match percentage
      const percentage =
        Math.floor(Math.random() * 26) + 75;

      ctx.save();
      ctx.font = "bold 105px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#111111";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#ff1493";
      ctx.shadowBlur = 15;

      ctx.strokeText(`${percentage}%`, 768, 1015);
      ctx.fillText(`${percentage}%`, 768, 1015);

      ctx.restore();

      // Save poster
      fs.writeFileSync(
        output,
        canvas.toBuffer("image/jpeg", {
          quality: 0.95
        })
      );

      // Send poster
      api.sendMessage(
        {
          body:
            `💗 LOVE MATCH RESULT 💗\n\n` +
            `👑 ${senderName} + ${targetName}\n` +
            `❤️ Love Match: ${percentage}%\n\n` +
            `✨ Made with Farhan Abir Bot`,
          attachment: fs.createReadStream(output)
        },
        event.threadID,
        (err) => {
          if (fs.existsSync(output)) {
            fs.unlinkSync(output);
          }

          if (err) {
            console.error(err);
          }
        },
        event.messageID
      );

    } catch (error) {
      console.error("LOVE3 ERROR:", error);

      if (fs.existsSync(output)) {
        fs.unlinkSync(output);
      }

      return api.sendMessage(
        "❌ Poster তৈরি করা যায়নি!\n" +
        "Profile picture বা Template load করতে সমস্যা হয়েছে।",
        event.threadID,
        event.messageID
      );
    }
  }
};
