
module.exports = {
  config: {
    name: "chapabaz",
    version: "1.0.0",
    author: "FARHAN ABIR",
    countDown: 3,
    role: 0,
    shortDescription: "Chapabaz Detector",
    longDescription: "Check someone's chapabazi level",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ event, message, usersData }) {
    const mentions = Object.keys(event.mentions || {});

    if (mentions.length === 0) {
      return message.reply(
        "😂 কাকে চাপাবাজি ডিটেক্ট করব?\n\nব্যবহার: chapabaz @mention"
      );
    }

    const uid = mentions[0];
    const name = await usersData.getName(uid);
    const percent = Math.floor(Math.random() * 101);

    const messages = [
      "ভাই, তোমার গল্প শুনে মিথ্যাও লজ্জায় পড়ে যায়! 😂",
      "তুমি কথা বললে Google-ও Fact Check করতে বসে যায়! 🤣",
      "তোমার চাপাবাজির কাছে সিনেমার গল্পও হার মানে! 😭",
      "একটা কথা বলো, নিজের গল্প নিজেই বিশ্বাস করো কীভাবে? 😂",
      "তোমার মুখে গল্পের অভাব নেই, শুধু সত্যের একটু অভাব! 🤣",
      "তোমার কথা শুনে কল্পনার জগতও অবাক! 😆",
      "চাপাবাজির রাজ্যে তুমি VIP মেম্বার! 👑",
      "তোমার গল্পের শেষ খুঁজতে গেলে রাত শেষ হয়ে যাবে! 😂",
      "তুমি কথা শুরু করলে সত্য নিজেই অফলাইনে চলে যায়! 🤣",
      "তোমার গল্পে NASA-ও নতুন গ্রহ খুঁজে পায়! 🚀",
      "তোমার কথা শুনে Netflix নতুন সিরিজ বানাতে চায়! 😂",
      "চাপাবাজির অলিম্পিকে তোমার গোল্ড মেডেল নিশ্চিত! 🥇",
      "তোমার গল্পের কোনো লিমিট নেই ভাই! 😭",
      "তুমি তো হাঁটাচলা করা গল্পের কারখানা! 🤣",
      "তোমার কথা শুনে মিথ্যাও বলে, আমাকে এত ছোট করো না! 😂"
    ];

    const selected = messages.splice(
      Math.floor(Math.random() * messages.length), 1
    )[0];

    return message.reply(
      `╭━━━〔 😂 CHAPABAZ DETECTOR 〕━━━╮\n` +
      `┃\n` +
      `┃ 👤 Target: ${name}\n` +
      `┃ 🎭 Chapabaz Level: ${percent}%\n` +
      `┃\n` +
      `┃ 💬 ${selected}\n` +
      `┃\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯\n` +
      `⚡ POWERED BY FARHAN ABIR ⚡`,
      (err, info) => {
        if (!err) {
          message.reply;
        }
      }
    );
  }
};
