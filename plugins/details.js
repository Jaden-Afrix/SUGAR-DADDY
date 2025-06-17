/*************************************************
 SUGAR DADDY - BOT DETAILS MODULE v1.0
 Displays information about the bot
 Owner: ALPHA-BLAKE
**************************************************/

const DETAILS_AUDIO = "https://files.catbox.moe/cebgdf.mp3";
const DETAILS_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

module.exports = {
  name: "details",
  alias: ["botdetails", "info"],
  category: "other",
  desc: "📄 View full details about the bot",
  
  async exec(m, { sock }) {
    await sock.sendMessage(m.chat, {
      text: `📄 *SUGAR DADDY - BOT DETAILS*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚙️  Bot is still under development
┃  📦  No content available for now
┃  🛠️  Updates may come as soon as possible
┃
┃  🧠 Built & maintained by *ALPHA-BLAKE*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

*Powered by ALPHA-BLAKE*
_Forwarded from the WhatsApp channel_`,
      contextInfo: {
        externalAdReply: {
          title: "🚧 BOT DETAILS COMING SOON",
          body: "New features will be added by ALPHA-BLAKE",
          thumbnailUrl: DETAILS_BANNER,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: CHANNEL_LINK
        }
      }
    });
    
    await sock.sendMessage(m.chat, {
      audio: { url: DETAILS_AUDIO },
      mimetype: "audio/mp4",
      ptt: true
    });
  }
};