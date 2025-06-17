/*************************************************
 SUGAR DADDY - HYPER REACT SYSTEM v2.0
 Advanced AI-powered message reactions
 Owner: ALPHA-BLAKE
**************************************************/

const fs = require("fs").promises
const path = require("path")
const REACT_FILE = path.join(__dirname, "..", "config", "hyperreact.json")

// Premium emoji collection (100 curated reactions)
const REACT_DATABASE = [
    "😂", "🔥", "❤️", "💯", "😎", "🥵", "🥶", "😳", "😭", "😱",
    "😈", "👀", "💀", "🤖", "😐", "😏", "👻", "🎉", "🙈", "💸",
    "✨", "🌚", "🤑", "🤡", "🤫", "🍆", "🍑", "🔞", "🧠", "🔪",
    "☠️", "🤬", "😡", "😤", "😩", "🤯", "😵‍💫", "🖕", "🫣", "🫡",
    "😴", "😬", "🤓", "🧐", "🥲", "🙃", "😶‍🌫️", "🌟", "🫥", "🫠",
    "🤩", "🥰", "🥳", "🤪", "😜", "🤗", "🫢", "🤭", "🫥", "🥴",
    "🫤", "😶", "😑", "😒", "🙄", "🤔", "🤥", "🤐", "🫨", "🥱",
    "😪", "😮‍💨", "😮", "😯", "😲", "🥹", "😣", "😖", "😫", "🧊",
    "⚡", "💥", "🫶", "🤟", "🤘", "🫰", "✌️", "🤌", "🫳", "🫴",
    "💅", "🤳", "💃", "🕺", "👑", "💎", "👽", "🤠", "🥷", "🦹"
]

// Reaction intelligence matrix
const REACT_MATRIX = {
    active: true,
    groups: true,
    speed: 1.0,
    lastUpdated: new Date().toISOString()
}

const AD_TEMPLATE = {
    title: "🤖 SUGAR DADDY AI",
    body: "Hyper Reaction System",
    thumbnailUrl: "https://i.ibb.co/4RfnHtVr/SulaMd.jpg",
    mediaType: 1,
    renderLargerThumbnail: true,
    sourceUrl: "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24"
}

// Turbo initialization
;(async () => {
    try {
        const data = await fs.readFile(REACT_FILE, 'utf8')
        Object.assign(REACT_MATRIX, JSON.parse(data))
        console.log(`[HYPER REACT] ${REACT_MATRIX.active ? '⚡ ACTIVE' : '💤 SLEEPING'} | Groups: ${REACT_MATRIX.groups ? '✅' : '❌'}`)
    } catch {
        await fs.mkdir(path.dirname(REACT_FILE), { recursive: true })
        await fs.writeFile(REACT_FILE, JSON.stringify(REACT_MATRIX))
    }
})()

// Cooldown system (user-based)
const reactionCooldown = new Map()

