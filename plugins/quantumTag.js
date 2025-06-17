/*************************************************
 SUGAR DADDY - QUANTUM TAG DEFENDER v3.0
 Elite Mention & Status Tag Protection
 Owner: ALPHA-BLAKE
**************************************************/

const fs = require("fs").promises;
const path = require("path");
const DEFENSE_PATH = path.join(__dirname, "..", "config", "quantum_tag_defense.json");

const AD_TEMPLATE = {
  title: "🚫 SUGAR DADDY SHIELD",
  body: "Quantum Tag Defender",
  thumbnailUrl: "https://i.ibb.co/4RfnHtVr/SulaMd.jpg",
  mediaType: 1,
  renderLargerThumbnail: true,
  sourceUrl: "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24"
};

// Quantum Defense Matrix
const QUANTUM_DEFENSE = {
  maxWarnings: 2,
  cooldown: 30000,
  enabledGroups: {},
  userWarnings: {},
  lastAction: {},
  protectAdmins: true
};

// Initialize quantum defense
(async () => {
  try {
    await fs.mkdir(path.dirname(DEFENSE_PATH), { recursive: true });
    
    try {
      const data = await fs.readFile(DEFENSE_PATH, "utf8");
      Object.assign(QUANTUM_DEFENSE, JSON.parse(data));
    } catch (e) {
      if (e.code !== 'ENOENT') console.error('[TAG DEFENDER] Load error:', e.message);
      await fs.writeFile(DEFENSE_PATH, JSON.stringify(QUANTUM_DEFENSE));
    }
  } catch (e) {
    console.error('[TAG DEFENDER] Init error:', e.message);
  }
})();

// Debounced configuration saving
let saveTimeout = null;
const saveDefenseConfig = async () => {
  clearTimeout(saveTimeout);
  return new Promise(resolve => {
    saveTimeout = setTimeout(async () => {
      try {
        await fs.writeFile(DEFENSE_PATH, JSON.stringify(QUANTUM_DEFENSE));
        resolve(true);
      } catch (e) {
        console.error('[TAG DEFENDER] Save error:', e.message);
        resolve(false);
      }
    }, 1000);
  });
};

// Advanced tag detection
const detectTags = (m, groupMetadata) => {
  try {
    // Skip our own messages and non-message events
    if (m.key.fromMe || !m.message) return false;
    
    // Status tag detection
    const text = m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      m.message.imageMessage?.caption ||
      m.message.videoMessage?.caption || "";
    
    const statusTagDetected = /@[0-9]{10,}/.test(text);
    
    // Mention detection
    const mentions = m.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const hasMentions = mentions.length > 0;
    
    // Admin protection check
    const isAdmin = groupMetadata.participants.find(p => p.id === m.key.participant)?.admin;
    if (QUANTUM_DEFENSE.protectAdmins && isAdmin) return false;
    
    return statusTagDetected || hasMentions;
  } catch (e) {
    console.error('[TAG DETECTION] Error:', e.message);
    return false;
  }
};

