/*************************************************
 SUGAR DADDY MINI - COMMAND HUB
 Owner: ALPHA-BLAKE
 One-Line Tool Listing Format
**************************************************/

const moment = require("moment");
require("moment-duration-format");

const BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const AUDIO = "https://files.catbox.moe/cebgdf.mp3";

module.exports = {
  name: "menu",
  alias: ["help", "cmds", "panel"],
  category: "main",
  desc: "📋 Shows bot tools in a clean layout",
  
  async exec(m, { sock, uptime, args, prefix }) {
    const runTime = process.uptime();
    const formatUptime = moment.duration(uptime * 1000).humanize();
    const formatRuntime = moment.duration(runTime * 1000).format("HH:mm:ss");
    
    const menuText = `*💎 SUGAR-DADDY MINI INTERFACE 💎*

┌─⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤
│ 👤 *Owner:* ${m.sender.split("@")[0]}
│ 🔰 *Prefix:* ${prefix || "Any"}
│ 🧩 *Cmds:* Type *${prefix}menu*
│ ⏱️ *Uptime:* ${formatUptime}
│ ⚙️ *Runtime:* ${formatRuntime}
└────────────────────

🔹 *MENU-LIST — ONE LINE EACH*
▪️ OWNER MENU
▪️ GROUP MENU
▪️ DOWNLOAD MENU
▪️ AI MENU
▪️ GAME MENU
▪️ OTHER MENU
▪️ CHANNEL MENU
▪️ BUG MENU
▪️ ADULT ACCESS
▪️ SUPPORT

*🔗 Powered by ALPHA-BLAKE*
`;
    
    await sock.sendMessage(m.chat, {
      text: menuText,
      contextInfo: {
        externalAdReply: {
          title: "✨ SUGAR-DADDY MINI MENU",
          body: "Type your command to begin",
          mediaType: 1,
          thumbnailUrl: BANNER,
          renderLargerThumbnail: true,
          sourceUrl: "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24"
        }
      }
    });
    
    await sock.sendMessage(m.chat, {
      audio: { url: AUDIO },
      mimetype: "audio/mp4",
      ptt: true
    });
  },
};