module.exports = {
    name: "hyperreact",
    alias: ["autoreact", "smartreact", "aireact"],
    category: "ai",
    desc: "🤖 AI-powered automatic message reactions",
    use: "<on/off/groups>",

    async exec(m, { sock, args, isOwner }) {
        if (!isOwner) return m.reply("🚫 *AI SYSTEM LOCKED*\nOwner authentication required")

        const action = args[0]?.toLowerCase()
        const response = { quoted: m }

        switch(action) {
            case "on":
                REACT_MATRIX.active = true
                REACT_MATRIX.lastUpdated = new Date().toISOString()
                await fs.writeFile(REACT_FILE, JSON.stringify(REACT_MATRIX))
                return sock.sendMessage(m.chat, {
                    text: `🤖 *HYPER REACT ACTIVATED*\n
┏━━━━━━━━━━━━━━━━━━━━┓
┃  ✅  𝗔𝗜  𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦  𝗘𝗡𝗔𝗕𝗟𝗘𝗗
┃  ⚡  𝗥𝗘𝗔𝗖𝗧  𝗦𝗣𝗘𝗘𝗗: 𝗨𝗟𝗧𝗥𝗔
┃  💫  𝗖𝗨𝗥𝗔𝗧𝗘𝗗  𝗘𝗠𝗢𝗝𝗜𝗦: 𝟭𝟬𝟬+
┗━━━━━━━━━━━━━━━━━━━━┛`,
                    contextInfo: { externalAdReply: AD_TEMPLATE }
                }, response)

            case "off":
                REACT_MATRIX.active = false
                REACT_MATRIX.lastUpdated = new Date().toISOString()
                await fs.writeFile(REACT_FILE, JSON.stringify(REACT_MATRIX))
                return sock.sendMessage(m.chat, {
                    text: `💤 *HYPER REACT DEACTIVATED*\n
┏━━━━━━━━━━━━━━━━━━━━┓
┃  🚫  𝗔𝗨𝗧𝗢 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦  𝗗𝗜𝗦𝗔𝗕𝗟𝗘𝗗
┃  🤖  𝗔𝗜  𝗦𝗬𝗦𝗧𝗘𝗠  𝗦𝗧𝗔𝗡𝗗𝗜𝗡𝗚  𝗕𝗬
┗━━━━━━━━━━━━━━━━━━━━┛`,
                    contextInfo: { externalAdReply: AD_TEMPLATE }
                }, response)

            case "groups":
                REACT_MATRIX.groups = !REACT_MATRIX.groups
                await fs.writeFile(REACT_FILE, JSON.stringify(REACT_MATRIX))
                return sock.sendMessage(m.chat, {
                    text: `⚙️ *GROUP REACTIONS ${REACT_MATRIX.groups ? 'ENABLED' : 'DISABLED'}*\n
┏━━━━━━━━━━━━━━━━━━━━┓
┃  🔄  𝗚𝗥𝗢𝗨𝗣  𝗠𝗢𝗗𝗘: ${REACT_MATRIX.groups ? '✅ 𝗢𝗡' : '❌ 𝗢𝗙𝗙'}
┃  💬  𝗕𝗢𝗧 𝗪𝗜𝗟𝗟 ${REACT_MATRIX.groups ? '' : '𝗡𝗢𝗧'} 𝗥𝗘𝗔𝗖𝗧 𝗜𝗡 𝗚𝗥𝗢𝗨𝗣𝗦
┗━━━━━━━━━━━━━━━━━━━━┛`,
                    contextInfo: { externalAdReply: AD_TEMPLATE }
                }, response)

            default:
                return sock.sendMessage(m.chat, {
                    text: `⚡ *HYPER REACT SYSTEM*\n
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔄  \`hyperreact on\`
┃     └ Activate AI reactions
┃
┃  🔄  \`hyperreact off\`
┃     └ Deactivate reactions
┃
┃  🔄  \`hyperreact groups\`
┃     └ Toggle group reactions
┗━━━━━━━━━━━━━━━━━━━━━━━┛
» Status: ${REACT_MATRIX.active ? '🟢 ACTIVE' : '🔴 INACTIVE'}
» Groups: ${REACT_MATRIX.groups ? '✅ ENABLED' : '❌ DISABLED'}`,
                    contextInfo: { externalAdReply: AD_TEMPLATE }
                }, response)
        }
    },

    async handler(m, { sock }) {
        // System checks
        if (!REACT_MATRIX.active || m.fromMe) return
        if (m.isGroup && !REACT_MATRIX.groups) return
        
        // Cooldown management
        const userKey = m.isGroup ? `${m.chat}_${m.sender}` : m.sender
        const lastReact = reactionCooldown.get(userKey) || 0
        const cooldown = REACT_MATRIX.speed > 0.5 ? 2000 : 5000 // Dynamic cooldown
        
        if (Date.now() - lastReact < cooldown) return
        reactionCooldown.set(userKey, Date.now())
        
        // AI-powered reaction selection
        try {
            const selectedEmoji = REACT_DATABASE[Math.floor(Math.random() * REACT_DATABASE.length)]
            await sock.sendMessage(m.chat, { 
                react: { 
                    text: selectedEmoji, 
                    key: m.key 
                }
            })
        } catch (e) {
            console.error(`[HYPER REACT] ${e.message}`)
        }
    }
}