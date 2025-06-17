/*************************************************
 SUGAR DADDY - QUANTUM PROFANITY SHIELD v4.0
 Elite Offensive Content Protection System
 Owner: ALPHA-BLAKE
**************************************************/

const fs = require("fs").promises;
const path = require("path");
const SHIELD_CONFIG = path.join(__dirname, "..", "config", "quantum_shield.json");
const WORD_LIST_PATH = path.join(__dirname, "..", "config", "quantum_words.json");

const AD_TEMPLATE = {
    title: "🚨 SUGAR DADDY SECURITY",
    body: "Quantum Profanity Shield",
    thumbnailUrl: "https://i.ibb.co/4RfnHtVr/SulaMd.jpg",
    mediaType: 1,
    renderLargerThumbnail: true,
    sourceUrl: "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24"
};

// Quantum Shield Matrix
const QUANTUM_SHIELD = {
    maxWarnings: 3,
    cooldown: 30000,
    enabledGroups: {},
    userWarnings: {},
    lastAction: {}
};

// Default offensive lexicon
const DEFAULT_WORDS = [
    "fuck", "shit", "bitch", "asshole", "nigga", "slut", "cunt",
    "whore", "dick", "pussy", "fag", "retard", "bastard", "motherfucker",
    "cock", "piss", "damn", "crap", "wanker", "twat", "pedo", "rapist"
];

let offensiveLexicon = [];

// Initialize quantum shield
(async () => {
    try {
        await fs.mkdir(path.dirname(SHIELD_CONFIG), { recursive: true });
        
        // Load shield configuration
        try {
            const shieldData = await fs.readFile(SHIELD_CONFIG, "utf8");
            Object.assign(QUANTUM_SHIELD, JSON.parse(shieldData));
        } catch (e) {
            if (e.code !== 'ENOENT') console.error('[SHIELD CONFIG] Load error:', e.message);
            await fs.writeFile(SHIELD_CONFIG, JSON.stringify(QUANTUM_SHIELD));
        }
        
        // Load offensive lexicon
        try {
            const wordData = await fs.readFile(WORD_LIST_PATH, "utf8");
            offensiveLexicon = JSON.parse(wordData);
        } catch (e) {
            if (e.code !== 'ENOENT') console.error('[WORD LIST] Load error:', e.message);
            offensiveLexicon = [...DEFAULT_WORDS];
            await fs.writeFile(WORD_LIST_PATH, JSON.stringify(offensiveLexicon));
        }
        
        console.log(`[QUANTUM SHIELD] Loaded ${offensiveLexicon.length} offensive terms`);
    } catch (e) {
        console.error('[QUANTUM SHIELD] Init error:', e.message);
    }
})();

// Debounced configuration saving
let saveTimeout = null;
const saveShieldConfig = async () => {
    clearTimeout(saveTimeout);
    return new Promise(resolve => {
        saveTimeout = setTimeout(async () => {
            try {
                await fs.writeFile(SHIELD_CONFIG, JSON.stringify(QUANTUM_SHIELD));
                resolve(true);
            } catch (e) {
                console.error('[QUANTUM SHIELD] Save error:', e.message);
                resolve(false);
            }
        }, 1000);
    });
};

// Save word list
const saveWordList = async () => {
    try {
        await fs.writeFile(WORD_LIST_PATH, JSON.stringify(offensiveLexicon));
        return true;
    } catch (e) {
        console.error('[QUANTUM SHIELD] Word list save error:', e.message);
        return false;
    }
};

// Advanced profanity detection
const detectProfanity = (text) => {
    if (!text) return false;
    const cleanText = text.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    return offensiveLexicon.some(word => 
        cleanText.includes(word) || 
        new RegExp(`\\b${word}\\b`).test(cleanText)
    );
};

