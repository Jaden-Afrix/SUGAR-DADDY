/*************************************************
 SUGAR DADDY - IDENTITY SYSTEM v2.0
 DYNAMIC BRANDING WITH REAL-TIME STATISTICS
 Owner: ALPHA-BLAKE
**************************************************/

const os = require("os");
const moment = require("moment");
require("moment-duration-format");
const { formatBytes } = require("../utils/helpers"); // Reuse from uptime module

const IDENTITY_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";
const GITHUB_REPO = "https://github.com/Jaden-Afrix/SUGAR-DADDY";

// Bot metadata
const BOT_METADATA = {
  name: "SUGAR DADDY",
  version: "Quantum v2.1",
  release: "2023-11-15",
  creator: "ALPHA-BLAKE",
  features: 42,
  security: "Shield AI v1.4",
  prefixes: [".", "!", "/", "#", "$"]
};

module.exports = {
  name: "bot",
  alias: ["sugardaddy", "identity", "info"],
  category: "core",
  desc: "🤖 View bot identity and system information",

  async exec(m, { sock }) {
    // Get stats
    const uptime = moment.duration(process.uptime(), "seconds").format("d[d] h[h] m[m]");
    const totalMem = formatBytes(os.totalmem());
    const platform = os.platform();
    
    // Create identity card
    await sock.sendMessage(m.chat, {
      text: `*🤖 ${BOT_METADATA.name} BOT IDENTITY*\n` +
            this.generateSystemInfo(uptime, totalMem, platform),
      templateButtons: [
        { 
          urlButton: { 
            displayText: "📡 OFFICIAL CHANNEL", 
            url: CHANNEL_LINK 
          }
        },
        { 
          quickReplyButton: { 
            displayText: "💻 TECH SPECS", 
            id: "!bot specs" 
          }
        },
        { 
          quickReplyButton: { 
            displayText: "⚙️ FEATURES", 
            id: "!bot features" 
          }
        }
      ],
      contextInfo: {
        externalAdReply: {
          title: `🌟 ${BOT_METADATA.name} ${BOT_METADATA.version}`,
          body: `Active | ${uptime} Uptime`,
          thumbnailUrl: IDENTITY_BANNER,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: GITHUB_REPO
        }
      }
    });

    // Add identity reaction
    await sock.sendMessage(m.chat, {
      react: { text: "🤖", key: m.key }
    });
  },

  async handleEvent(m, { sock }) {
    const action = m.message?.templateButtonReplyMessage?.selectedId;
    
    if (action === "!bot specs") {
      return this.showTechSpecs(m, sock);
    }
    
    if (action === "!bot features") {
      return this.showFeatures(m, sock);
    }
  },

  generateSystemInfo(uptime, memory, platform) {
    return `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💎 *Version:* ${BOT_METADATA.version}
┃  🚀 *Release:* ${BOT_METADATA.release}
┃  ⏱️ *Uptime:* ${uptime}
┃  🧠 *AI Core:* GPT-4 Turbo
┃  🛡️ *Security:* ${BOT_METADATA.security}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👑 *Creator:* ${BOT_METADATA.creator}
🔊 *Prefixes:* ${BOT_METADATA.prefixes.join(" ")}
🌐 *Platform:* ${platform}
💾 *Memory:* ${memory}

📌 *Official Channels:*
▸ WhatsApp: ${CHANNEL_LINK}
▸ GitHub: ${GITHUB_REPO}`;
  },

  async showTechSpecs(m, sock) {
    const cpu = os.cpus()[0].model;
    const cores = os.cpus().length;
    const arch = os.arch();
    const node = process.version;
    const freeMem = formatBytes(os.freemem());
    
    await sock.sendMessage(m.chat, {
      text: `⚙️ *TECHNICAL SPECIFICATIONS*

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🖥️ *System Architecture:*
┃  ▸ Platform: ${os.platform()}
┃  ▸ Architecture: ${arch}
┃  ▸ Node.js: ${node}
┃  
┃  💻 *Hardware:*
┃  ▸ CPU: ${cpu.split(' ')[0]} (${cores} cores)
┃  ▸ Total RAM: ${formatBytes(os.totalmem())}
┃  ▸ Free RAM: ${freeMem}
┃  
┃  🤖 *Bot Framework:*
┃  ▸ Baileys: v4.4.0
┃  ▸ AI Providers: 3
┃  ▸ Security Layers: 5
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
🔧 _Powered by ALPHA-BLAKE Quantum Systems_`
    });
  },

  async showFeatures(m, sock) {
    const categories = {
      "🤖 AI Intelligence": ["gpt", "dalle", "bard", "deepseek", "stablediffusion"],
      "🛡️ Security": ["antivirus", "antispam", "antilink", "antiscam", "contentfilter"],
      "🎮 Entertainment": ["tictactoe", "trivia", "memes", "lyrics", "quiz"],
      "⚙️ Utilities": ["qr", "sticker", "translate", "calculator", "currency"],
      "🔍 Search": ["google", "youtube", "wikipedia", "weather", "location"]
    };

    const featuresList = Object.entries(categories)
      .map(([category, cmds]) => 
        `▸ *${category}:*\n   ${cmds.join(", ")}`)
      .join("\n\n");

    await sock.sendMessage(m.chat, {
      text: `✨ *${BOT_METADATA.features} POWERFUL FEATURES*

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  Our bot offers cutting-edge tools:
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${featuresList}

🔍 Use \`.help <category>\` for details
💡 Example: \`.help ai\``
    });
  }
};