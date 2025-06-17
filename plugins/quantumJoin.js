/*************************************************
 SUGAR DADDY - QUANTUM GROUP JOINER v3.0
 Elite Group Integration System
 Owner: ALPHA-BLAKE
**************************************************/

const fs = require("fs").promises
const path = require("path")
const JOIN_LOG = path.join(__dirname, "..", "session", "group_joins.log")
const COOLDOWN_FILE = path.join(__dirname, "..", "config", "joiner_cooldown.json")

const AD_TEMPLATE = {
    title: "🚀 SUGAR DADDY BOT",
    body: "Quantum Group Integration",
    thumbnailUrl: "https://i.ibb.co/4RfnHtVr/SulaMd.jpg",
    mediaType: 1,
    renderLargerThumbnail: true,
    sourceUrl: "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24"
}

// Cooldown management
const joinCooldown = {
    lastJoin: 0,
    cooldown: 300000 // 5 minutes
}

// Load cooldown data
;(async () => {
    try {
        const data = await fs.readFile(COOLDOWN_FILE, 'utf8')
        Object.assign(joinCooldown, JSON.parse(data))
    } catch {
        await fs.writeFile(COOLDOWN_FILE, JSON.stringify(joinCooldown))
    }
})()

// Log join events
const logJoin = async (code, success, groupId = "") => {
    const timestamp = new Date().toISOString()
    const status = success ? "SUCCESS" : "FAILED"
    const entry = `[${timestamp}] ${status} | Code: ${code} | Group: ${groupId}\n`
    
    try {
        await fs.appendFile(JOIN_LOG, entry)
    } catch (e) {
        console.error("JOIN LOG ERROR:", e.message)
    }
}

// Extract invite code from link
const getInviteCodeFromLink = (link) => {
    const regex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{22})/
    const match = link.match(regex)
    return match ? match[1] : null
}

module.exports = {
    name: "quantumjoin",
    alias: ["qjoin", "elitejoin", "groupjoin"],
    category: "owner",
    desc: "🚀 Join groups via invite links (Quantum Protocol)",
    use: "<group-link> or reply",

    async exec(m, { sock, args, isOwner }) {
        if (!isOwner) return m.reply("🚫 *QUANTUM SYSTEM LOCKED*\nOwner authentication required")

        // Check cooldown
        const now = Date.now()
        const timeLeft = joinCooldown.lastJoin + joinCooldown.cooldown - now
        if (timeLeft > 0) {
            const minutes = Math.ceil(timeLeft / 60000)
            return m.reply(`⌛ *SYSTEM COOLDOWN*\n┏━━━━━━━━━━━━━━┓\n┃ ⏳ Try again in ${minutes} min\n┃ 🔧 Security protocol active\n┗━━━━━━━━━━━━━━┛`)
        }

        let groupLink = args[0]
        if (!groupLink && m.quoted && m.quoted.text) groupLink = m.quoted.text.trim()

        if (!groupLink || !groupLink.includes("chat.whatsapp.com")) {
            return sock.sendMessage(m.chat, {
                text: `❌ *INVALID GROUP LINK*\n┏━━━━━━━━━━━━━━┓\n┃ Use WhatsApp group invite\n┃ Format: https://chat.whatsapp.com/...\n┗━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: m })
        }

        try {
            const inviteCode = getInviteCodeFromLink(groupLink)
            if (!inviteCode) throw new Error("Invalid invite code format")

            // Join group
            const response = await sock.groupAcceptInvite(inviteCode)
            const groupId = response.gid
            const groupInfo = await sock.groupMetadata(groupId)
            const participants = groupInfo.participants.length

            // Update cooldown
            joinCooldown.lastJoin = now
            await fs.writeFile(COOLDOWN_FILE, JSON.stringify(joinCooldown))
            await logJoin(inviteCode, true, groupId)

            // Success message
            return sock.sendMessage(m.chat, {
                text: `🚀 *GROUP INTEGRATION SUCCESSFUL*\n
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✅  𝗤𝗨𝗔𝗡𝗧𝗨𝗠  𝗝𝗢𝗜𝗡  𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘
┃  🔰  𝗚𝗥𝗢𝗨𝗣: ${groupInfo.subject}
┃  👥  𝗠𝗘𝗠𝗕𝗘𝗥𝗦: ${participants}
┃  🔒  𝗜𝗗: ${groupId}
┗━━━━━━━━━━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: m })

        } catch (e) {
            await logJoin(getInviteCodeFromLink(groupLink) || "UNKNOWN", false)
            let errorMsg = "❌ *JOIN FAILED*"

            if (e.message.includes("rejected")) {
                errorMsg += "\n┏━━━━━━━━━━━━━━┓\n┃ 🛑 Request rejected by group\n┃ 🔒 Privacy settings may prevent joining\n┗━━━━━━━━━━━━━━┛"
            } else if (e.message.includes("expired")) {
                errorMsg += "\n┏━━━━━━━━━━━━━━┓\n┃ ⏳ Invite link has expired\n┃ 🔗 Get a new invite from the group\n┗━━━━━━━━━━━━━━┛"
            } else if (e.message.includes("full")) {
                errorMsg += "\n┏━━━━━━━━━━━━━━┓\n┃ 🚫 Group is at maximum capacity\n┃ 👥 Remove members to add bot\n┗━━━━━━━━━━━━━━┛"
            } else {
                errorMsg += `\n┏━━━━━━━━━━━━━━┓\n┃ ⚠️ ${e.message || 'Unknown error'}\n┗━━━━━━━━━━━━━━┛`
            }

            return sock.sendMessage(m.chat, {
                text: errorMsg,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: m })
        }
    }
}