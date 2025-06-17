const axios = require("axios");
const GPT_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const GPT_SOURCE = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";
const GPT_API = "https://api.nexoracle.com/ai/chatgpt-v4";

module.exports = {
  name: "gpt",
  alias: ["chatgpt", "ask", "ai"],
  category: "ai",
  desc: "🤖 Query ChatGPT v4 using Quantum Intelligence",
  
  async exec(m, { sock, args }) {
    const query = args.join(" ").trim();
    if (!query) {
      return sock.sendMessage(m.chat, {
        text: `🚫 *MISSING PROMPT*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ❓ Example: *gpt What is quantum computing?*
┃  🔎 Ask anything and I'll respond
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
        contextInfo: {
          externalAdReply: {
            title: "🧠 SUGAR DADDY - GPT ONLINE",
            body: "Ask any question now",
            thumbnailUrl: GPT_BANNER,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: GPT_SOURCE
          }
        }
      });
    }
    
    try {
      // Send processing notice
      await sock.sendMessage(m.chat, {
        text: `⏳ *PROCESSING YOUR REQUEST...*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔎 Query: ${query.slice(0, 100)}${query.length > 100 ? '...' : ''}
┃  🤖 Powered by ChatGPT v4 Quantum
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`
      });
      
      // API request with timeout and API key in headers
      const res = await axios.get(GPT_API, {
        params: { prompt: query },
        headers: {
          'apikey': '7902cbef76b269e176',
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      const reply = res.data?.response;
      if (!reply) throw new Error("Empty response from API");
      
      // Send formatted response
      await sock.sendMessage(m.chat, {
        text: `🤖 *CHATGPT RESPONSE:*\n\n${reply}\n\n━━━━━━━━━━━━━━━━━━━━━━━\n🔗 *Powered by ALPHA-BLAKE*\n📢 _AI Quantum Intelligence v4_`,
        contextInfo: {
          externalAdReply: {
            title: "🧠 ChatGPT Quantum Core",
            body: "Next-Gen AI Processing",
            thumbnailUrl: GPT_BANNER,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: GPT_SOURCE
          }
        }
      });
      
    } catch (err) {
      console.error("GPT ERROR:", err);
      const errorMsg = err.response?.data?.error || err.message || "Unknown API error";
      
      await sock.sendMessage(m.chat, {
        text: `⚠️ *REQUEST FAILED*\n\n▸ Error: ${errorMsg}\n▸ Code: ${err.response?.status || 'N/A'}\n\nPlease try again later.`
      });
    }
  }
};