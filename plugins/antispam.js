/*************************************************
 SUGAR DADDY - ULTRA ANTI-SPAM COMMAND MODULE v2.0
 Advanced protection against command flooding
 Owner: ALPHA-BLAKE
**************************************************/

const fs = require("fs").promises
const path = require("path")
const cooldowns = new Map()

// Configurable settings
const COOLDOWN_TIME = 2000 // 2 seconds
const SPAM_FILE = path.join(__dirname, "..", "config", "antispam.json")
const AD_TEMPLATE = {
  title: "🔥 SUGAR DADDY 🔥",
  body: "Anti-Spam Protection System",
  thumbnailUrl: "https://i.ibb.co/4RfnHtVr/SulaMd.jpg",
  mediaType: 1,
  renderLargerThumbnail: true,
  sourceUrl: "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24"
}

// Initialize spam protection
let spamData = { enabled: true }

// Load config on startup
(async () => {
  try {
    const data = await fs.readFile(SPAM_FILE, 'utf8')
    spamData = JSON.parse(data)
    console.log(`[ANTI-SPAM] Config loaded: ${spamData.enabled ? 'ENABLED 🔒' : 'DISABLED ⚠️'}`)
  } catch {
    await fs.mkdir(path.dirname(SPAM_FILE), { recursive: true })
    await fs.writeFile(SPAM_FILE, JSON.stringify(spamData))
  }
})()

// Cooldown cleanup every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [user, timestamp] of cooldowns) {
    if (now - timestamp > 60000) cooldowns.delete(user)
  }
}, 300000)

module.exports = {
  name: "antispam",
  alias: ["spamblock", "nospam", "floodcontrol"],
  category: "owner",
  desc: "⚡ Toggle advanced command flood protection",
  use: "antispam on/off",
  
  async exec(m, { sock, args, isOwner, prefix }) {
    if (!isOwner) return m.reply("🚫 *Owner Only!* This command is restricted to bot owners")
    
    const option = args[0]?.toLowerCase()
    const response = { quoted: m }
    
    if (option === "on") {
      spamData.enabled = true
      await fs.writeFile(SPAM_FILE, JSON.stringify(spamData))
      return sock.sendMessage(m.chat, {
        text: `🛡️ *ANTI-SPAM ACTIVATED!*\n┏━━━━━━━━━━━━━━┓\n┃ ✅ 𝗘𝗡𝗔𝗕𝗟𝗘𝗗\n┃ ✨ 𝗙𝗟𝗢𝗢𝗗 𝗣𝗥𝗢𝗧𝗘𝗖𝗧𝗜𝗢𝗡\n┃ ⚡ 𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡: 𝟮𝘀\n┗━━━━━━━━━━━━━━┛\n_Commands are now rate-limited_`,
        contextInfo: { externalAdReply: AD_TEMPLATE }
      }, response)
    }
    
    if (option === "off") {
      spamData.enabled = false
      await fs.writeFile(SPAM_FILE, JSON.stringify(spamData))
      return sock.sendMessage(m.chat, {
        text: `⚠️ *ANTI-SPAM DEACTIVATED!*\n┏━━━━━━━━━━━━━━┓\n┃ ❌ 𝗗𝗜𝗦𝗔𝗕𝗟𝗘𝗗\n┃ 🚫 𝗡𝗢 𝗙𝗟𝗢𝗢𝗗 𝗟𝗜𝗠𝗜𝗧𝗦\n┃ 🔓 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗨𝗡𝗥𝗨𝗘𝗨𝗘𝗗\n┗━━━━━━━━━━━━━━┛\n_Use with caution!_`,
        contextInfo: { externalAdReply: AD_TEMPLATE }
      }, response)
    }
    
    sock.sendMessage(m.chat, {
      text: `⚙️ *ANTI-SPAM CONFIG*\n┌────────────────┐\n│ 🔄 ${prefix}antispam on\n│ └ Enable protection\n│\n│ 🔄 ${prefix}antispam off\n│ └ Disable protection\n└────────────────┘\n_Current status: ${spamData.enabled ? '🟢 ACTIVE' : '🔴 INACTIVE'}_`,
      contextInfo: { externalAdReply: AD_TEMPLATE }
    }, response)
  },
  
  async handler(m, { sock }) {
    if (!spamData.enabled) return
    
    const user = m.sender
    const now = Date.now()
    const lastTime = cooldowns.get(user) || 0
    
    if (now - lastTime < COOLDOWN_TIME) {
      // Send voice note and message simultaneously
      await Promise.all([
        sock.sendMessage(m.chat, {
          audio: { url: "https://files.catbox.moe/cebgdf.mp3" },
          mimetype: 'audio/mpeg',
          ptt: true
        }),
        sock.sendMessage(m.chat, {
          text: `⏳ *TOO FAST!*\n┏━━━━━━━━━━━━━━┓\n┃ 🚦 𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡 𝗔𝗖𝗧𝗜𝗩𝗘\n┃ ⏱️ 𝗪𝗔𝗜𝗧: ${(COOLDOWN_TIME/1000).toFixed(1)}𝘀\n┗━━━━━━━━━━━━━━┛\n_Please slow down your commands_`,
          contextInfo: { externalAdReply: AD_TEMPLATE }
        })
      ])
      return
    }
    
    cooldowns.set(user, now)
  }
}