/*************************************************
 SUGAR DADDY - NSFW GUARD v3.0
 Porn Detection & Enforcement Engine
 Owner: ALPHA-BLAKE
**************************************************/

const fs = require("fs").promises
const path = require("path")
const { fromBuffer } = require("file-type")
const WARN_FILE = path.join(__dirname, "..", "config", "nsfw_warnings.json")

const MAX_WARNINGS = 2
let nsfwWarnings = {}

const AD_TEMPLATE = {
  title: "🔞 SUGAR DADDY GUARDIAN",
  body: "NSFW Protection Active",
  thumbnailUrl: "https://i.ibb.co/4RfnHtVr/SulaMd.jpg",
  mediaType: 1,
  renderLargerThumbnail: true,
  sourceUrl: "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24"
}

// Load warnings from file
;
(async () => {
  try {
    const data = await fs.readFile(WARN_FILE, "utf8")
    nsfwWarnings = JSON.parse(data)
  } catch {
    await fs.writeFile(WARN_FILE, JSON.stringify({}))
  }
})()

async function saveWarnings() {
  await fs.writeFile(WARN_FILE, JSON.stringify(nsfwWarnings))
}

// Simple porn keyword detector
const isNsfwText = (text) => {
  const badWords = [
    "porn", "xnxx", "xvideos", "redtube", "nude", "boobs",
    "sex", "fuck", "anal", "pussy", "xxx", "s3x", "dick",
    "blowjob", "naked", "tits", "ass", "onlyfans", "camgirl"
  ]
  text = text.toLowerCase()
  return badWords.some(word => text.includes(word))
}

module.exports = {
  name: "antinfsw",
  alias: ["nsfwblock", "nudenuke"],
  category: "group",
  desc: "🚫 Block NSFW content in group chats",
  use: "",
  
  async exec(m, { isAdmin, isGroup, isBotAdmin, sock }) {
    if (!isGroup) return m.reply("❌ Only usable in groups.")
    if (!isAdmin) return m.reply("❌ Admin access required.")
    if (!isBotAdmin) return m.reply("⚠️ Bot must be admin to kick users.")
    
    if (!global.antiNfswGroups) global.antiNfswGroups = {}
    global.antiNfswGroups[m.chat] = true
    
    return sock.sendMessage(m.chat, {
      text: `🔞 *NSFW DETECTION ENABLED*\nNude and adult content will now be blocked.`,
      contextInfo: { externalAdReply: AD_TEMPLATE }
    }, { quoted: m })
  },
  
  async monitor(m, sock) {
    const chat = m.key.remoteJid
    const sender = m.key.participant || m.key.remoteJid
    const msg = m.message
    
    if (!global.antiNfswGroups || !global.antiNfswGroups[chat]) return
    if (m.key.fromMe) return
    
    let nsfwDetected = false
    
    // Text-based detection
    const text = msg?.conversation || msg?.extendedTextMessage?.text
    if (text && isNsfwText(text)) nsfwDetected = true
    
    // Check for suspicious link domains
    const suspiciousLinks = /(pornhub\.com|onlyfans\.com|xvideos\.com|xnxx\.com|redtube\.com|nsfw)/i
    if (text && suspiciousLinks.test(text)) nsfwDetected = true
    
    // Media-based detection
    const isMedia =
      msg?.imageMessage ||
      msg?.videoMessage ||
      msg?.documentMessage
    
    if (isMedia) {
      try {
        const buffer = await sock.downloadMediaMessage(m)
        const type = await fromBuffer(buffer)
        
        if (
          type && ["image", "video"].includes(type.mime.split("/")[0]) &&
          isNsfwText(type.mime)
        ) {
          nsfwDetected = true
        }
      } catch (e) {
        console.error("[ANTINSFW] Media analysis failed:", e.message)
      }
    }
    
    if (nsfwDetected) {
      if (!nsfwWarnings[chat]) nsfwWarnings[chat] = {}
      if (!nsfwWarnings[chat][sender]) nsfwWarnings[chat][sender] = 0
      
      nsfwWarnings[chat][sender]++
      await saveWarnings()
      
      const warnings = nsfwWarnings[chat][sender]
      
      if (warnings <= MAX_WARNINGS) {
        await sock.sendMessage(chat, {
          text: `🔞 *NSFW WARNING ${warnings}/${MAX_WARNINGS}*\n@${sender.split("@")[0]}, posting adult content is forbidden.`,
          mentions: [sender],
          contextInfo: { externalAdReply: AD_TEMPLATE }
        })
      } else {
        try {
          await sock.groupParticipantsUpdate(chat, [sender], "remove")
          await sock.sendMessage(chat, {
            text: `🚫 *USER REMOVED*\n@${sender.split("@")[0]} was kicked for repeated NSFW content.`,
            mentions: [sender],
            contextInfo: { externalAdReply: AD_TEMPLATE }
          })
        } catch (e) {
          console.error("[ANTINSFW] Kick failed:", e.message)
        }
      }
    }
  }
}