/*************************************************
 SUGAR DADDY - ANTI-LINK DEFENSE v2.0
 Group Link Filter & Auto-Kick System
 Owner: ALPHA-BLAKE
**************************************************/

const fs = require("fs").promises
const path = require("path")
const WARN_FILE = path.join(__dirname, "..", "config", "link_warnings.json")

const AD_TEMPLATE = {
    title: "🛡️ SUGAR DADDY GUARDIAN",
    body: "Link Protection Activated",
    thumbnailUrl: "https://i.ibb.co/4RfnHtVr/SulaMd.jpg",
    mediaType: 1,
    renderLargerThumbnail: true,
    sourceUrl: "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24"
}

const MAX_WARNINGS = 2
let warningMap = {}

// Load warning cache
;(async () => {
    try {
        const data = await fs.readFile(WARN_FILE, "utf8")
        warningMap = JSON.parse(data)
    } catch {
        await fs.writeFile(WARN_FILE, JSON.stringify({}))
    }
})()

async function saveWarnings() {
    await fs.writeFile(WARN_FILE, JSON.stringify(warningMap))
}

module.exports = {
    name: "antilink",
    alias: ["linkblock", "nolink"],
    category: "group",
    desc: "🚫 Block links in groups and auto-kick repeat offenders",
    use: "",

    async exec(m, { isGroup, isAdmin, isBotAdmin, sock }) {
        if (!isGroup) return m.reply("❌ Only usable in groups.")
        if (!isAdmin) return m.reply("❌ Only admins can activate anti-link.")
        if (!isBotAdmin) return m.reply("⚠️ Bot must be admin to kick users.")

        if (!global.antilinkGroups) global.antilinkGroups = {}
        global.antilinkGroups[m.chat] = true

        return sock.sendMessage(m.chat, {
            text: `🔗 *ANTI-LINK SYSTEM ACTIVATED*\nSending links will now be blocked.`,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, { quoted: m })
    },

    async monitor(m, sock) {
        const chat = m.key.remoteJid
        const sender = m.key.participant || m.key.remoteJid
        const message = m.message?.conversation || m.message?.extendedTextMessage?.text || ""

        if (!global.antilinkGroups || !global.antilinkGroups[chat]) return
        if (m.key.fromMe || !message) return
        if (!message.includes("http")) return

        const linkPattern = /https?:\/\/[^\s]+/gi
        const foundLinks = message.match(linkPattern)
        if (!foundLinks) return

        if (!warningMap[chat]) warningMap[chat] = {}
        if (!warningMap[chat][sender]) warningMap[chat][sender] = 0

        warningMap[chat][sender]++
        await saveWarnings()

        const warningCount = warningMap[chat][sender]

        if (warningCount <= MAX_WARNINGS) {
            await sock.sendMessage(chat, {
                text: `⚠️ *WARNING ${warningCount}/${MAX_WARNINGS}*\n@${sender.split("@")[0]} do not send links in this group.`,
                mentions: [sender],
                contextInfo: { externalAdReply: AD_TEMPLATE }
            })
        } else {
            try {
                await sock.groupParticipantsUpdate(chat, [sender], "remove")
                await sock.sendMessage(chat, {
                    text: `🚫 *USER REMOVED*\n@${sender.split("@")[0]} was kicked for repeated link sharing.`,
                    mentions: [sender],
                    contextInfo: { externalAdReply: AD_TEMPLATE }
                })
            } catch (e) {
                console.error("[ANTILINK] Removal failed:", e.message)
                await sock.sendMessage(chat, {
                    text: `❌ Could not kick @${sender.split("@")[0]}. Make sure the bot is admin.`,
                    mentions: [sender]
                })
            }
        }
    }
}