/*************************************************
 𝗦𝗨𝗚𝗔𝗥 𝗗𝗔𝗗𝗗𝗬 - 𝗤𝗨𝗔𝗡𝗧𝗨𝗠 𝗠𝗨𝗦𝗜𝗖 𝗣𝗟𝗔𝗬𝗘𝗥 𝗩𝟯.𝟬
 𝗘𝗟𝗜𝗧𝗘 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗠𝗨𝗦𝗜𝗖 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥
 𝗢𝗪𝗡𝗘𝗥: 𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘
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

const QUANTUM_API = "https://api.nexoracle.com/downloader/yt-audio2";
const API_KEY = "7902cbef76b269e176";
const MAX_SIZE = 50 * 1024 * 1024; // 50MB limit

// Quantum resources
const QUANTUM_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const QUANTUM_AUDIO_ALERT = "https://files.catbox.moe/cebgdf.mp3";
const QUANTUM_CHANNEL = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

// Cooldown protection
const MUSIC_COOLDOWN = {};
const COOLDOWN_TIME = 20000; // 20 seconds

module.exports = {
    name: "play",
    alias: ["ytplay", "song", "music"],
    category: "download",
    desc: "🎧 Download music by name or title",
    use: "<song title>",

    async exec(m, { sock, args }) {
        // Get song query
        const query = args.join(" ");
        
        // Validate query
        if (!query) {
            return m.reply(BOLD_CAPS("🎵 ENTER A SONG NAME TO SEARCH!\n┏━━━━━━━━━━━━━━┓\n┃ EXAMPLE: PLAY 2PAC ALL EYEZ ON ME\n┗━━━━━━━━━━━━━━┛"));
        }

        // Cooldown check
        const userKey = `${m.sender}_music`;
        const lastRequest = MUSIC_COOLDOWN[userKey] || 0;
        const now = Date.now();
        if (now - lastRequest < COOLDOWN_TIME) {
            const remaining = Math.ceil((COOLDOWN_TIME - (now - lastRequest)) / 1000);
            return m.reply(BOLD_CAPS(`⌛ QUANTUM COOLDOWN\n┏━━━━━━━━━━━━━━┓\n┃ PLEASE WAIT ${remaining}S\n┃ BEFORE NEXT SONG REQUEST\n┗━━━━━━━━━━━━━━┛`));
        }
        MUSIC_COOLDOWN[userKey] = now;

        // Send progress message
        const progressMsg = await sock.sendMessage(m.chat, {
            text: BOLD_CAPS(`🔍 QUANTUM MUSIC SEARCH\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎵  SEARCHING: *${query}*
┃  ⏱️  ESTIMATED TIME: 10 SECONDS
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`),
            contextInfo: {
                externalAdReply: {
                    title: "🌌 QUANTUM MUSIC PLAYER",
                    body: "POWERED BY ALPHA-BLAKE",
                    thumbnailUrl: QUANTUM_BANNER,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    sourceUrl: QUANTUM_CHANNEL
                }
            }
        });

        try {
            // Execute quantum music search
            const { data } = await axios.get(`${QUANTUM_API}?apikey=${API_KEY}&q=${encodeURIComponent(query)}`, {
                timeout: 30000
            });
            const result = data?.result;

            // Validate result
            if (!result || !result.url) {
                return m.reply(BOLD_CAPS("❌ QUANTUM SCAN FAILED\n┏━━━━━━━━━━━━━━┓\n┃ NO SONGS FOUND FOR YOUR QUERY\n┗━━━━━━━━━━━━━━┛"));
            }

            // Check file size
            const fileSize = parseInt(result.filesize || "0");
            if (fileSize > MAX_SIZE) {
                return m.reply(BOLD_CAPS(`❌ FILE TOO LARGE\n┏━━━━━━━━━━━━━━┓\n┃ MAX ALLOWED: 50MB\n┃ FILE SIZE: ${(fileSize / 1024 / 1024).toFixed(1)}MB\n┗━━━━━━━━━━━━━━┛`));
            }

            // Send quantum music
            await sock.sendMessage(m.chat, {
                audio: { url: result.url },
                fileName: `${result.title}.mp3`,
                mimetype: "audio/mpeg",
                caption: BOLD_CAPS(`🎵 QUANTUM MUSIC PLAYER\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎶  TITLE: ${result.title}
┃  ⏱️  DURATION: ${result.duration}
┃  📏  SIZE: ${result.filesize}
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\nPOWERED BY ALPHA-BLAKE`),
                contextInfo: {
                    externalAdReply: {
                        title: "▶️ NOW PLAYING",
                        body: result.title,
                        thumbnailUrl: QUANTUM_BANNER,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        sourceUrl: result.url
                    },
                    forwardingScore: 999,
                    isForwarded: true
                }
            }, { quoted: m });

            // Quantum audio alert
            await sock.sendMessage(m.chat, {
                audio: { url: QUANTUM_AUDIO_ALERT },
                mimetype: "audio/mp4",
                ptt: true
            });

            // Send YouTube URL
            await sock.sendMessage(m.chat, {
                text: BOLD_CAPS(`🔗 YOUTUBE URL\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ${result.url}
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`)
            });

        } catch (e) {
            console.error("[QUANTUM MUSIC] Error:", e);
            return m.reply(BOLD_CAPS(`❌ QUANTUM FAILURE\n┏━━━━━━━━━━━━━━┓\n┃ ${e.message || "MUSIC DOWNLOAD FAILED"}\n┗━━━━━━━━━━━━━━┛`));
        } finally {
            // Clean quantum progress
            if (progressMsg) {
                await sock.sendMessage(m.chat, { delete: progressMsg.key });
            }
        }
    }
};