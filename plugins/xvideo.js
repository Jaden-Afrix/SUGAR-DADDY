/*************************************************
 SUGAR DADDY - ADULT VIDEO DOWNLOADER v1.0
 Downloads from XVIDEOS-style links
 Owner: ALPHA-BLAKE
**************************************************/

const axios = require("axios");

const BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const AUDIO = "https://files.catbox.moe/cebgdf.mp3";
const API = "https://apis-keith.vercel.app/download/porn?url=";

module.exports = {
  name: "xvideo",
  alias: ["xxxdownload", "porn", "vid18"],
  category: "🔞 adult access",
  desc: "🔞 Download adult video using URL",
  use: "<url>",
  
  async exec(m, { sock, args }) {
    if (!args[0]) return m.reply("*🔞 ENTER A VALID XVIDEO URL TO DOWNLOAD*");
    
    try {
      await sock.sendMessage(m.chat, {
        text: `*⏳ FETCHING VIDEO...*\n_This may take a few seconds_`,
      });
      
      const res = await axios.get(API + encodeURIComponent(args[0]));
      const { title, download, thumbnail } = res.data;
      
      if (!download) {
        return m.reply("*❌ FAILED TO FETCH VIDEO*\n🔞 Try another working URL.");
      }
      
      await sock.sendMessage(m.chat, {
        video: { url: download },
        caption: `*🎬 VIDEO TITLE:* ${title || "NSFW Content"}\n\n_🔞 Downloaded using SUGAR DADDY_`,
        contextInfo: {
          externalAdReply: {
            title: "🔞 ADULT CONTENT DOWNLOADER",
            body: "Powered by ALPHA-BLAKE",
            thumbnailUrl: BANNER,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: args[0],
          },
        },
      });
      
      await sock.sendMessage(m.chat, {
        audio: { url: AUDIO },
        mimetype: "audio/mp4",
        ptt: true,
      });
    } catch (e) {
      console.error("[XVIDEO ERROR]", e);
      m.reply("❌ *FAILED TO DOWNLOAD VIDEO*\n🔞 The link may be invalid or unsupported.");
    }
  },
};