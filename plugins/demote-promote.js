/*************************************************
 SUGAR DADDY - GROUP POWER MANAGER v1.2
 Elite Admin Promotion & Demotion System
 Owner: ALPHA-BLAKE
**************************************************/

const AD_TEMPLATE = {
  title: "🛡️ SUGAR DADDY BOT",
  body: "Powered by ALPHA-BLAKE",
  thumbnailUrl: "https://i.ibb.co/4RfnHtVr/SulaMd.jpg",
  sourceUrl: "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24",
  mediaType: 1,
  renderLargerThumbnail: true
};

module.exports = {
  name: "promote",
  alias: ["admin", "mod"],
  category: "group",
  desc: "👑 Promote a user to admin",
  use: "@user / reply",
  
  async exec(m, { sock, isGroup, isBotAdmin, isAdmin, participants, groupMetadata }) {
    if (!isGroup) return m.reply("🚫 *GROUP COMMAND ONLY*\n┏━━━━━━━━━━━━━━┓\n┃ Use in group chats only\n┗━━━━━━━━━━━━━━┛");
    if (!isAdmin) return m.reply("🚫 *ADMIN REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Only group admins can promote\n┗━━━━━━━━━━━━━━┛");
    if (!isBotAdmin) return m.reply("⚠️ *BOT ADMIN REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Promote bot to admin first\n┗━━━━━━━━━━━━━━┛");
    
    // Target resolution with security checks
    let target;
    if (m.quoted) {
      target = m.quoted.sender;
    } else if (m.mentions && m.mentions.length > 0) {
      target = m.mentions[0];
    } else {
      return m.reply("❌ *TARGET REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Mention or reply to a user\n┗━━━━━━━━━━━━━━┛");
    }
    
    // Quantum security protocols
    if (target === sock.user.id) return m.reply("🤖 *SELF OPERATION*\n┏━━━━━━━━━━━━━━┓\n┃ I'm already an admin!\n┗━━━━━━━━━━━━━━┛");
    if (target === groupMetadata.owner) return m.reply("👑 *OWNER PROTECTION*\n┏━━━━━━━━━━━━━━┓\n┃ Cannot modify group owner\n┗━━━━━━━━━━━━━━┛");
    
    const user = participants.find(p => p.id === target);
    if (!user) return m.reply("❌ *USER NOT FOUND*\n┏━━━━━━━━━━━━━━┓\n┃ User not in this group\n┗━━━━━━━━━━━━━━┛");
    if (user.admin) return m.reply("⚠️ *ALREADY ADMIN*\n┏━━━━━━━━━━━━━━┓\n┃ User is already an admin\n┗━━━━━━━━━━━━━━┛");
    
    try {
      // Execute quantum promotion
      await sock.groupParticipantsUpdate(m.chat, [target], "promote");
      
      return sock.sendMessage(m.chat, {
        text: `👑 *QUANTUM PROMOTION EXECUTED*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔰  𝗨𝗦𝗘𝗥: @${target.split('@')[0]}
┃  ⚡  𝗦𝗧𝗔𝗧𝗨𝗦: 𝗘𝗟𝗘𝗩𝗔𝗧𝗘𝗗 𝗧𝗢 𝗔𝗗𝗠𝗜𝗡
┃  👤  𝗔𝗖𝗧𝗜𝗢𝗡 𝗕𝗬: @${m.sender.split('@')[0]}
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
        mentions: [target, m.sender],
        contextInfo: { externalAdReply: AD_TEMPLATE }
      });
    } catch (e) {
      console.error("[PROMOTE] Quantum Error:", e);
      return m.reply(`❌ *QUANTUM FAILURE*\n┏━━━━━━━━━━━━━━┓\n┃ ${e.message}\n┗━━━━━━━━━━━━━━┛`);
    }
  }
};

module.exports.demote = {
  name: "demote",
  alias: ["removeadmin", "downmod"],
  category: "group",
  desc: "⛔ Demote an admin to user",
  use: "@user / reply",
  
  async exec(m, { sock, isGroup, isBotAdmin, isAdmin, participants, groupMetadata }) {
    if (!isGroup) return m.reply("🚫 *GROUP COMMAND ONLY*\n┏━━━━━━━━━━━━━━┓\n┃ Use in group chats only\n┗━━━━━━━━━━━━━━┛");
    if (!isAdmin) return m.reply("🚫 *ADMIN REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Only group admins can demote\n┗━━━━━━━━━━━━━━┛");
    if (!isBotAdmin) return m.reply("⚠️ *BOT ADMIN REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Promote bot to admin first\n┗━━━━━━━━━━━━━━┛");
    
    // Target resolution with security checks
    let target;
    if (m.quoted) {
      target = m.quoted.sender;
    } else if (m.mentions && m.mentions.length > 0) {
      target = m.mentions[0];
    } else {
      return m.reply("❌ *TARGET REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Mention or reply to a user\n┗━━━━━━━━━━━━━━┛");
    }
    
    // Quantum security protocols
    if (target === sock.user.id) return m.reply("🤖 *SELF PROTECTION*\n┏━━━━━━━━━━━━━━┓\n┃ I cannot demote myself!\n┗━━━━━━━━━━━━━━┛");
    if (target === groupMetadata.owner) return m.reply("👑 *OWNER PROTECTION*\n┏━━━━━━━━━━━━━━┓\n┃ Cannot modify group owner\n┗━━━━━━━━━━━━━━┛");
    
    const user = participants.find(p => p.id === target);
    if (!user) return m.reply("❌ *USER NOT FOUND*\n┏━━━━━━━━━━━━━━┓\n┃ User not in this group\n┗━━━━━━━━━━━━━━┛");
    if (!user.admin) return m.reply("⚠️ *NOT AN ADMIN*\n┏━━━━━━━━━━━━━━┓\n┃ User is not an admin\n┗━━━━━━━━━━━━━━┛");
    
    try {
      // Execute quantum demotion
      await sock.groupParticipantsUpdate(m.chat, [target], "demote");
      
      return sock.sendMessage(m.chat, {
        text: `⛔ *QUANTUM DEMOTION EXECUTED*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔰  𝗨𝗦𝗘𝗥: @${target.split('@')[0]}
┃  ⚡  𝗦𝗧𝗔𝗧𝗨𝗦: 𝗗𝗘𝗠𝗢𝗧𝗘𝗗 𝗧𝗢 𝗠𝗘𝗠𝗕𝗘𝗥
┃  👤  𝗔𝗖𝗧𝗜𝗢𝗡 𝗕𝗬: @${m.sender.split('@')[0]}
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
        mentions: [target, m.sender],
        contextInfo: { externalAdReply: AD_TEMPLATE }
      });
    } catch (e) {
      console.error("[DEMOTE] Quantum Error:", e);
      return m.reply(`❌ *QUANTUM FAILURE*\n┏━━━━━━━━━━━━━━┓\n┃ ${e.message}\n┗━━━━━━━━━━━━━━┛`);
    }
  }
};