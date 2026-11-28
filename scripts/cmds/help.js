
const { commands, aliases } = global.GoatBot;
const { getPrefix } = global.utils;

function getDescription(config, lang) {
  const desc = config.shortDescription || config.description || config.longDescription;
  if (!desc) return "No Description";
  if (typeof desc === "string") return desc;
  return desc[lang] || desc.en || Object.values(desc)[0] || "No Description";
}

function getGuide(config, lang, prefix) {
  let guide = config.guide || "";

  if (typeof guide === "object") {
    guide = guide[lang] || guide.en || guide.body || "";
    if (typeof guide === "object") guide = guide.body || "";
  }

  if (typeof guide !== "string") return "";

  return guide
    .replace(/\{pn\}/g, prefix + config.name)
    .replace(/\{p\}/g, prefix);
}

module.exports = {
  config: {
    name: "help",
    version: "4.0",
    author: "FARHAN ABIR",
    countDown: 3,
    role: 0,
    shortDescription: "Premium command list",
    description: "Show all available commands",
    category: "SYSTEM",
    guide: {
      en: "{pn} [command name]"
    }
  },

  onStart: async function ({
    message,
    args,
    event,
    role,
    threadsData
  }) {
    const prefix = getPrefix(event.threadID);
    const lang = await threadsData.get(event.threadID, "data.lang")
      || global.GoatBot.config.language
      || "en";

    const commandName = (args[0] || "").toLowerCase();

    // Individual command information
    if (commandName) {
      const cmd = commands.get(commandName)
        || commands.get(aliases.get(commandName));

      if (!cmd) {
        return message.reply(
          `⚠️ 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 "${commandName}" 𝑵𝒐𝒕 𝑭𝒐𝒖𝒏𝒅!`
        );
      }

      const config = cmd.config;
      const description = getDescription(config, lang);
      const guide = getGuide(config, lang, prefix);

      return message.reply(
`╔══════════════════════╗
       ♛ 𝑪𝑶𝑴𝑴𝑨𝑵𝑫 𝑰𝑵𝑭𝑶 ♛
╚══════════════════════╝

🏷️ 𝑵𝒂𝒎𝒆: ${config.name}
📝 𝑫𝒆𝒔𝒄: ${description}
🔗 𝑨𝒍𝒊𝒂𝒔: ${config.aliases?.join(", ") || "None"}
🧬 𝑽𝒆𝒓𝒔𝒊𝒐𝒏: ${config.version || "1.0"}
🛡️ 𝑹𝒐𝒍𝒆: ${config.role == 0 ? "All Users" : config.role == 1 ? "Admins" : "Bot Owner"}
⏳ 𝑪𝒐𝒐𝒍𝒅𝒐𝒘𝒏: ${config.countDown || 1}s
👤 𝑨𝒖𝒕𝒉𝒐𝒓: ${config.author || "Unknown"}

━━━━━━━━━━━━━━━━━━━━
📖 𝑼𝑺𝑨𝑮𝑬

${guide || "No Guide Available"}

━━━━━━━━━━━━━━━━━━━━
༺ 𝑭𝑨𝑹𝑯𝑨𝑵 𝑨𝑩𝑰𝑹 ༻`
      );
    }

    // All commands in one message
    const categories = {};

    for (const [name, cmd] of commands) {
      if (!cmd.config || cmd.config.role > role) continue;

      const category = (cmd.config.category || "OTHERS").toUpperCase();

      if (!categories[category]) {
        categories[category] = [];
      }

      categories[category].push(name);
    }

    const categoryIcons = {
      SYSTEM: "♛",
      ADMIN: "♜",
      FUN: "✦",
      GAME: "🎮",
      MEDIA: "🎬",
      UTILITY: "⚙️",
      INFO: "❖",
      OTHER: "✧"
    };

    let total = 0;
    let list = "";

    for (const category of Object.keys(categories).sort()) {
      const names = categories[category].sort();
      total += names.length;

      const icon = categoryIcons[category] || "✧";

      list +=
`\n╭━━━『 ${icon} 𝑺𝑬𝑪𝑻𝑰𝑶𝑵: ${category} 』\n`;

      names.forEach((name, index) => {
        list += `┃ ◈ ${name}\n`;
      });

      list += "╰━━━━━━━━━━━━━━━━━━\n";
    }

    return message.reply(
`╔══════════════════════╗
       ♛ 𝑪𝑶𝑴𝑴𝑨𝑵𝑫 𝑳𝑰𝑺𝑻 ♛
╚══════════════════════╝
${list}
━━━━━━━━━━━━━━━━━━━━
♛ 𝑻𝒐𝒕𝒂𝒍 𝑪𝒐𝒎𝒎𝒂𝒏𝒅: ${total}
♛ 𝑷𝒓𝒆𝒇𝒊𝒙: [ ${prefix} ]
━━━━━━━━━━━━━━━━━━━━
༺ 𝑷𝑶𝑾𝑬𝑹𝑬𝑫 𝑩𝒀
       𝑭𝑨𝑹𝑯𝑨𝑵 𝑨𝑩𝑰𝑹 ༻`
    );
  }
};
