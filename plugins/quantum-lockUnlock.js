/*************************************************
 SUGAR DADDY - QUANTUM LOCKDOWN SYSTEM v3.0
 Elite Access Control Protocol
 Owner: ALPHA-BLAKE
**************************************************/

const fs = require("fs").promises
const path = require("path")
const LOCKDOWN_FILE = path.join(__dirname, "..", "config", "quantum_lock.json")

const AD_TEMPLATE = {
    title: "🔒 SUGAR DADDY SECURITY",
    body: "Quantum Access Control",
    thumbnailUrl: "https://i.ibb.co/4RfnHtVr/SulaMd.jpg",
    mediaType: 1,
    renderLargerThumbnail: true,
    sourceUrl: "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24"
}

// Quantum Lock Matrix
const QUANTUM_LOCK = {
    mode: "public", // public/private
    owner: "",
    lastUpdated: new Date().toISOString(),
    authAttempts: 0
}

// Initialize quantum lock system
;(async () => {
    try {
        const data = await fs.readFile(LOCKDOWN_FILE, "utf8")
        Object.assign(QUANTUM_LOCK, JSON.parse(data))
        console.log(`[QUANTUM LOCK] Mode: ${QUANTUM_LOCK.mode.toUpperCase()} | Owner: ${QUANTUM_LOCK.owner}`)
    } catch {
        await fs.mkdir(path.dirname(LOCKDOWN_FILE), { recursive: true })
        await fs.writeFile(LOCKDOWN_FILE, JSON.stringify(QUANTUM_LOCK))
    }
})()

// Save lock configuration
const saveLockConfig = async () => {
    try {
        await fs.writeFile(LOCKDOWN_FILE, JSON.stringify(QUANTUM_LOCK))
        return true
    } catch (e) {
        console.error('[QUANTUM LOCK] Save error:', e.message)
        return false
    }
}

// Get authenticated bot number
const getBotNumber = (sock) => {
    return sock.user?.id?.split(":")[0] + '@c.us' || ""
}