module.exports = {
  name: "quantumtag",
  alias: ["antitag", "antimention", "notag"],
  category: "group",
  desc: "🛡️ Block @mentions and status tags",
  use: "",
  
  async exec(m, { isGroup, isAdmin, isBotAdmin, sock, groupMetadata }) {
    if (!isGroup) return m.reply("🚫 *GROUP COMMAND ONLY*\n┏━━━━━━━━━━━━━━┓\n┃ Use in group chats only\n┗━━━━━━━━━━━━━━┛");
    if (!isAdmin) return m.reply("🚫 *ADMIN REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Only admins can activate defense\n┗━━━━━━━━━━━━━━┛");
    if (!isBotAdmin) return m.reply("⚠️ *BOT ADMIN REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Promote bot to admin first\n┗━━━━━━━━━━━━━━┛");
    
    QUANTUM_DEFENSE.enabledGroups[m.chat] = true;
    await saveDefenseConfig();
    
    return sock.sendMessage(m.chat, {
      text: `🛡️ *QUANTUM TAG DEFENDER ACTIVATED*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔰  𝗧𝗔𝗚 𝗣𝗥𝗢𝗧𝗘𝗖𝗧𝗜𝗢𝗡: 𝗔𝗖𝗧𝗜𝗩𝗘
┃  ⚠️  𝗠𝗔𝗫 𝗪𝗔𝗥𝗡𝗜𝗡𝗚𝗦: ${QUANTUM_DEFENSE.maxWarnings}
┃  💬  𝗦𝗧𝗔𝗧𝗨𝗦 𝗧𝗔𝗚𝗦 & 𝗠𝗘𝗡𝗧𝗜𝗢𝗡𝗦 𝗕𝗟𝗢𝗖𝗞𝗘𝗗
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
      contextInfo: { externalAdReply: AD_TEMPLATE }
    }, { quoted: m });
  },
  
  async handler(m, { sock, groupMetadata }) {
    try {
      if (!m.key || !m.key.remoteJid) return;
      
      const chatId = m.key.remoteJid;
      if (!QUANTUM_DEFENSE.enabledGroups[chatId]) return;
      
      // Cooldown check
      const lastAction = QUANTUM_DEFENSE.lastAction[chatId] || 0;
      const now = Date.now();
      if (now - lastAction < QUANTUM_DEFENSE.cooldown) return;
      
      // Check for tag violations
      if (detectTags(m, groupMetadata)) {
        const user = m.key.participant || m.key.remoteJid;
        if (!user) return;
        
        // Initialize data structures
        QUANTUM_DEFENSE.userWarnings[chatId] = QUANTUM_DEFENSE.userWarnings[chatId] || {};
        QUANTUM_DEFENSE.userWarnings[chatId][user] = (QUANTUM_DEFENSE.userWarnings[chatId][user] || 0) + 1;
        
        QUANTUM_DEFENSE.lastAction[chatId] = now;
        await saveDefenseConfig();
        
        const warnCount = QUANTUM_DEFENSE.userWarnings[chatId][user];
        const maxWarnings = QUANTUM_DEFENSE.maxWarnings;
        
        // Send warning
        if (warnCount <= maxWarnings) {
          await sock.sendMessage(chatId, {
            text: `⚠️ *TAG VIOLATION [${warnCount}/${maxWarnings}]*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👤  @${user.split('@')[0]} 
┃  🔰  𝗨𝗡𝗔𝗨𝗧𝗛𝗢𝗥𝗜𝗭𝗘𝗗 𝗧𝗔𝗚𝗚𝗜𝗡𝗚 𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗
┃  ⚠️  𝗡𝗘𝗫𝗧 𝗩𝗜𝗢𝗟𝗔𝗧𝗜𝗢𝗡 𝗪𝗜𝗟𝗟 𝗥𝗘𝗦𝗨𝗟𝗧 𝗜𝗡 𝗞𝗜𝗖𝗞
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
┃  🔰  𝗥𝗘𝗠𝗢𝗩𝗘𝗗 𝗙𝗢𝗥 𝗥𝗘𝗣𝗘𝗔𝗧𝗘𝗗 𝗧𝗔𝗚𝗚𝗜𝗡𝗚
┃  ⚡  𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬 𝗣𝗥𝗢𝗧𝗢𝗖𝗢𝗟: 𝟯.𝟬
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
              mentions: [user],
              contextInfo: { externalAdReply: AD_TEMPLATE }
            });
            
            // Reset warnings
            delete QUANTUM_DEFENSE.userWarnings[chatId][user];
            await saveDefenseConfig();
          } catch (err) {
            if (err.message.includes('403')) {
              // Disable defense if bot loses admin
              delete QUANTUM_DEFENSE.enabledGroups[chatId];
              await saveDefenseConfig();
              await sock.sendMessage(chatId, {
                text: `❌ *DEFENSE DISABLED*\nBot admin permissions revoked!`,
                contextInfo: { externalAdReply: AD_TEMPLATE }
              });
            } else {
              console.error("[TAG DEFENDER] Removal failed:", err.message);
            }
          }
        }
      }
    } catch (e) {
      console.error("[TAG DEFENDER] Handler error:", e.message);
    }
  }
};

