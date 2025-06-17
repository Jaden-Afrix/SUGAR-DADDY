/*************************************************
 SUGAR DADDY - HENTAI VIDEO MODULE v1.0
 Fetches random Hentai content using API
 Owner: ALPHA-BLAKE
**************************************************/

const axios = require("axios");

const BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const AUDIO = "https://files.catbox.moe/cebgdf.mp3";
const API = "https://apis-keith.vercel.app/dl/hentaivid";

module.exports = {
  name: "hentai",
  alias: ["hetai", "hentaivid"],
  category: "🔞 adult access",
  desc: "🔞 Sends random hentai video",
  
  async exec(m, { sock }) {
    try {
      await sock.sendMessage(m.chat, {
        text: "*⏳ FETCHING HENTAI VIDEO...*",
      });
      
      const { data } = await axios.get(API);
      const { title, video, thumbnail } = data;
      
      if (!video) {
        return m.reply("❌ *FAILED TO FETCH VIDEO*\n🔞 Try again later.");
      }
      
      await sock.sendMessage(m.chat, {
        video: { url: video },
        caption: `*🎬 HENTAI TITLE:* ${title || "Hentai Video"}\n\n_🔞 Fetched via SUGAR DADDY_`,
        contextInfo: {
          externalAdReply: {
            title: "💦 RANDOM HENTAI CONTENT",
            body: "Powered by ALPHA-BLAKE",
            thumbnailUrl: BANNER,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: video,
          },
        },
      });
      
      await sock.sendMessage(m.chat, {
        audio: { url: AUDIO },
        mimetype: "audio/mp4",
        ptt: true,
      });
    } catch (err) {
      console.error("[HENTAI MODULE ERROR]", err);
      m.reply("❌ *FAILED TO LOAD HENTAI VIDEO*\n🔞 Please try again later.");
    }
  },
};