module.exports = {
    name: "quantumlock",
    alias: ["lockdown", "securemode", "privatemode"],
    category: "security",
    desc: "🔒 Lock bot usage to authenticated number",
    use: "",

    async exec(m, { sock, isOwner }) {
        if (!isOwner) return m.reply("🚫 *QUANTUM SYSTEM LOCKED*\nOwner authentication required")

        const botNumber = getBotNumber(sock)
        if (!botNumber) {
            return sock.sendMessage(m.chat, {
                text: `❌ *AUTHENTICATION FAILURE*\n┏━━━━━━━━━━━━━━┓\n┃ Bot identity not verified\n┃ Lockdown protocol aborted\n┗━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: m })
        }

        QUANTUM_LOCK.mode = "private"
        QUANTUM_LOCK.owner = botNumber
        const success = await saveLockConfig()

        if (!success) {
            return sock.sendMessage(m.chat, {
                text: `❌ *LOCKDOWN FAILED*\n┏━━━━━━━━━━━━━━┓\n┃ Quantum database unreachable\n┗━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: m })
        }

        return sock.sendMessage(m.chat, {
            text: `🔐 *QUANTUM LOCKDOWN ACTIVATED*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🛡️  𝗔𝗖𝗖𝗘𝗦𝗦  𝗥𝗘𝗦𝗧𝗥𝗜𝗖𝗧𝗘𝗗
┃  🤖  𝗢𝗡𝗟𝗬  𝗔𝗨𝗧𝗛𝗘𝗡𝗧𝗜𝗖𝗔𝗧𝗘𝗗  𝗕𝗢𝗧
┃  🔒  𝗜𝗗: ${botNumber}
┃  ⚠️  𝗔𝗟𝗟  𝗢𝗧𝗛𝗘𝗥𝗦  𝗕𝗟𝗢𝗖𝗞𝗘𝗗
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, { quoted: m })
    }
}

module.exports.quantumunlock = {
    name: "quantumunlock",
    alias: ["publicmode", "unlock"],
    category: "security",
    desc: "🔓 Restore public access mode",
    use: "",

    async exec(m, { sock, isOwner }) {
        if (!isOwner) return m.reply("🚫 *QUANTUM SYSTEM LOCKED*\nOwner authentication required")

        QUANTUM_LOCK.mode = "public"
        QUANTUM_LOCK.owner = ""
        const success = await saveLockConfig()

        if (!success) {
            return sock.sendMessage(m.chat, {
                text: `❌ *UNLOCK FAILED*\n┏━━━━━━━━━━━━━━┓\n┃ Quantum database unreachable\n┗━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: m })
        }

        return sock.sendMessage(m.chat, {
            text: `🔓 *QUANTUM LOCKDOWN DEACTIVATED*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🌐  𝗣𝗨𝗕𝗟𝗜𝗖  𝗔𝗖𝗖𝗘𝗦𝗦  𝗥𝗘𝗦𝗧𝗢𝗥𝗘𝗗
┃  👥  𝗔𝗟𝗟  𝗨𝗦𝗘𝗥𝗦  𝗖𝗔𝗡  𝗜𝗡𝗧𝗘𝗥𝗔𝗖𝗧
┃  ⚡  𝗦𝗬𝗦𝗧𝗘𝗠  𝗦𝗧𝗔𝗧𝗨𝗦: 𝗣𝗨𝗕𝗟𝗜𝗖
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, { quoted: m })
    }
}

module.exports.lockstatus = {
    name: "lockstatus",
    alias: ["mode", "securitystatus"],
    category: "security",
    desc: "🔍 View quantum lockdown status",
    use: "",

    async exec(m, { sock, isOwner }) {
        if (!isOwner) return m.reply("🚫 *QUANTUM SYSTEM LOCKED*\nOwner authentication required")

        const status = QUANTUM_LOCK.mode === "private" 
            ? `🔒 𝗟𝗢𝗖𝗞𝗘𝗗\n┃  🤖 𝗢𝗡𝗟𝗬: ${QUANTUM_LOCK.owner}` 
            : "🔓 𝗣𝗨𝗕𝗟𝗜𝗖\n┃  👥 𝗔𝗟𝗟 𝗨𝗦𝗘𝗥𝗦"

        return sock.sendMessage(m.chat, {
            text: `⚡ *QUANTUM LOCKDOWN STATUS*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔐 𝗠𝗢𝗗𝗘: ${status}
┃  ⏱️ 𝗟𝗔𝗦𝗧 𝗨𝗣𝗗𝗔𝗧𝗘𝗗: ${new Date(QUANTUM_LOCK.lastUpdated).toLocaleString()}
┃  🚦 𝗔𝗨𝗧𝗛 𝗔𝗧𝗧𝗘𝗠𝗣𝗧𝗦: ${QUANTUM_LOCK.authAttempts}
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, { quoted: m })
    }
}

// Quantum Enforcement Protocol
module.exports.enforceLock = async (sender, sock) => {
    if (QUANTUM_LOCK.mode === "private") {
        const botNumber = getBotNumber(sock)
        
        // Track authentication attempts
        if (sender !== botNumber) {
            QUANTUM_LOCK.authAttempts++
            await saveLockConfig()
            
            // Auto-block suspicious users after 3 attempts
            if (QUANTUM_LOCK.authAttempts >= 3) {
                try {
                    await sock.sendMessage(sender, {
                        text: `🚫 *ACCESS VIOLATION*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚠️  𝗠𝗨𝗟𝗧𝗜𝗣𝗟𝗘  𝗔𝗖𝗖𝗘𝗦𝗦  𝗔𝗧𝗧𝗘𝗠𝗣𝗧𝗦
┃  🔒  𝗬𝗢𝗨𝗥  𝗡𝗨𝗠𝗕𝗘𝗥  𝗛𝗔𝗦  𝗕𝗘𝗘𝗡  𝗕𝗟𝗢𝗖𝗞𝗘𝗗
┃  📵  𝗖𝗢𝗡𝗧𝗔𝗖𝗧  𝗢𝗪𝗡𝗘𝗥  𝗙𝗢𝗥  𝗔𝗦𝗦𝗜𝗦𝗧𝗔𝗡𝗖𝗘
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
                        contextInfo: { externalAdReply: AD_TEMPLATE }
                    })
                    await sock.updateBlockStatus(sender, "block")
                } catch (e) {
                    console.error('[QUANTUM LOCK] Auto-block failed:', e.message)
                }
            }
            
            return false
        }
        
        // Reset counter for valid user
        if (QUANTUM_LOCK.authAttempts > 0) {
            QUANTUM_LOCK.authAttempts = 0
            await saveLockConfig()
        }
    }
    return true
}