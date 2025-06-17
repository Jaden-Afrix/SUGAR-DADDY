/*************************************************
 SUGAR DADDY - QUANTUM PURGE SYSTEM v1.2
 Elite Non-Admin Removal Protocol
 Owner: ALPHA-BLAKE
**************************************************/

const QUANTUM_AUDIO = "https://files.catbox.moe/cebgdf.mp3";
const QUANTUM_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const QUANTUM_SOURCE = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

// Quantum purge cooldown (5 minutes)
const PURGE_COOLDOWN = {};
const COOLDOWN_TIME = 300000;

module.exports = {
    name: "kickall",
    alias: ["purge", "removeall"],
    category: "group",
    desc: "🚫 Quantum removal of all non-admin members",
    use: "",
    
    async exec(m, { sock, isGroup, isAdmin, isBotAdmin, participants, groupMetadata }) {
      // Quantum security protocols
      if (!isGroup) return m.reply("🚫 *GROUP COMMAND ONLY*\n┏━━━━━━━━━━━━━━┓\n┃ Use in group chats only\n┗━━━━━━━━━━━━━━┛");
      if (!isAdmin) return m.reply("🚫 *ADMIN REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Only quantum admins can purge\n┗━━━━━━━━━━━━━━┛");
      if (!isBotAdmin) return m.reply("⚠️ *BOT ADMIN REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Promote bot to admin first\n┗━━━━━━━━━━━━━━┛");
      
      // Quantum cooldown check
      const lastPurge = PURGE_COOLDOWN[m.chat] || 0;
      const now = Date.now();
      if (now - lastPurge < COOLDOWN_TIME) {
        const remaining = Math.ceil((COOLDOWN_TIME - (now - lastPurge)) / 60000) ;
          return m.reply(`⌛ *QUANTUM COOLDOWN*\n┏━━━━━━━━━━━━━━┓\n┃ Purge available in ${remaining} minutes\n┗━━━━━━━━━━━━━━┛`);
        }
        
        // Send quantum confirmation
        await sock.sendMessage(m.chat, {
          text: `⚠️ *QUANTUM PURGE CONFIRMATION*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔰  This will remove ALL non-admin members
┃  ⚠️  𝗧𝗛𝗜𝗦 𝗔𝗖𝗧𝗜𝗢𝗡 𝗜𝗦 𝗜𝗥𝗥𝗘𝗩𝗘𝗥𝗦𝗜𝗕𝗟𝗘
┃
┃  Type *QUANTUM CONFIRM* within 30 seconds
┃  to activate purge protocol
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
          contextInfo: {
            externalAdReply: {
              title: "💣 QUANTUM PURGE INITIATED",
              body: "SUGAR DADDY SECURITY",
              thumbnailUrl: QUANTUM_BANNER,
              mediaType: 1,
              renderLargerThumbnail: true,
              sourceUrl: QUANTUM_SOURCE
            }
          }
        }, { quoted: m });
        
        // Quantum confirmation listener
        const confirmation = await sock.awaitMessage(m.chat, msg => {
          return msg.key.fromMe === false &&
            msg.key.participant === m.sender &&
            msg.message?.conversation?.toUpperCase() === "QUANTUM CONFIRM";
        }, 30000).catch(() => null);
        
        if (!confirmation) {
          return sock.sendMessage(m.chat, { text: "❌ *PURGE ABORTED*\n┏━━━━━━━━━━━━━━┓\n┃ Confirmation not received\n┗━━━━━━━━━━━━━━┛" });
        }
        
        // Identify targets for quantum removal
        const owner = groupMetadata.owner;
        const admins = participants.filter(p => p.admin).map(p => p.id);
        const nonAdmins = participants.filter(p =>
          !admins.includes(p.id) &&
          p.id !== owner &&
          p.id !== sock.user.id
        ).map(p => p.id);
        
        if (nonAdmins.length === 0) {
          return sock.sendMessage(m.chat, { text: "✅ *QUANTUM SCAN COMPLETE*\n┏━━━━━━━━━━━━━━┓\n┃ No non-admin users found\n┗━━━━━━━━━━━━━━┛" });
        }
        
        // Initiate quantum purge
        await sock.sendMessage(m.chat, {
          text: `🚀 *QUANTUM PURGE ACTIVATED*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔰  𝗨𝗦𝗘𝗥𝗦 𝗧𝗢 𝗥𝗘𝗠𝗢𝗩𝗘: ${nonAdmins.length}
┃  ⚡  𝗜𝗡𝗜𝗧𝗜𝗔𝗧𝗘𝗗 𝗕𝗬: @${m.sender.split('@')[0]}
┃  ⏱️  𝗘𝗦𝗧𝗜𝗠𝗔𝗧𝗘𝗗 𝗧𝗜𝗠𝗘: ${Math.ceil(nonAdmins.length * 0.5)} seconds
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
          mentions: [m.sender],
          contextInfo: {
            externalAdReply: {
              title: "🔥 QUANTUM PURGE IN PROGRESS",
              body: "SUGAR DADDY SECURITY",
              thumbnailUrl: QUANTUM_BANNER,
              mediaType: 1,
              renderLargerThumbnail: true,
              sourceUrl: QUANTUM_SOURCE
            }
          }
        });
        
        // Quantum audio alert
        await sock.sendMessage(m.chat, {
          audio: { url: QUANTUM_AUDIO },
          mimetype: 'audio/mp4',
          ptt: true
        });
        
        // Execute quantum removal in batches
        const BATCH_SIZE = 5;
        const BATCH_DELAY = 2000;
        let removedCount = 0;
        
        for (let i = 0; i < nonAdmins.length; i += BATCH_SIZE) {
          const batch = nonAdmins.slice(i, i + BATCH_SIZE);
          
          try {
            await sock.groupParticipantsUpdate(m.chat, batch, "remove");
            removedCount += batch.length;
            
            // Send progress update every 3 batches
            if (i > 0 && i % (BATCH_SIZE * 3) === 0) {
              await sock.sendMessage(m.chat, {
                text: `⚡ *QUANTUM PURGE PROGRESS*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔰  𝗥𝗘𝗠𝗢𝗩𝗘𝗗: ${removedCount}/${nonAdmins.length}
┃  ⚡  𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘𝗗: ${Math.round((removedCount / nonAdmins.length) * 100)}%
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`
              });
            }
            
            await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
          } catch (e) {
            console.error("[QUANTUM PURGE] Batch Error:", e);
          }
        }
        
        // Update cooldown
        PURGE_COOLDOWN[m.chat] = Date.now();
        
        // Quantum completion report
        return sock.sendMessage(m.chat, {
          text: `✅ *QUANTUM PURGE COMPLETE*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔰  𝗧𝗢𝗧𝗔𝗟 𝗥𝗘𝗠𝗢𝗩𝗘𝗗: ${removedCount}
┃  ⚡  𝗦𝗨𝗖𝗖𝗘𝗦𝗦 𝗥𝗔𝗧𝗘: ${Math.round((removedCount / nonAdmins.length) * 100)}%
┃  ⏱️  𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡 𝗔𝗖𝗧𝗜𝗘𝗗: 5 minutes
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
          contextInfo: {
            externalAdReply: {
              title: "✅ QUANTUM PURGE SUCCESS",
              body: "SUGAR DADDY SECURITY",
              thumbnailUrl: QUANTUM_BANNER,
              mediaType: 1,
              renderLargerThumbnail: true,
              sourceUrl: QUANTUM_SOURCE
            }
          }
        });
      }
    };