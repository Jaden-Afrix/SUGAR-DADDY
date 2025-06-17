/*************************************************
 SUGAR DADDY - QUANTUM CONTACT BLOCKER v3.0
 Elite User Restriction System (Private Chats Only)
 Owner: ALPHA-BLAKE
**************************************************/

const fs = require("fs").promises
const path = require("path")
const BLOCK_FILE = path.join(__dirname, "..", "config", "quantum_block.json")

// Quantum Block Matrix
const BLOCK_MATRIX = {
    users: [],
    lastUpdated: new Date().toISOString()
}

const AD_TEMPLATE = {
    title: "🚫 SUGAR DADDY SECURITY",
    body: "Quantum Contact Blocker",
    thumbnailUrl: "https://i.ibb.co/4RfnHtVr/SulaMd.jpg",
    mediaType: 1,
    renderLargerThumbnail: true,
    sourceUrl: "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24"
}

// Initialize quantum block system
;(async () => {
    try {
        const data = await fs.readFile(BLOCK_FILE, 'utf8')
        Object.assign(BLOCK_MATRIX, JSON.parse(data))
        console.log(`[QUANTUM BLOCK] Loaded ${BLOCK_MATRIX.users.length} blocked contacts`)
    } catch {
        await fs.mkdir(path.dirname(BLOCK_FILE), { recursive: true })
        await fs.writeFile(BLOCK_FILE, JSON.stringify(BLOCK_MATRIX))
    }
})()

// Save block data to file
const saveBlockData = async () => {
    try {
        await fs.writeFile(BLOCK_FILE, JSON.stringify(BLOCK_MATRIX))
        return true
    } catch (e) {
        console.error('[QUANTUM BLOCK] Save error:', e.message)
        return false
    }
}

// JID formatting utilities
const formatJid = (jid) => {
    return jid.replace(/\D/g, '').replace(/(\d+)/, '$1@c.us')
}

const extractNumber = (jid) => {
    return jid.replace('@c.us', '')
}

