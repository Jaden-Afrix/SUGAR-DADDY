/*************************************************
 SUGAR DADDY - QUANTUM TYPING ENGINE v3.0
 Advanced AI-Powered Typing Simulation System
 Owner: ALPHA-BLAKE
**************************************************/

const fs = require("fs").promises
const path = require("path")
const TYPING_FILE = path.join(__dirname, "..", "config", "quantumtype.json")

// Quantum typing matrix
const QUANTUM_MATRIX = {
    active: true,
    groups: true,
    duration: 5, // seconds
    intensity: 3, // 1-5 scale
    lastUpdated: new Date().toISOString()
}

const AD_TEMPLATE = {
    title: "🤖 SUGAR DADDY AI",
    body: "Quantum Typing System",
    thumbnailUrl: "https://i.ibb.co/4RfnHtVr/SulaMd.jpg",
    mediaType: 1,
    renderLargerThumbnail: true,
    sourceUrl: "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24"
}

// Cooldown system to prevent flooding
const typingCooldown = new Map()
const COOLDOWN_BASE = 8000 // ms

// Initialize quantum core
;(async () => {
    try {
        const data = await fs.readFile(TYPING_FILE, 'utf8')
        Object.assign(QUANTUM_MATRIX, JSON.parse(data))
        console.log(`[QUANTUM TYPE] ${QUANTUM_MATRIX.active ? '⚡ ACTIVE' : '💤 SLEEPING'} | Groups: ${QUANTUM_MATRIX.groups ? '✅' : '❌'} | Intensity: ${'🔥'.repeat(QUANTUM_MATRIX.intensity)}`)
    } catch {
        await fs.mkdir(path.dirname(TYPING_FILE), { recursive: true })
        await fs.writeFile(TYPING_FILE, JSON.stringify(QUANTUM_MATRIX))
    }
})()

