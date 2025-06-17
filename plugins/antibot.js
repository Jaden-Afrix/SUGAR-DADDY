/*************************************************
 SUGAR DADDY - QUANTUM BOT DEFENDER v3.2
 Elite Group Security Protocol (Stable Release)
 Owner: ALPHA-BLAKE
**************************************************/

const fs = require("fs").promises
const path = require("path")
const DEFENSE_PATH = path.join(__dirname, "..", "config", "quantum_defense.json")

const AD_TEMPLATE = {
    title: "🤖 SUGAR DADDY AI",
    body: "Quantum Bot Defender",
    thumbnailUrl: "https://i.ibb.co/4RfnHtVr/SulaMd.jpg",
    mediaType: 1,
    renderLargerThumbnail: true,
    sourceUrl: "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24"
}

// Quantum Defense Matrix
const QUANTUM_DEFENSE = {
    maxWarnings: 2,
    cooldown: 30000,
    enabledGroups: {},
    botWarnings: {},
    lastAction: {}
}

// Initialize quantum defense
;(async () => {
    try {
        await fs.mkdir(path.dirname(DEFENSE_PATH), { recursive: true })
        const data = await fs.readFile(DEFENSE_PATH, "utf8")
        const savedData = JSON.parse(data)
        
        // Merge configurations safely
        Object.assign(QUANTUM_DEFENSE, {
            ...savedData,
            enabledGroups: savedData.enabledGroups || {},
            botWarnings: savedData.botWarnings || {},
            lastAction: savedData.lastAction || {}
        })
    } catch (e) {
        if (e.code !== 'ENOENT') console.error('[QUANTUM DEFENDER] Init error:', e.message)
    }
    await saveDefenseConfig() // Ensure config is saved after init
})()

// Save defense configuration (debounced)
let saveTimeout = null
const saveDefenseConfig = async () => {
    clearTimeout(saveTimeout)
    return new Promise(resolve => {
        saveTimeout = setTimeout(async () => {
            try {
                await fs.writeFile(DEFENSE_PATH, JSON.stringify(QUANTUM_DEFENSE))
                resolve(true)
            } catch (e) {
                console.error('[QUANTUM DEFENDER] Save error:', e.message)
                resolve(false)
            }
        }, 1000)
    })
}

// Advanced bot detection
const isQuantumThreat = (m) => {
    try {
        // Skip our own messages and non-message events
        if (!m.key || m.key.fromMe || !m.message) return false
        
        const sender = m.key.participant || m.key.remoteJid
        const pushName = (m.pushName || "").toLowerCase()
        
        // Detection matrix
        return (
            // Known bot patterns
            (m.key.id && /(BAE5|3EB0)/.test(m.key.id)) ||
            /\b(bot|automation|auto|script)\b/.test(pushName) ||
            
            // System message patterns
            Object.keys(m.message).some(type => 
                ['protocolMessage', 'ephemeralMessage', 'viewOnceMessage'].includes(type)
            )
        )
    } catch (e) {
        console.error("[THREAT DETECTION ERROR]", e.message)
        return false
    }
}