// Configuration commands
module.exports.tagsettings = {
  name: "tagsettings",
  alias: ["configuretag", "tagconfig"],
  category: "group",
  desc: "⚙️ Configure tag defense settings",
  use: "<warnings>",
  
  async exec(m, { args, isGroup, isAdmin, sock }) {
    if (!isGroup) return m.reply("🚫 *GROUP COMMAND ONLY*");
    if (!isAdmin) return m.reply("🚫 *ADMIN REQUIRED*");
    
    if (args.length === 0) {
      return sock.sendMessage(m.chat, {
        text: `⚙️ *TAG DEFENSE SETTINGS*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚠️  𝗠𝗔𝗫 𝗪𝗔𝗥𝗡𝗜𝗡𝗚𝗦: ${QUANTUM_DEFENSE.maxWarnings}
┃  ⏱️  𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡: ${QUANTUM_DEFENSE.cooldown/1000} seconds
┃  👑  𝗔𝗗𝗠𝗜𝗡 𝗣𝗥𝗢𝗧𝗘𝗖𝗧𝗜𝗢𝗡: ${QUANTUM_DEFENSE.protectAdmins ? '✅' : '❌'}
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
Use: tagsettings <warnings>`,
        contextInfo: { externalAdReply: AD_TEMPLATE }
      }, { quoted: m });
    }
    
    const newWarnings = parseInt(args[0]);
    if (isNaN(newWarnings)) return m.reply("❌ Invalid number format");
    
    QUANTUM_DEFENSE.maxWarnings = Math.max(1, Math.min(5, newWarnings));
    await saveDefenseConfig();
    
    return sock.sendMessage(m.chat, {
      text: `✅ *DEFENSE UPDATED*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚠️  𝗠𝗔𝗫 𝗪𝗔𝗥𝗡𝗜𝗡𝗚𝗦: ${QUANTUM_DEFENSE.maxWarnings}
┃  🔰  𝗨𝗦𝗘𝗥𝗦 𝗪𝗜𝗟𝗟 𝗕𝗘 𝗞𝗜𝗖𝗞𝗘𝗗 𝗔𝗙𝗧𝗘𝗥 ${QUANTUM_DEFENSE.maxWarnings} warnings
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
      contextInfo: { externalAdReply: AD_TEMPLATE }
    }, { quoted: m });
  }
};

module.exports.adminprotect = {
  name: "adminprotect",
  alias: ["protectadmins", "adminshield"],
  category: "group",
  desc: "👑 Toggle admin protection in tag defense",
  use: "",
  
  async exec(m, { isGroup, isAdmin, sock }) {
    if (!isGroup) return m.reply("🚫 *GROUP COMMAND ONLY*");
    if (!isAdmin) return m.reply("🚫 *ADMIN REQUIRED*");
    
    QUANTUM_DEFENSE.protectAdmins = !QUANTUM_DEFENSE.protectAdmins;
    await saveDefenseConfig();
    
    return sock.sendMessage(m.chat, {
      text: `👑 *ADMIN PROTECTION ${QUANTUM_DEFENSE.protectAdmins ? 'ENABLED' : 'DISABLED'}*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔰  𝗔𝗗𝗠𝗜𝗡 𝗧𝗔𝗚𝗚𝗜𝗡𝗚: ${QUANTUM_DEFENSE.protectAdmins ? '𝗔𝗟𝗟𝗢𝗪𝗘𝗗' : '𝗕𝗟𝗢𝗖𝗞𝗘𝗗'}
┃  ⚠️  𝗔𝗗𝗠𝗜𝗡𝗦 ${QUANTUM_DEFENSE.protectAdmins ? '𝗪𝗜𝗟𝗟 𝗡𝗢𝗧' : '𝗪𝗜𝗟𝗟'} 𝗕𝗘 𝗣𝗘𝗡𝗔𝗟𝗜𝗭𝗘𝗗
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
      contextInfo: { externalAdReply: AD_TEMPLATE }
    }, { quoted: m });
  }
};