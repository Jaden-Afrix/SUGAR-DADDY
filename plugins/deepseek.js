/*************************************************
 SUGAR DADDY - DEEPSEEK CODER v6.7B PRO
 ADVANCED CODE EXPLANATION & GENERATION SYSTEM
 Owner: ALPHA-BLAKE
**************************************************/

const axios = require("axios");
const DEEPSEEK_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const DEEPSEEK_SOURCE = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";
const DEEPSEEK_API = "https://api.nexoracle.com/ai/deepseek-coder-6.7b-base";

module.exports = {
  name: "deepseek",
  alias: ["codeai", "explaincode", "coder", "program"],
  category: "ai",
  desc: "💻 Advanced code explanation & generation AI",
  
  async exec(m, { sock, args, text }) {
    const query = text.trim();
    if (!query) {
      return sock.sendMessage(m.chat, {
        text: `💻 *DEEPSEEK CODER AI*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔹 *Syntax:* deepseek [query]
┃  🔸 Example: 
┃    • \`deepseek explain bubble sort in Python\`
┃    • \`deepseek write node.js image downloader\`
┃    • \`deepseek fix this code: <your_code>\`
┃  🚀 Model: DeepSeek Coder 6.7B
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
        contextInfo: {
          externalAdReply: {
            title: "💡 DEEPSEEK CODER PRO",
            body: "Advanced Programming AI",
            thumbnailUrl: DEEPSEEK_BANNER,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: DEEPSEEK_SOURCE
          }
        }
      });
    }
    
    try {
      // Send processing notice with typing indicator
      await sock.sendPresenceUpdate('composing', m.chat);
      const processingMsg = await sock.sendMessage(m.chat, {
        text: `⚙️ *ANALYZING CODE REQUEST...*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔍 ${query.slice(0, 70)}${query.length > 70 ? '...' : ''}
┃  💻 Initializing DeepSeek v6.7B
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
      });
      
      // API request with enhanced configuration
      const res = await axios.get(DEEPSEEK_API, {
        params: { prompt: query },
        headers: {
          'apikey': '7902cbef76b269e176',
          'X-Code-Type': 'advanced'
        },
        timeout: 40000 // 40-second timeout
      });
      
      let output = res.data?.response || "🚫 No response from DeepSeek engine";
      
      // Format code blocks if detected
      if (output.includes("```")) {
        output = output.replace(/```(\w+)?\s*([\s\S]*?)```/g, (match, lang, code) => {
          return `\`\`\`${lang || 'text'}\n${code.trim()}\n\`\`\``;
        });
      }
      
      // Send formatted response
      await sock.sendMessage(m.chat, {
        text: `💻 *DEEPSEEK RESPONSE*\n\n${output}\n\n━━━━━━━━━━━━━━━━━━━━━━━\n🔧 *Generated in ${res.headers?.['x-response-time'] || 'N/A'}ms*\n📌 _Powered by ALPHA-BLAKE_`,
        contextInfo: {
          externalAdReply: {
            title: "🚀 CODE GENERATION COMPLETE",
            body: "DeepSeek Coder v6.7B",
            thumbnailUrl: DEEPSEEK_BANNER,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: DEEPSEEK_SOURCE
          }
        }
      }, { quoted: m });
      
    } catch (err) {
      console.error("DEEPSEEK CODING ERROR:", err);
      const errorStatus = err.response?.status || 500;
      const errorCodes = {
        400: "INVALID_REQUEST",
        401: "API_KEY_INVALID",
        429: "RATE_LIMITED",
        500: "SERVER_ERROR",
        503: "MODEL_OVERLOADED"
      };
      
      await sock.sendMessage(m.chat, {
        text: `⚠️ *CODING SYSTEM FAILURE*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ▸ Error: ${errorCodes[errorStatus] || 'UNKNOWN_ERROR'}
┃  ▸ Status: ${errorStatus}
┃  ▸ Query: ${query.slice(0, 40)}${query.length > 40 ? '...' : ''}
┃  
┃  🔧 Try again later or simplify request
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
        contextInfo: {
          externalAdReply: {
            title: "🚨 DEEPSEEK SYSTEM ERROR",
            body: "Coding engine offline",
            thumbnailUrl: DEEPSEEK_BANNER,
            sourceUrl: DEEPSEEK_SOURCE
          }
        }
      });
    }
  }
};