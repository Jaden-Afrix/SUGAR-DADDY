/*************************************************
 SUGAR DADDY - QUANTUM MEDIAFIRE DOWNLOADER v2.0
 Elite File Extraction System
 Owner: ALPHA-BLAKE
**************************************************/

const axios = require("axios");

// Function to convert text to BOLD CAPS
function BOLD_CAPS(text) {
    return text.toUpperCase().split('').map(char => {
        const boldMap = {
            'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
            'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
            'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
            '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
        };
        return boldMap[char] || char;
    }).join('');
}

const QUANTUM_API = "https://api.nexoracle.com/downloader/media-fire";
const API_KEY = "7902cbef76b269e176";
const MAX_SIZE = 100 * 1024 * 1024; // 100MB limit

// Quantum resources
const QUANTUM_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const QUANTUM_AUDIO = "https://files.catbox.moe/cebgdf.mp3";
const QUANTUM_CHANNEL = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

// Cooldown protection
const MF_COOLDOWN = {};
const COOLDOWN_TIME = 30000; // 30 seconds

module.exports = {
    name: "mediafire",
    alias: ["mediaf", "mf"],
    category: "download",
    desc: "📁 Download files from Mediafire",
    use: "<mediafire_url>",

    async exec(m, { sock, args }) {
        // Get Mediafire URL
        const mfUrl = args[0];
        
        // Validate URL
        if (!mfUrl || !mfUrl.includes("mediafire.com")) {
            return m.reply(BOLD_CAPS("❗ INVALID MEDIAFIRE URL\n┏━━━━━━━━━━━━━━┓\n┃ PROVIDE A VALID MEDIAFIRE LINK\n┃ EXAMPLE: .MEDIAFIRE HTTPS://MEDIAFIRE.COM/FILE/...\n┗━━━━━━━━━━━━━━┛"));
        }

        // Cooldown check
        const userKey = `${m.sender}_mf`;
        const lastRequest = MF_COOLDOWN[userKey] || 0;
        const now = Date.now();
        if (now - lastRequest < COOLDOWN_TIME) {
            const remaining = Math.ceil((COOLDOWN_TIME - (now - lastRequest)) / 1000) ;
            return m.reply(BOLD_CAPS(`⌛ QUANTUM COOLDOWN\n┏━━━━━━━━━━━━━━┓\n┃ PLEASE WAIT ${remaining}S\n┃ BEFORE NEXT DOWNLOAD\n┗━━━━━━━━━━━━━━┛`));
        }
        MF_COOLDOWN[userKey] = now;

        // Send progress message
        const progressMsg = await sock.sendMessage(m.chat, {
            text: BOLD_CAPS(`⚡ QUANTUM MEDIAFIRE EXTRACTION\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔍  ANALYZING: ${mfUrl.substring(0, 30)}...
┃  ⏱️  ESTIMATED TIME: 15 SECONDS
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`),
            contextInfo: {
                externalAdReply: {
                    title: "🌌 QUANTUM MEDIAFIRE DOWNLOADER",
                    body: "POWERED BY ALPHA-BLAKE",
                    thumbnailUrl: QUANTUM_BANNER,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    sourceUrl: QUANTUM_CHANNEL
                }
            }
        });

        try {
            // Execute quantum extraction
            const { data } = await axios.get(`${QUANTUM_API}?apikey=${API_KEY}&url=${encodeURIComponent(mfUrl)}`, {
                timeout: 30000
            });
            const result = data?.result;

            // Validate result
            if (!result || !result.url) {
                return m.reply(BOLD_CAPS("❌ QUANTUM SCAN FAILED\n┏━━━━━━━━━━━━━━┓\n┃ FAILED TO FETCH FILE\n┃ CHECK LINK VALIDITY\n┗━━━━━━━━━━━━━━┛"));
            }

            // Check file size
            const fileSize = parseInt(result.filesize || "0");
            if (fileSize > MAX_SIZE) {
                const maxMB = (MAX_SIZE / 1024 / 1024).toFixed(0);
                return m.reply(BOLD_CAPS(`❌ FILE TOO LARGE\n┏━━━━━━━━━━━━━━┓\n┃ MAX ALLOWED: ${maxMB}MB\n┃ FILE SIZE: ${(fileSize / 1024 / 1024).toFixed(1)}MB\n┗━━━━━━━━━━━━━━┛`));
            }

            // Send quantum file
            await sock.sendMessage(m.chat, {
                document: { url: result.url },
                fileName: result.filename || "QUANTUM_FILE",
                mimetype: result.mimetype || "application/octet-stream",
                caption: BOLD_CAPS(`📁 QUANTUM MEDIAFIRE DOWNLOAD\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📦  NAME: ${result.filename || "UNKNOWN"}
┃  📏  SIZE: ${result.filesize || "UNKNOWN"}
┃  🔗  DIRECT URL: ${result.url.substring(0, 30)}...
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\nPOWERED BY ALPHA-BLAKE`),
                contextInfo: {
                    externalAdReply: {
                        title: "✅ FILE EXTRACTION SUCCESS",
                        body: "POWERED BY ALPHA-BLAKE",
                        thumbnailUrl: QUANTUM_BANNER,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        sourceUrl: mfUrl
                    },
                    forwardingScore: 1000,
                    isForwarded: true
                }
            }, { quoted: m });

            // Quantum audio alert
            await sock.sendMessage(m.chat, {
                audio: { url: QUANTUM_AUDIO },
                mimetype: 'audio/mp4',
                ptt: true
            });

            // Send direct URL as fallback
            await sock.sendMessage(m.chat, {
                text: BOLD_CAPS(`🔗 DIRECT FILE URL\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ${result.url}
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`)
            });

        } catch (e) {
            console.error("[QUANTUM MEDIAFIRE] Error:", e);
            return m.reply(BOLD_CAPS(`❌ QUANTUM FAILURE\n┏━━━━━━━━━━━━━━┓\n┃ ${e.message || "EXTRACTION FAILED"}\n┗━━━━━━━━━━━━━━┛`));
        } finally {
            // Clean quantum progress
            if (progressMsg) {
                await sock.sendMessage(m.chat, { delete: progressMsg.key });
            }
        }
    }
};