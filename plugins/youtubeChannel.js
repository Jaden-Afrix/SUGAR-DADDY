/*************************************************
 SUGAR DADDY - YOUTUBE PROMOTER v2.0
 DYNAMIC CONTENT ENGAGEMENT SYSTEM
 Owner: ALPHA-BLAKE
**************************************************/

const YT_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const YT_CHANNEL = "https://www.youtube.com/@alphablake";
const FEATURED_VIDEO = "https://youtu.be/dQw4w9WgXcQ"; // Replace with actual featured video

// Engagement tracker
const statsPath = require('path').join(__dirname, '../lib/youtube_stats.json');
let YT_STATS = { shares: 0, clicks: 0, lastShared: '' };

// Load stats
try {
  if (require('fs').existsSync(statsPath)) {
    YT_STATS = JSON.parse(require('fs').readFileSync(statsPath));
  }
} catch (e) {
  console.error('YouTube stats error:', e);
}

module.exports = {
  name: "youtube",
  alias: ["yt", "youtubechannel", "videos"],
  category: "content",
  desc: "🎬 Access ALPHA-BLAKE's YouTube content",
  
  async exec(m, { sock }) {
    // Update stats
    YT_STATS.shares++;
    YT_STATS.lastShared = new Date().toISOString();
    this.saveStats();
    
    const user = m.pushName || m.sender.split('@')[0];
    
    // Create interactive message
    await sock.sendMessage(m.chat, {
      text: `🎥 *ALPHA-BLAKE OFFICIAL YOUTUBE*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🚀 *Premium Content:*
┃  • Bot tutorials & walkthroughs
┃  • Coding live streams
┃  • AI technology deep dives
┃  • Exclusive tool previews
┃  
┃  ⭐ *Featured Video:*
┃  "Building WhatsApp Bots with Node.js"
┃  ${FEATURED_VIDEO}
┃  
┃  👇 Tap below to explore!
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
📈 Channel shared ${YT_STATS.shares} times
👋 Thanks ${user} for your support!`,
      
      templateButtons: [
        { urlButton: { displayText: "✨ VISIT CHANNEL", url: YT_CHANNEL } },
        { urlButton: { displayText: "▶️ WATCH FEATURED", url: FEATURED_VIDEO } },
        { quickReplyButton: { displayText: "📊 REQUEST STATS", id: "!youtube stats" } }
      ],
      
      contextInfo: {
        externalAdReply: {
          title: "🎬 PREMIUM CODING CONTENT",
          body: "Join 1K+ subscribers!",
          thumbnailUrl: YT_BANNER,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: YT_CHANNEL
        }
      }
    });
    
    // Add reaction
    await sock.sendMessage(m.chat, {
      react: { text: "🎥", key: m.key }
    });
  },
  
  async handleEvent(m, { sock }) {
    if (m?.message?.templateButtonReplyMessage?.selectedId === "!youtube stats") {
      const lastShared = YT_STATS.lastShared ? new Date(YT_STATS.lastShared).toLocaleString() : 'Never';
      
      await sock.sendMessage(m.chat, {
        text: `📊 *YOUTUBE ENGAGEMENT STATS*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔢 Total Shares: ${YT_STATS.shares}
┃  👆 Total Clicks: ${YT_STATS.clicks}
┃  📅 Last Shared: ${lastShared}
┃  
┃  💡 *Most Popular Content:*
┃  1. WhatsApp Bot Tutorials
┃  2. AI Integration Guides
┃  3. JavaScript Masterclass
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
📌 Help us grow by sharing!`
      });
    }
  },
  
  saveStats() {
    require('fs').writeFileSync(statsPath, JSON.stringify(YT_STATS, null, 2));
  }
};