module.exports = {
    name: "block",
    alias: ["ban", "restrict"],
    category: "security",
    desc: "🚫 Block users from private interactions",
    use: "<number> or reply to message",

    async exec(m, { sock, args, isOwner }) {
        if (!isOwner) return m.reply("🚫 *QUANTUM SYSTEM LOCKED*\nOwner authentication required")
        if (m.isGroup) return m.reply("⚠️ *USE IN PRIVATE CHAT*\nThis command only works in direct messages")

        const target = m.quoted ? m.quoted.sender : args[0] ? args[0] : m.sender
        const jid = formatJid(target)
        const number = extractNumber(jid)
        const response = { quoted: m }

        // Validation
        if (!jid.endsWith('@c.us')) {
            return sock.sendMessage(m.chat, {
                text: `❌ *INVALID TARGET*\n┏━━━━━━━━━━━━━━┓\n┃ Only private users can be blocked\n┗━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, response)
        }

        if (jid === m.sender) {
            return sock.sendMessage(m.chat, {
                text: `🤨 *SELF-TARGETING ERROR*\n┏━━━━━━━━━━━━━━┓\n┃ You cannot block yourself\n┗━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, response)
        }

        // Check if already blocked
        if (BLOCK_MATRIX.users.includes(jid)) {
            return sock.sendMessage(m.chat, {
                text: `⚠️ *ALREADY BLOCKED*\n┏━━━━━━━━━━━━━━┓\n┃ ❌ ${number}\n┃ Already in blocklist\n┗━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, response)
        }

        // Execute block
        BLOCK_MATRIX.users.push(jid)
        const saveSuccess = await saveBlockData()
        
        if (!saveSuccess) {
            return sock.sendMessage(m.chat, {
                text: `❌ *BLOCK FAILED*\n┏━━━━━━━━━━━━━━┓\n┃ Database write error\n┃ Contact not blocked\n┗━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, response)
        }

        await sock.updateBlockStatus(jid, "block")

        return sock.sendMessage(m.chat, {
            text: `🚫 *CONTACT QUARANTINED*\n┏━━━━━━━━━━━━━━┓\n┃ 🔒 ${number}\n┃ Blocked from all systems\n┗━━━━━━━━━━━━━━┛`,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, response)
    }
}

module.exports.unblock = {
    name: "unblock",
    alias: ["pardon", "release"],
    category: "security",
    desc: "🔓 Unblock restricted users",
    use: "<number> or reply to message",

    async exec(m, { sock, args, isOwner }) {
        if (!isOwner) return m.reply("🚫 *QUANTUM SYSTEM LOCKED*\nOwner authentication required")
        if (m.isGroup) return m.reply("⚠️ *USE IN PRIVATE CHAT*\nThis command only works in direct messages")

        const target = m.quoted ? m.quoted.sender : args[0] ? args[0] : m.sender
        const jid = formatJid(target)
        const number = extractNumber(jid)
        const response = { quoted: m }

        // Validation
        if (!jid.endsWith('@c.us')) {
            return sock.sendMessage(m.chat, {
                text: `❌ *INVALID TARGET*\n┏━━━━━━━━━━━━━━┓\n┃ Only private users can be unblocked\n┗━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, response)
        }

        // Check if not blocked
        if (!BLOCK_MATRIX.users.includes(jid)) {
            return sock.sendMessage(m.chat, {
                text: `⚠️ *NOT BLOCKED*\n┏━━━━━━━━━━━━━━┓\n┃ ❌ ${number}\n┃ Not found in blocklist\n┗━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, response)
        }

        // Execute unblock
        BLOCK_MATRIX.users = BLOCK_MATRIX.users.filter(u => u !== jid)
        const saveSuccess = await saveBlockData()
        
        if (!saveSuccess) {
            return sock.sendMessage(m.chat, {
                text: `❌ *UNBLOCK FAILED*\n┏━━━━━━━━━━━━━━┓\n┃ Database write error\n┃ Contact still blocked\n┗━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, response)
        }

        await sock.updateBlockStatus(jid, "unblock")

        return sock.sendMessage(m.chat, {
            text: `🔓 *CONTACT RELEASED*\n┏━━━━━━━━━━━━━━┓\n┃ ✅ ${number}\n┃ Restrictions removed\n┗━━━━━━━━━━━━━━┛`,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, response)
    }
}

module.exports.blocklist = {
    name: "blocklist",
    alias: ["banned", "restricted"],
    category: "security",
    desc: "📜 View blocked contacts",
    use: "",

    async exec(m, { sock, isOwner }) {
        if (!isOwner) return m.reply("🚫 *QUANTUM SYSTEM LOCKED*\nOwner authentication required")
        if (m.isGroup) return m.reply("⚠️ *USE IN PRIVATE CHAT*\nThis command only works in direct messages")

        const response = { quoted: m }
        let listText = `⚡ *QUANTUM BLOCK SYSTEM*\n\n`

        if (BLOCK_MATRIX.users.length > 0) {
            listText += `┏━━━━━━━━━━━━━━━━━━┓\n┃ 🚫 𝗕𝗟𝗢𝗖𝗞𝗘𝗗 𝗖𝗢𝗡𝗧𝗔𝗖𝗧𝗦 (${BLOCK_MATRIX.users.length})\n`
            BLOCK_MATRIX.users.forEach((user, i) => {
                listText += `┃ ${i+1}. ${extractNumber(user)}\n`
            })
            listText += `┗━━━━━━━━━━━━━━━━━━┛`
        } else {
            listText += `┏━━━━━━━━━━━━━━━━━━┓\n┃ 🟢 𝗡𝗢 𝗕𝗟𝗢𝗖𝗞𝗘𝗗 𝗖𝗢𝗡𝗧𝗔𝗖𝗧𝗦\n┗━━━━━━━━━━━━━━━━━━┛`
        }

        return sock.sendMessage(m.chat, {
            text: listText,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, response)
    }
}

// Quantum Enforcement System (For message handler)
module.exports.enforcer = async (m, { sock }) => {
    if (m.isGroup) return false // Only enforce in private chats
    
    const userJid = m.sender
    
    if (BLOCK_MATRIX.users.includes(userJid)) {
        try {
            // Send notification before blocking again (in case unblocked elsewhere)
            await sock.sendMessage(userJid, {
                text: `🚫 *ACCESS DENIED*\n┏━━━━━━━━━━━━━━┓\n┃ You are blocked from using this bot\n┃ Contact the owner for assistance\n┗━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            })
            
            // Ensure blocking status
            await sock.updateBlockStatus(userJid, "block")
            return true
        } catch (e) {
            console.error('[QUANTUM BLOCK] Enforcement error:', e.message)
            return true // Still block even if notification fails
        }
    }
    
    return false
}