module.exports = {
    name: "quantumtype",
    alias: ["smarttype", "autotype", "typing"],
    category: "ai",
    desc: "⌨️ Quantum-powered typing simulation system",
    use: "<on/off/groups/intensity/duration>",

    async exec(m, { sock, args, isOwner }) {
        if (!isOwner) return m.reply("🚫 *QUANTUM SYSTEM LOCKED*\nOwner authentication required")

        const action = args[0]?.toLowerCase()
        const param = args[1]?.toLowerCase()
        const response = { quoted: m }

        switch(action) {
            case "on":
                QUANTUM_MATRIX.active = true
                QUANTUM_MATRIX.lastUpdated = new Date().toISOString()
                await fs.writeFile(TYPING_FILE, JSON.stringify(QUANTUM_MATRIX))
                return sock.sendMessage(m.chat, {
                    text: `⚡ *QUANTUM TYPING ACTIVATED*\n
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✅  𝗤𝗨𝗔𝗡𝗧𝗨𝗠  𝗧𝗬𝗣𝗜𝗡𝗚  𝗘𝗡𝗔𝗕𝗟𝗘𝗗
┃  🤖  𝗔𝗜  𝗦𝗜𝗠𝗨𝗟𝗔𝗧𝗜𝗢𝗡: 𝗨𝗟𝗧𝗥𝗔-𝗥𝗘𝗔𝗟𝗜𝗦𝗧𝗜𝗖
┃  ⚙️  𝗜𝗡𝗧𝗘𝗡𝗦𝗜𝗧𝗬: ${'🔥'.repeat(QUANTUM_MATRIX.intensity)}
┗━━━━━━━━━━━━━━━━━━━━━━━┛`,
                    contextInfo: { externalAdReply: AD_TEMPLATE }
                }, response)

            case "off":
                QUANTUM_MATRIX.active = false
                QUANTUM_MATRIX.lastUpdated = new Date().toISOString()
                await fs.writeFile(TYPING_FILE, JSON.stringify(QUANTUM_MATRIX))
                return sock.sendMessage(m.chat, {
                    text: `💤 *QUANTUM TYPING DEACTIVATED*\n
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ❌  𝗧𝗬𝗣𝗜𝗡𝗚  𝗦𝗜𝗠𝗨𝗟𝗔𝗧𝗜𝗢𝗡  𝗗𝗜𝗦𝗔𝗕𝗟𝗘𝗗
┃  ⏳  𝗤𝗨𝗔𝗡𝗧𝗨𝗠  𝗘𝗡𝗚𝗜𝗡𝗘: 𝗦𝗧𝗔𝗡𝗗𝗕𝗬
┗━━━━━━━━━━━━━━━━━━━━━━━┛`,
                    contextInfo: { externalAdReply: AD_TEMPLATE }
                }, response)

            case "groups":
                QUANTUM_MATRIX.groups = !QUANTUM_MATRIX.groups
                await fs.writeFile(TYPING_FILE, JSON.stringify(QUANTUM_MATRIX))
                return sock.sendMessage(m.chat, {
                    text: `⚙️ *GROUP TYPING ${QUANTUM_MATRIX.groups ? 'ENABLED' : 'DISABLED'}*\n
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🧠  𝗚𝗥𝗢𝗨𝗣  𝗠𝗢𝗗𝗘: ${QUANTUM_MATRIX.groups ? '✅ 𝗔𝗖𝗧𝗜𝗩𝗘' : '❌ 𝗢𝗙𝗙'}
┃  💬  𝗧𝗬𝗣𝗜𝗡𝗚  𝗜𝗡  𝗚𝗥𝗢𝗨𝗣𝗦: ${QUANTUM_MATRIX.groups ? '𝗘𝗡𝗔𝗕𝗟𝗘𝗗' : '𝗗𝗜𝗦𝗔𝗕𝗟𝗘𝗗'}
┗━━━━━━━━━━━━━━━━━━━━━━━┛`,
                    contextInfo: { externalAdReply: AD_TEMPLATE }
                }, response)

            case "intensity":
                if (!param || isNaN(param)) return m.reply("Specify intensity level (1-5)")
                const level = Math.min(5, Math.max(1, parseInt(param)))
                QUANTUM_MATRIX.intensity = level
                await fs.writeFile(TYPING_FILE, JSON.stringify(QUANTUM_MATRIX))
                return sock.sendMessage(m.chat, {
                    text: `🔥 *TYPING INTENSITY SET TO ${level}*\n
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚡  𝗧𝗬𝗣𝗜𝗡𝗚  𝗙𝗥𝗘𝗤𝗨𝗘𝗡𝗖𝗬: ${'▰'.repeat(level)}${'▱'.repeat(5-level)}
┃  🤖  𝗥𝗘𝗔𝗟𝗜𝗦𝗠: ${level < 3 ? '𝗟𝗜𝗚𝗛𝗧' : level < 5 ? '𝗠𝗢𝗗𝗘𝗥𝗔𝗧𝗘' : '𝗘𝗫𝗧𝗥𝗘𝗠𝗘'}
┗━━━━━━━━━━━━━━━━━━━━━━━┛`,
                    contextInfo: { externalAdReply: AD_TEMPLATE }
                }, response)

            case "duration":
                if (!param || isNaN(param)) return m.reply("Specify duration in seconds (2-15)")
                const seconds = Math.min(15, Math.max(2, parseInt(param)))
                QUANTUM_MATRIX.duration = seconds
                await fs.writeFile(TYPING_FILE, JSON.stringify(QUANTUM_MATRIX))
                return sock.sendMessage(m.chat, {
                    text: `⏱️ *TYPING DURATION SET TO ${seconds}s*\n
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⌛  𝗧𝗬𝗣𝗜𝗡𝗚  𝗟𝗘𝗡𝗚𝗧𝗛: ${'⏳'.repeat(seconds)} 
┃  🤖  𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘  𝗧𝗜𝗠𝗘: ${seconds < 5 ? '𝗙𝗔𝗦𝗧' : seconds < 10 ? '𝗡𝗔𝗧𝗨𝗥𝗔𝗟' : '𝗗𝗘𝗟𝗜𝗕𝗘𝗥𝗔𝗧𝗘'}
┗━━━━━━━━━━━━━━━━━━━━━━━┛`,
                    contextInfo: { externalAdReply: AD_TEMPLATE }
                }, response)

            default:
                return sock.sendMessage(m.chat, {
                    text: `⚡ *QUANTUM TYPING SYSTEM*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔄  \`quantumtype on\`
┃      └ Activate AI typing
┃
┃  🔄  \`quantumtype off\`
┃      └ Deactivate AI typing
┃
┃  🔄  \`quantumtype groups\`
┃      └ Toggle group typing
┃
┃  🔥  \`quantumtype intensity <1-5>\`
┃      └ Set typing frequency
┃
┃  ⏱️  \`quantumtype duration <2-15>\`
┃      └ Set typing duration (seconds)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
» Status: ${QUANTUM_MATRIX.active ? '🟢 ACTIVE' : '🔴 INACTIVE'}
» Groups: ${QUANTUM_MATRIX.groups ? '✅ ENABLED' : '❌ DISABLED'}
» Intensity: ${'▰'.repeat(QUANTUM_MATRIX.intensity)}${'▱'.repeat(5-QUANTUM_MATRIX.intensity)}
» Duration: ${QUANTUM_MATRIX.duration}s`,
                    contextInfo: { externalAdReply: AD_TEMPLATE }
                }, response)
        }
    },

    async handler(m, { sock }) {
        // System checks
        if (!QUANTUM_MATRIX.active || m.fromMe) return
        if (m.isGroup && !QUANTUM_MATRIX.groups) return
        
        // Cooldown management
        const chatKey = m.isGroup ? m.chat : m.sender
        const lastTyped = typingCooldown.get(chatKey) || 0
        const cooldown = COOLDOWN_BASE / QUANTUM_MATRIX.intensity
        
        if (Date.now() - lastTyped < cooldown) return
        typingCooldown.set(chatKey, Date.now())
        
        try {
            // Start typing simulation
            await sock.sendPresenceUpdate('composing', m.chat)
            
            // Calculate dynamic duration
            const duration = QUANTUM_MATRIX.duration * 1000
            
            // Stop typing after duration
            setTimeout(async () => {
                try {
                    await sock.sendPresenceUpdate('paused', m.chat)
                } catch (e) {
                    console.error(`[QUANTUM TYPE] ${e.message}`)
                }
            }, duration)
        } catch (e) {
            console.error(`[QUANTUM TYPE] ${e.message}`)
        }
    }
}