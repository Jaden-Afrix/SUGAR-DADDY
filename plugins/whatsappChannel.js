/*************************************************
 SUGAR DADDY - CHANNEL PROMOTER v2.0
 DYNAMIC WHATSAPP CHANNEL ENGAGEMENT SYSTEM
 Owner: ALPHA-BLAKE
**************************************************/

const CHANNEL_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

// Channel stats tracker
const statsPath = require('path').join(__dirname, '../lib/channel_stats.json');
let CHANNEL_STATS = { shares: 0, lastShared: '' };

// Load stats
try {
  if (require('fs').existsSync(statsPath)) {
    CHANNEL_STATS = require(statsPath);
  }
} catch (e) {
  console.error('Channel stats error:', e);
}

module.exports = {
  name: "channel",
  alias: ["official", "updates", "sugarchannel"],
  category: "core",
  desc: "🌟 Join our official WhatsApp channel",
  
  async exec(m, { sock }) {
    // Update stats
    CHANNEL_STATS.shares++;
    CHANNEL_STATS.lastShared = new Date().toISOString();
    this.saveStats();
    
    const user = m.pushName || m.sender.split('@')[0];
    const isGroup = m.isGroup ? `in *${(await sock.groupMetadata(m.chat)).subject}*` : '';
    
    // Create interactive message
    await sock.sendMessage(m.chat, {
      text: `📣 *SUGAR DADDY OFFICIAL CHANNEL*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💎 *Exclusive Features:*
┃  • Early access to new tools
┃  • VIP beta testing invites
┃  • Premium AI resources
┃  • Security alerts & updates
┃  
┃  🔗 *Instant Access:*
┃  ${CHANNEL_LINK}
┃  
┃  👇 Tap below to join now!
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
📊 Channel shared ${CHANNEL_STATS.shares} times
💌 Thanks ${user} ${isGroup}`,
      
      templateButtons: [
        { urlButton: { displayText: "✨ JOIN CHANNEL", url: CHANNEL_LINK } },
        { quickReplyButton: { displayText: "🔄 SHARE TO GROUP", id: "!channel share" } },
        { quickReplyButton: { displayText: "✅ JOINED CHANNEL", id: "!channel joined" } }
      ],
      
      contextInfo: {
        externalAdReply: {
          title: "🚀 PREMIUM BOT UPDATES",
          body: "Join 500+ members now!",
          thumbnailUrl: CHANNEL_BANNER,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: CHANNEL_LINK
        }
      }
    });
    
    // Add reaction
    await sock.sendMessage(m.chat, {
      react: { text: "📢", key: m.key }
    });
  },
  
  async handleEvent(m, { sock }) {
    if (m?.message?.templateButtonReplyMessage?.selectedId === "!channel share") {
      await sock.sendMessage(m.chat, {
        text: `📣 *SHARE OUR CHANNEL*\n\nForward this message to groups:\n\n` +
          `"Join the official SUGAR DADDY channel for premium bot features!\\n${CHANNEL_LINK}"\n\n` +
          "Thanks for spreading the word! 💖"
      });
    }
    
    if (m?.message?.templateButtonReplyMessage?.selectedId === "!channel joined") {
      await sock.sendMessage(m.chat, {
        text: `🎉 *WELCOME ABOARD!*\n\n` +
          "Thanks for joining our official channel!\n\n" +
          "🔹 Type `.premium` for VIP benefits\n" +
          "🔹 Use `.support` for assistance\n" +
          "🔹 Suggest features with `.suggest`"
      });
      
      await sock.sendMessage(m.chat, {
        react: { text: "❤️", key: m.key }
      });
    }
  },
  
  saveStats() {
    require('fs').writeFileSync(statsPath, JSON.stringify(CHANNEL_STATS, null, 2));
  }
};