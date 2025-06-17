/*************************************************
 SUGAR DADDY - QUANTUM TAGALL BROADCAST v1.2
 Elite Group Mention System with Audio Alert
 Owner: ALPHA-BLAKE
**************************************************/

const QUANTUM_AUDIO = "https://files.catbox.moe/cebgdf.mp3";
const QUANTUM_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const QUANTUM_SOURCE = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

// Quantum cooldown protection
const TAGALL_COOLDOWN = {};
const COOLDOWN_TIME = 30000; // 30 seconds

module.exports = {
    name: "tagall",
    alias: ["everyone", "all"],
    category: "group",
    desc: "📢 Quantum mention of all group members",
    use: "[quantum message]",
    
    async exec(m, { sock, isGroup, isAdmin, isBotAdmin, participants, args }) {
      // Quantum security protocols
      if (!isGroup) return m.reply("🚫 *GROUP COMMAND ONLY*\n┏━━━━━━━━━━━━━━┓\n┃ Use in group chats only\n┗━━━━━━━━━━━━━━┛");
      if (!isAdmin) return m.reply("🚫 *ADMIN REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Only quantum admins can summon all\n┗━━━━━━━━━━━━━━┛");
      if (!isBotAdmin) return m.reply("⚠️ *BOT ADMIN REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Promote bot to admin first\n┗━━━━━━━━━━━━━━┛");
      
      // Quantum cooldown check
      const lastTag = TAGALL_COOLDOWN[m.chat] || 0;
      const now = Date.now();
      if (now - lastTag < COOLDOWN_TIME) {
        const remaining = Math.ceil((COOLDOWN_TIME - (now - lastTag)) / 1000) ;
          return m.reply(`⏳ *QUANTUM COOLDOWN*\n┏━━━━━━━━━━━━━━┓\n┃ Please wait ${remaining}s before next summon\n┗━━━━━━━━━━━━━━┛`);
        }
        TAGALL_COOLDOWN[m.chat] = now;
        
        // Prepare quantum mention
        const mentionList = participants.map(p => p.id);
        const quantumMessage = args.length > 0 ?
          args.join(" ") :
          "📢 *QUANTUM SUMMON INITIATED*";
        
        try {
          // Execute quantum broadcast
          await sock.sendMessage(m.chat, {
            text: `📣 *QUANTUM GROUP SUMMON*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ${quantumMessage}
┃
┃  👥  𝗧𝗢𝗧𝗔𝗟 𝗠𝗘𝗠𝗕𝗘𝗥𝗦: ${mentionList.length}
┃  ⚡  𝗦𝗨𝗠𝗠𝗢𝗡𝗘𝗗 𝗕𝗬: @${m.sender.split('@')[0]}
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
            mentions: [...mentionList, m.sender],
            contextInfo: {
              externalAdReply: {
                title: "🌌 QUANTUM TAGALL SYSTEM",
                body: "SUGAR DADDY - Global Mention",
                thumbnailUrl: QUANTUM_BANNER,
                mediaType: 1,
                renderLargerThumbnail: true,
                sourceUrl: QUANTUM_SOURCE
              },
              forwardingScore: 999,
              isForwarded: true
            }
          }, { quoted: m });
          
          // Quantum audio alert
          await sock.sendMessage(m.chat, {
            audio: { url: QUANTUM_AUDIO },
            mimetype: 'audio/mp4',
            ptt: true
          });
          
        } catch (e) {
          console.error("[QUANTUM TAGALL] Error:", e);
          return m.reply(`❌ *QUANTUM FAILURE*\n┏━━━━━━━━━━━━━━┓\n┃ ${e.message}\n┗━━━━━━━━━━━━━━┛`);
        }
      }
    };