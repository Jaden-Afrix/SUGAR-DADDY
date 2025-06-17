/*************************************************
 SUGAR DADDY - SUPPORT CHANNEL MODULE v1.0
 Telegram Support Link Sender
 Owner: ALPHA-BLAKE
**************************************************/

const BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const AUDIO = "https://files.catbox.moe/cebgdf.mp3";

module.exports = {
  name: "support",
  alias: ["help", "tg", "telegram"],
  category: "sugar daddy",
  desc: "📲 Sends Telegram support channel button",

  async exec(m, { sock }) {
    const message = `*📲 SUGAR DADDY SUPPORT CENTER*

━━━━━━━━━━━━━━━━━━━━━━
💬 Need help or want to stay updated?
Join our *Telegram Support Channel* now!

🛠️ You’ll find:
• Bot updates
• Help & FAQs
• Feature announcements
━━━━━━━━━━━━━━━━━━━━━━

🔗 *t.me/lpg1_tech*

*Powered by ALPHA-BLAKE*`;

    await sock.sendMessage(m.chat, {
      text: message,
      contextInfo: {
        externalAdReply: {
          title: "📲 TELEGRAM SUPPORT",
          body: "Join the official support channel",
          mediaType: 1,
          thumbnailUrl: BANNER,
          renderLargerThumbnail: true,
          sourceUrl: "https://t.me/lpg1_tech"
        }
      },
      buttons: [
        {
          buttonId: "https://t.me/lpg1_tech",
          buttonText: { displayText: "🚀 TELEGRAM CHANNEL" },
          type: 1
        }
      ],
      footer: "SUGAR DADDY BOT • POWERED BY ALPHA-BLAKE",
      headerType: 1
    });

    await sock.sendMessage(m.chat, {
      audio: { url: AUDIO },
      mimetype: "audio/mp4",
      ptt: true
    });
  },
};