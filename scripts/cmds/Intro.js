module.exports = {
  config: {
    name: "intro",
    version: "3.1",
    author: "Farhan",
    countDown: 5,
    role: 0,
    shortDescription: "Intro card + pic",
    longDescription: "intro likhle pic soho stylish intro dibe",
    category: "info",
    guide: "{pn}\n{pn} @mention"
  },

  onStart: async function ({ api, event, getStreamFromURL }) {
    const { threadID, messageID, mentions } = event;

    // ✅ Tor Catbox Pic - Final
    const PIC_LINK = "https://files.catbox.moe/bi7j8q.jpg";

    let name = "𝑭𝒂𝒓𝒉𝒂𝒏 𝑰𝒔𝒍𝒂𝒎 𝑨𝒃𝒊𝒓";
    if (mentions && Object.keys(mentions).length > 0) {
      name = mentions[Object.keys(mentions)[0]];
    }

    const msg = `꒷꒦︶꒷꒦︶꒷꒦︶꒷꒦︶꒷꒦
  ♡ 𝑰𝒏𝒕𝒓𝒐 𝑪𝒂𝒓𝒅 ♡
꒷꒦︶꒷꒦︶꒷꒦︶꒷꒦︶꒷꒦

╭──────꒷꒦♡꒦꒷─────╮
│  🫠 𝒏𝒂𝒎𝒆 : ${name}
│  🫀 𝑹𝒆𝒍𝒊𝒈𝒊𝒐𝒏 : 𝑴𝒖𝒔𝒍𝒊𝒎
│  🤍 𝒂𝒈𝒆 : 𝟏𝟕+
│  😴🫴 𝒔𝒕𝒂𝒕𝒖𝒔 : 𝑺𝒊𝒏𝒈𝒍𝒆
│  🇧🇩 𝒄𝒐𝒖𝒏𝒕𝒓𝒚 : 𝑩𝒂𝒏𝒈𝒍𝒂𝒅𝒆𝒔𝒉
│  📍 𝒄𝒊𝒕𝒚 : 𝑱𝒂𝒎𝒂𝒍𝒑𝒖𝒓
│  ✨ 𝒗𝒊𝒃𝒆 : 𝑪𝒖𝒕𝒆 + 𝑳𝒐𝒚𝒂𝒍
╰──────꒷꒦♡꒦꒷─────╯

  🤍 ._) ....... :? 🤍
  𝑰 𝒂𝒎 𝒏𝒐𝒕 𝒑𝒆𝒓𝒇𝒆𝒄𝒕, 𝒃𝒖𝒕 𝑰 𝒂𝒎 𝒓𝒆𝒂𝒍 🫶`;

    try {
      const stream = await getStreamFromURL(PIC_LINK);
      return api.sendMessage({ body: msg, attachment: stream }, threadID, messageID);
    } catch (e) {
      console.log("Intro pic error:", e.message);
      return api.sendMessage(msg, threadID, messageID);
    }
  }
};