module.exports = {
    name: "proshield",
    alias: ["antibadword", "profanityfilter", "cleanchat"],
    category: "group",
    desc: "🛡️ Activate quantum profanity shield",
    use: "",

    async exec(m, { isGroup, isAdmin, isBotAdmin, sock }) {
        if (!isGroup) return m.reply("🚫 *GROUP COMMAND ONLY*\n┏━━━━━━━━━━━━━━┓\n┃ Use in group chats only\n┗━━━━━━━━━━━━━━┛");
        if (!isAdmin) return m.reply("🚫 *ADMIN REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Only admins can activate shield\n┗━━━━━━━━━━━━━━┛");
        if (!isBotAdmin) return m.reply("⚠️ *BOT ADMIN REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Promote bot to admin first\n┗━━━━━━━━━━━━━━┛");

        QUANTUM_SHIELD.enabledGroups[m.chat] = true;
        await saveShieldConfig();

        return sock.sendMessage(m.chat, {
            text: `🛡️ *QUANTUM PROFANITY SHIELD ACTIVATED*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔞  𝗢𝗙𝗙𝗘𝗡𝗦𝗜𝗩𝗘  𝗖𝗢𝗡𝗧𝗘𝗡𝗧  𝗗𝗘𝗧𝗘𝗖𝗧𝗜𝗢𝗡: 𝗔𝗖𝗧𝗜𝗩𝗘
┃  ⚠️  𝗠𝗔𝗫 𝗪𝗔𝗥𝗡𝗜𝗡𝗚𝗦: ${QUANTUM_SHIELD.maxWarnings}
┃  🔰  𝗩𝗜𝗢𝗟𝗔𝗧𝗢𝗥𝗦 𝗪𝗜𝗟𝗟 𝗕𝗘 𝗔𝗨𝗧𝗢-𝗞𝗜𝗖𝗞𝗘𝗗
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, { quoted: m });
    },

    async handler(m, { sock }) {
        try {
            if (!m.key || !m.key.remoteJid) return;
            
            const chatId = m.key.remoteJid;
            if (!QUANTUM_SHIELD.enabledGroups[chatId]) return;
            
            // Cooldown check
            const lastAction = QUANTUM_SHIELD.lastAction[chatId] || 0;
            const now = Date.now();
            if (now - lastAction < QUANTUM_SHIELD.cooldown) return;
            
            // Extract message text
            const getText = () => {
                if (m.message?.conversation) return m.message.conversation;
                if (m.message?.extendedTextMessage?.text) return m.message.extendedTextMessage.text;
                if (m.message?.imageMessage?.caption) return m.message.imageMessage.caption;
                if (m.message?.videoMessage?.caption) return m.message.videoMessage.caption;
                return "";
            };
            
            const text = getText();
            if (!text) return;
            
            // Check for profanity
            if (detectProfanity(text)) {
                const user = m.key.participant || m.key.remoteJid;
                if (!user) return;
                
                // Initialize data structures
                QUANTUM_SHIELD.userWarnings[chatId] = QUANTUM_SHIELD.userWarnings[chatId] || {};
                QUANTUM_SHIELD.userWarnings[chatId][user] = (QUANTUM_SHIELD.userWarnings[chatId][user] || 0) + 1;
                
                QUANTUM_SHIELD.lastAction[chatId] = now;
                await saveShieldConfig();
                
                const warnCount = QUANTUM_SHIELD.userWarnings[chatId][user];
                const maxWarnings = QUANTUM_SHIELD.maxWarnings;
                
                // Send warning
                if (warnCount <= maxWarnings) {
                    await sock.sendMessage(chatId, {
                        text: `⚠️ *PROFANITY DETECTED [${warnCount}/${maxWarnings}]*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👤  @${user.split('@')[0]} 
┃  🔞  𝗢𝗙𝗙𝗘𝗡𝗦𝗜𝗩𝗘  𝗖𝗢𝗡𝗧𝗘𝗡𝗧  𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗
┃  ⚠️  𝗡𝗘𝗫𝗧  𝗩𝗜𝗢𝗟𝗔𝗧𝗜𝗢𝗡  𝗪𝗜𝗟𝗟  𝗥𝗘𝗦𝗨𝗟𝗧  𝗜𝗡  𝗞𝗜𝗖𝗞
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
                        mentions: [user],
                        contextInfo: { externalAdReply: AD_TEMPLATE }
                    });
                }
                
                // Remove user if exceeds warnings
                if (warnCount > maxWarnings) {
                    try {
                        await sock.groupParticipantsUpdate(chatId, [user], "remove");
                        await sock.sendMessage(chatId, {
                            text: `🚫 *QUANTUM PURGE EXECUTED*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👤  @${user.split('@')[0]} 
┃  🔞  𝗥𝗘𝗠𝗢𝗩𝗘𝗗  𝗙𝗢𝗥  𝗥𝗘𝗣𝗘𝗔𝗧𝗘𝗗  𝗩𝗜𝗢𝗟𝗔𝗧𝗜𝗢𝗡𝗦
┃  ⚡  𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬  𝗣𝗥𝗢𝗧𝗢𝗖𝗢𝗟: 𝟰.𝟬
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
                            mentions: [user],
                            contextInfo: { externalAdReply: AD_TEMPLATE }
                        });
                        
                        // Reset warnings
                        delete QUANTUM_SHIELD.userWarnings[chatId][user];
                        await saveShieldConfig();
                    } catch (err) {
                        if (err.message.includes('403')) {
                            // Disable shield if bot loses admin
                            delete QUANTUM_SHIELD.enabledGroups[chatId];
                            await saveShieldConfig();
                            await sock.sendMessage(chatId, {
                                text: `❌ *SHIELD DISABLED*\nBot admin permissions revoked!`,
                                contextInfo: { externalAdReply: AD_TEMPLATE }
                            });
                        } else {
                            console.error("[QUANTUM SHIELD] Removal failed:", err.message);
                        }
                    }
                }
            }
        } catch (e) {
            console.error("[QUANTUM SHIELD] Handler error:", e.message);
        }
    }
};

// Word management commands
module.exports.wordadd = {
    name: "wordadd",
    alias: ["addprofanity", "blockword"],
    category: "group",
    desc: "📝 Add word to profanity filter",
    use: "<word>",

    async exec(m, { args, isGroup, isAdmin, sock }) {
        if (!isGroup) return m.reply("🚫 *GROUP COMMAND ONLY*");
        if (!isAdmin) return m.reply("🚫 *ADMIN REQUIRED*");
        
        const word = args[0]?.toLowerCase();
        if (!word) return m.reply("❌ Please specify a word to block");
        
        if (offensiveLexicon.includes(word)) {
            return sock.sendMessage(m.chat, {
                text: `⚠️ *WORD ALREADY BLOCKED*\n"${word}" is already in the filter`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: m });
        }
        
        offensiveLexicon.push(word);
        const success = await saveWordList();
        
        if (!success) {
            return sock.sendMessage(m.chat, {
                text: "❌ Failed to save word list",
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: m });
        }
        
        return sock.sendMessage(m.chat, {
            text: `✅ *WORD ADDED*\n"${word}" added to profanity filter`,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, { quoted: m });
    }
};

module.exports.wordremove = {
    name: "wordremove",
    alias: ["removeprofanity", "unblockword"],
    category: "group",
    desc: "📝 Remove word from profanity filter",
    use: "<word>",

    async exec(m, { args, isGroup, isAdmin, sock }) {
        if (!isGroup) return m.reply("🚫 *GROUP COMMAND ONLY*");
        if (!isAdmin) return m.reply("🚫 *ADMIN REQUIRED*");
        
        const word = args[0]?.toLowerCase();
        if (!word) return m.reply("❌ Please specify a word to unblock");
        
        const index = offensiveLexicon.indexOf(word);
        if (index === -1) {
            return sock.sendMessage(m.chat, {
                text: `⚠️ *WORD NOT FOUND*\n"${word}" not in filter`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: m });
        }
        
        offensiveLexicon.splice(index, 1);
        const success = await saveWordList();
        
        if (!success) {
            return sock.sendMessage(m.chat, {
                text: "❌ Failed to save word list",
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: m });
        }
        
        return sock.sendMessage(m.chat, {
            text: `✅ *WORD REMOVED*\n"${word}" removed from filter`,
            contextInfo: { externalAdReply: AD_TEMPLATE }
        }, { quoted: m });
    }
};

module.exports.wordlist = {
    name: "wordlist",
    alias: ["profanitylist", "blockedwords"],
    category: "group",
    desc: "📜 View blocked profanity list",
    use: "",

    async exec(m, { isGroup, isAdmin, sock }) {
        if (!isGroup) return m.reply("🚫 *GROUP COMMAND ONLY*");
        if (!isAdmin) return m.reply("🚫 *ADMIN REQUIRED*");
        
        if (offensiveLexicon.length === 0) {
            return sock.sendMessage(m.chat, {
                text: "🟢 *NO BLOCKED WORDS*\nProfanity filter is empty",
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: m });
        }
        
        const chunkSize = 20;
        const chunks = [];
        for (let i = 0; i < offensiveLexicon.length; i += chunkSize) {
            chunks.push(offensiveLexicon.slice(i, i + chunkSize));
        }
        
        for (const [index, chunk] of chunks.entries()) {
            await sock.sendMessage(m.chat, {
                text: `📜 *PROFANITY FILTER LIST [${index + 1}/${chunks.length}]*\n\n` +
                      chunk.map((word, i) => `${i+1}. ${word}`).join('\n') +
                      `\n\nTotal: ${offensiveLexicon.length} words`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
            }, { quoted: index === 0 ? m : null });
        }
    }
};