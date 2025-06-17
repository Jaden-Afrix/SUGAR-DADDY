/*************************************************
 SUGAR DADDY - QUANTUM EXIT PROTOCOL v3.0
 Elite Group Departure System
 Owner: ALPHA-BLAKE
**************************************************/

const fs = require("fs").promises
const path = require("path")
const EXIT_CONFIG = path.join(__dirname, "..", "config", "quantum_exit.json")

// Default exit configuration
const EXIT_SETTINGS = {
    messages: [
        "🚀 My mission here is complete. Farewell!",
        "💼 Business calls me elsewhere. Adios!",
        "🌌 Quantum entanglement requires my departure",
        "🔭 Scanning new horizons. Goodbye!",
        "⚡ Powering down in this dimension. See ya!",
        "🛸 Beam me up! Leaving group now."
    ],
    active: true,
    lastUpdated: new Date().toISOString()
}

const AD_TEMPLATE = {
    title: "👋 SUGAR DADDY BOT",
    body: "Quantum Exit Protocol",
    thumbnailUrl: "https://i.ibb.co/4RfnHtVr/SulaMd.jpg",
    mediaType: 1,
    renderLargerThumbnail: true,
    sourceUrl: "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24"
}

// Initialize exit protocol
;(async () => {
    try {
        const data = await fs.readFile(EXIT_CONFIG, 'utf8')
        Object.assign(EXIT_SETTINGS, JSON.parse(data))
    } catch {
        await fs.mkdir(path.dirname(EXIT_CONFIG), { recursive: true })
        await fs.writeFile(EXIT_CONFIG, JSON.stringify(EXIT_SETTINGS))
    }
})()

// Save exit configuration
const saveConfig = async () => {
    try {
        await fs.writeFile(EXIT_CONFIG, JSON.stringify(EXIT_SETTINGS))
        return true
    } catch (e) {
        console.error('[QUANTUM EXIT] Config save error:', e.message)
        return false
    }
}