module.exports = {
    name: "antibot",
    alias: ["nobot", "blockbot"],
    category: "group",
    desc: "🤖 Quantum-powered bot defense system",
    use: "",

    async exec(m, { isGroup, isBotAdmin, isAdmin, sock }) {
        if (!isGroup) return m.reply("🚫 *GROUP COMMAND ONLY*\n┏━━━━━━━━━━━━━━┓\n┃ Use in group chats only\n┗━━━━━━━━━━━━━━┛")
        if (!isAdmin) return m.reply("🚫 *ADMIN REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Only admins can activate defense\n┗━━━━━━━━━━━━━━┛")
        if (!isBotAdmin) return m.reply("⚠️ *BOT ADMIN REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Promote bot to admin first\n┗━━━━━━━━━━━━━━┛")

        QUANTUM_DEFENSE.enabledGroups[m.chat] = true
        await saveDefenseConfig()

        return sock.sendMessage(m.chat, {
            text: `🛡️ *QUANTUM DEFENSE ACTIVATED*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🤖  𝗔𝗡𝗧𝗜-𝗕𝗢𝗧  𝗠𝗢𝗗𝗘: 𝗔𝗖𝗧𝗜𝗩𝗘
┃  ⚠️  𝗠𝗔𝗫 𝗪𝗔𝗥𝗡𝗜𝗡𝗚𝗦: ${QUANTUM_DEFENSE.maxWarnings}
┃  🔰  𝗕𝗢𝗧𝗦 𝗪𝗜𝗟𝗟 𝗕𝗘 𝗔𝗨𝗧𝗢-𝗞𝗜𝗖𝗞𝗘𝗗
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, { quoted: m })
    },

    async handler(m, { sock }) {
        try {
            if (!m.key || !m.key.remoteJid) return
            
            const chatId = m.key.remoteJid
            if (!QUANTUM_DEFENSE.enabledGroups[chatId]) return
            
            // Cooldown check
            const lastAction = QUANTUM_DEFENSE.lastAction[chatId] || 0
            const now = Date.now()
            if (now - lastAction < QUANTUM_DEFENSE.cooldown) return
            
            // Check if message is from potential bot
            if (isQuantumThreat(m)) {
                const user = m.key.participant || m.key.remoteJid
                if (!user) return
                
                // Initialize data structures
                if (!QUANTUM_DEFENSE.botWarnings[chatId]) QUANTUM_DEFENSE.botWarnings[chatId] = {}
                if (QUANTUM_DEFENSE.botWarnings[chatId][user] === undefined) {
                    QUANTUM_DEFENSE.botWarnings[chatId][user] = 0
                }
                
                QUANTUM_DEFENSE.botWarnings[chatId][user]++
                QUANTUM_DEFENSE.lastAction[chatId] = now
                await saveDefenseConfig()
                
                const warnCount = QUANTUM_DEFENSE.botWarnings[chatId][user]
                const maxWarnings = QUANTUM_DEFENSE.maxWarnings
                
                // Send warning
                if (warnCount <= maxWarnings) {
                    await sock.sendMessage(chatId, {
                        text: `⚠️ *BOT DETECTED [${warnCount}/${maxWarnings}]*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🤖  @${user.split('@')[0]} 
┃  🔰  𝗕𝗢𝗧-𝗟𝗜𝗞𝗘  𝗔𝗖𝗧𝗜𝗩𝗜𝗧𝗬  𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗
┃  ⚠️  𝗡𝗘𝗫𝗧  𝗩𝗜𝗢𝗟𝗔𝗧𝗜𝗢𝗡  𝗪𝗜𝗟𝗟  𝗥𝗘𝗦𝗨𝗟𝗧  𝗜𝗡  𝗞𝗜𝗢𝗞
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
                        mentions: [user],
                        contextInfo: { externalAdReply: AD_TEMPLATE }
                    })
                }
                
                // Remove bot if exceeds warnings
                if (warnCount > maxWarnings) {
                    try {
                        await sock.groupParticipantsUpdate(chatId, [user], "remove")
                        await sock.sendMessage(chatId, {
                            text: `🚫 *QUANTUM PURGE EXECUTED*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🤖  @${user.split('@')[0]} 
┃  🔰  𝗥𝗘𝗠𝗢𝗩𝗘𝗗  𝗙𝗢𝗥  𝗕𝗢𝗧  𝗔𝗖𝗧𝗜𝗩𝗜𝗧𝗬
┃  ⚡  𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬  𝗣𝗥𝗢𝗧𝗢𝗖𝗢𝗟: 𝟯.𝟮
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
                            mentions: [user],
                            contextInfo: { externalAdReply: AD_TEMPLATE }
                        })
                        
                        // Reset warnings
                        delete QUANTUM_DEFENSE.botWarnings[chatId][user]
                        await saveDefenseConfig()
                    } catch (err) {
                        if (err.message.includes('403')) {
                            // Disable defense if bot loses admin
                            delete QUANTUM_DEFENSE.enabledGroups[chatId]
                            await saveDefenseConfig()
                            await sock.sendMessage(chatId, {
                                text: `❌ *DEFENSE DISABLED*\nBot admin permissions revoked!`,
                                contextInfo: { externalAdReply: AD_TEMPLATE }
                            })
                        } else {
                            console.error("[QUANTUM DEFENDER] Kick failed:", err.message)
                        }
                    }
                }
            }
        } catch (e) {
            console.error("[QUANTUM DEFENDER] Handler error:", e.message)
        }
    }
}

// Additional commands for configuration
module.exports.defensesettings = {
    name: "defensesettings",
    alias: ["botdefense", "antibotconfig"],
    category: "group",
    desc: "⚙️ Configure quantum bot defense",
    use: "<warnings>",

    async exec(m, { args, isGroup, isAdmin, sock }) {
        if (!isGroup) return m.reply("🚫 *GROUP COMMAND ONLY*")
        if (!isAdmin) return m.reply("🚫 *ADMIN REQUIRED*")
        
        if (args.length === 0) {
            return sock.sendMessage(m.chat, {
                text: `⚙️ *CURRENT DEFENSE SETTINGS*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚠️  𝗠𝗔𝗫 𝗪𝗔𝗥𝗡𝗜𝗡𝗚𝗦: ${QUANTUM_DEFENSE.maxWarnings}
┃  ⏱️  𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡: ${QUANTUM_DEFENSE.cooldown/1000} seconds
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
Use: defensesettings <number-of-warnings>`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: m })
        }
        
        const newWarnings = parseInt(args[0])
        if (isNaN(newWarnings)) return m.reply("❌ Invalid number format")
        
        QUANTUM_DEFENSE.maxWarnings = Math.max(1, Math.min(5, newWarnings))
        await saveDefenseConfig()
        
        return sock.sendMessage(m.chat, {
            text: `✅ *DEFENSE UPDATED*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚠️  𝗠𝗔𝗫 𝗪𝗔𝗥𝗡𝗜𝗡𝗚𝗦: ${QUANTUM_DEFENSE.maxWarnings}
┃  🤖  𝗕𝗢𝗧𝗦 𝗪𝗜𝗟𝗟 𝗕𝗘 𝗞𝗜𝗖𝗞𝗘𝗗 𝗔𝗙𝗧𝗘𝗥 ${QUANTUM_DEFENSE.maxWarnings} warnings
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, { quoted: m })
    }
}