module.exports = {
    name: "quantumexit",
    alias: ["qexit", "eliteleave", "bye"],
    category: "owner",
    desc: "🚀 Execute quantum exit protocol for groups",
    use: "[message] or reply",

    async exec(m, { sock, args, isOwner, text }) {
        if (!isOwner) return m.reply("🚫 *QUANTUM SYSTEM LOCKED*\nOwner authentication required")

        const isGroup = m.isGroup
        const targetChat = isGroup ? m.chat : (args[0] || m.quoted?.sender)
        
        // Handle group exit
        if (isGroup || targetChat.includes('@g.us')) {
            const groupId = isGroup ? m.chat : targetChat
            
            try {
                // Get random exit message
                const randomIndex = Math.floor(Math.random() * EXIT_SETTINGS.messages.length)
                const exitMessage = text ? text : EXIT_SETTINGS.messages[randomIndex]
                
                // Send exit notification
                await sock.sendMessage(groupId, {
                    text: `⚡ *QUANTUM EXIT PROTOCOL*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🚪 𝗘𝗫𝗜𝗧𝗜𝗡𝗚 𝗚𝗥𝗢𝗨𝗣
┃  💬 ${exitMessage}
┃  ⏳ 𝗧-𝟭𝟬𝗦𝗘𝗖 𝗧𝗢 𝗗𝗘𝗣𝗔𝗥𝗧𝗨𝗥𝗘
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
                    contextInfo: { externalAdReply: AD_TEMPLATE }
                })
                
                // Delay for dramatic effect
                await new Promise(resolve => setTimeout(resolve, 10000))
                
                // Execute departure
                await sock.groupLeave(groupId)
                return
                
            } catch (e) {
                return sock.sendMessage(m.chat, {
                    text: `❌ *EXIT FAILED*\n┏━━━━━━━━━━━━━━┓\n┃ ${e.message || 'Quantum flux disturbance'}\n┗━━━━━━━━━━━━━━┛`,
                    contextInfo: { externalAdReply: AD_TEMPLATE }
                }, { quoted: m })
            }
        }
        
        // Handle non-group usage
        return sock.sendMessage(m.chat, {
            text: `❌ *INVALID QUANTUM EXIT TARGET*\n┏━━━━━━━━━━━━━━━━━━┓\n┃ Use in group or specify group ID\n┃ Example: quantumexit 1234567890-123456@g.us\n┗━━━━━━━━━━━━━━━━━━┛`,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, { quoted: m })
    }
}

module.exports.setexit = {
    name: "setexit",
    alias: ["configurexit", "exitmsg"],
    category: "owner",
    desc: "📝 Configure quantum exit messages",
    use: "<message> or reply",

    async exec(m, { sock, text, isOwner, quoted }) {
        if (!isOwner) return m.reply("🚫 *QUANTUM SYSTEM LOCKED*\nOwner authentication required")

        const newMessage = text ? text : (quoted?.text ? quoted.text : null)
        if (!newMessage) {
            return sock.sendMessage(m.chat, {
                text: `❌ *MISSING MESSAGE*\n┏━━━━━━━━━━━━━━━━━━┓\n┃ Provide a new exit message\n┃ Example: setexit Mission accomplished! 👋\n┗━━━━━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: m })
        }

        EXIT_SETTINGS.messages.push(newMessage)
        const success = await saveConfig()
        
        if (!success) {
            return sock.sendMessage(m.chat, {
                text: `❌ *CONFIG SAVE FAILED*\n┏━━━━━━━━━━━━━━┓\n┃ Quantum database unreachable\n┗━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: m })
        }

        return sock.sendMessage(m.chat, {
            text: `✅ *EXIT MESSAGE ADDED*\n┏━━━━━━━━━━━━━━━━━━┓\n┃ New quantum exit message:\n┃ "${newMessage}"\n┃ \n┃ Total messages: ${EXIT_SETTINGS.messages.length}\n┗━━━━━━━━━━━━━━━━━━┛`,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, { quoted: m })
    }
}

module.exports.resetexit = {
    name: "resetexit",
    alias: ["defaultexit", "clearexit"],
    category: "owner",
    desc: "🔄 Reset to default exit messages",
    use: "",

    async exec(m, { sock, isOwner }) {
        if (!isOwner) return m.reply("🚫 *QUANTUM SYSTEM LOCKED*\nOwner authentication required")

        const defaultMessages = [
            "🚀 My mission here is complete. Farewell!",
            "💼 Business calls me elsewhere. Adios!",
            "🌌 Quantum entanglement requires my departure",
            "🔭 Scanning new horizons. Goodbye!",
            "⚡ Powering down in this dimension. See ya!",
            "🛸 Beam me up! Leaving group now."
        ]

        EXIT_SETTINGS.messages = defaultMessages
        const success = await saveConfig()
        
        if (!success) {
            return sock.sendMessage(m.chat, {
                text: `❌ *CONFIG SAVE FAILED*\n┏━━━━━━━━━━━━━━┓\n┃ Quantum database unreachable\n┗━━━━━━━━━━━━━━┛`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: m })
        }

        return sock.sendMessage(m.chat, {
            text: `🔄 *EXIT MESSAGES RESET*\n┏━━━━━━━━━━━━━━━━━━┓\n┃ Restored ${defaultMessages.length} default messages\n┗━━━━━━━━━━━━━━━━━━┛`,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, { quoted: m })
    }
}

module.exports.listexit = {
    name: "listexit",
    alias: ["viewexit", "exitlist"],
    category: "owner",
    desc: "📜 View configured exit messages",
    use: "",

    async exec(m, { sock, isOwner }) {
        if (!isOwner) return m.reply("🚫 *QUANTUM SYSTEM LOCKED*\nOwner authentication required")

        let listText = `📜 *QUANTUM EXIT MESSAGES*\n\n┏━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`
        
        if (EXIT_SETTINGS.messages.length > 0) {
            EXIT_SETTINGS.messages.forEach((msg, i) => {
                listText += `┃ ${i+1}. ${msg}\n`
            })
        } else {
            listText += `┃ No exit messages configured\n`
        }
        
        listText += `┗━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\nTotal: ${EXIT_SETTINGS.messages.length} messages`

        return sock.sendMessage(m.chat, {
            text: listText,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, { quoted: m })
    }
}