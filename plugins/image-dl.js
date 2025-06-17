/*************************************************
 SUGAR DADDY - QUANTUM IMAGE EXTRACTOR v2.1
 Fixed & Enhanced Image Download System
 Owner: ALPHA-BLAKE
**************************************************/

const axios = require("axios");

// Bold text conversion function
function bold(text) {
    const boldMap = {
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
        'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
        'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷',
        'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁',
        'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵',
        ' ': ' ', '!': '!', '@': '@', '#': '#', '$': '$', '%': '%', '^': '^', '&': '&', '*': '*', 
        '(': '(', ')': ')', '-': '-', '_': '_', '+': '+', '=': '=', '[': '[', ']': ']', 
        '{': '{', '}': '}', ';': ';', ':': ':', ',': ',', '.': '.', '/': '/', '?': '?'
    };
    return text.split('').map(char => boldMap[char] || char).join('');
}

const QUANTUM_API = "https://api.nexoracle.com/downloader/aio2";
const API_KEY = "7902cbef76b269e176";
const MAX_SIZE = 20 * 1024 * 1024; // 20MB limit

// Quantum resources
const QUANTUM_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const QUANTUM_AUDIO = "https://files.catbox.moe/cebgdf.mp3";
const QUANTUM_CHANNEL = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

// Cooldown protection
const IMG_COOLDOWN = {};
const COOLDOWN_TIME = 15000; // 15 seconds

module.exports = {
    name: "img",
    alias: ["image", "dlimg", "aioimg"],
    category: "download",
    desc: bold("🖼️ Quantum image extraction"),
    use: bold("<media_url>"),

    async exec(m, { sock, args }) {
        // Quantum security protocols
        const mediaURL = args[0];
        if (!mediaURL || !mediaURL.startsWith("http")) {
            return m.reply(bold("❌ INVALID URL\n┏━━━━━━━━━━━━━━┓\n┃ Provide a valid http/https link\n┃ Example: .img https://t.co/image\n┗━━━━━━━━━━━━━━┛"));
        }

        // Quantum cooldown check
        const userKey = `${m.sender}_img`;
        const lastRequest = IMG_COOLDOWN[userKey] || 0;
        const now = Date.now();
        if (now - lastRequest < COOLDOWN_TIME) {
            const remaining = Math.ceil((COOLDOWN_TIME - (now - lastRequest)) / 1000);
            return m.reply(bold(`⌛ QUANTUM COOLDOWN\n┏━━━━━━━━━━━━━━┓\n┃ Please wait ${remaining}s\n┃ before next image request\n┗━━━━━━━━━━━━━━┛`));
        }
        IMG_COOLDOWN[userKey] = now;

        // Quantum extraction initiation
        const progressMsg = await sock.sendMessage(m.chat, {
            text: bold(`⚡ QUANTUM IMAGE EXTRACTION\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔍  Analyzing: *${mediaURL.substring(0, 30)}...*
┃  ⏱️  Estimated time: 10 seconds
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`),
            contextInfo: {
                externalAdReply: {
                    title: bold("🌌 QUANTUM IMAGE EXTRACTOR"),
                    body: bold("Powered by NexOracle"),
                    thumbnailUrl: QUANTUM_BANNER,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    sourceUrl: QUANTUM_CHANNEL
                }
            }
        });

        try {
            // Execute quantum extraction
            const { data } = await axios.get(`${QUANTUM_API}?apikey=${API_KEY}&url=${encodeURIComponent(mediaURL)}`, {
                timeout: 20000
            });

            if (!data || !data.result || !data.result.medias?.length) {
                return m.reply(bold("❌ QUANTUM SCAN FAILED\n┏━━━━━━━━━━━━━━┓\n┃ No images found in this URL\n┗━━━━━━━━━━━━━━┛"));
            }

            // Find highest quality image
            const imageMedia = data.result.medias
                .filter(media => 
                    media.type === "image" || 
                    /\.(jpg|jpeg|png|webp)$/i.test(media.url)
                )
                .sort((a, b) => (b.quality || 0) - (a.quality || 0))[0];

            if (!imageMedia) {
                return m.reply(bold("❌ NO IMAGES FOUND\n┏━━━━━━━━━━━━━━┓\n┃ Couldn't detect images in this content\n┗━━━━━━━━━━━━━━┛"));
            }

            // Check size limit
            if (imageMedia.size && imageMedia.size > MAX_SIZE) {
                const foundSize = (imageMedia.size / 1024 / 1024).toFixed(1);
                return m.reply(bold(`❌ FILE TOO LARGE\n┏━━━━━━━━━━━━━━┓\n┃ Max allowed: 20MB\n┃ Found: ${foundSize}MB\n┗━━━━━━━━━━━━━━┛`));
            }

            // Quantum image delivery
            await sock.sendMessage(m.chat, {
                image: { url: imageMedia.url },
                caption: bold(`🖼️ QUANTUM IMAGE EXTRACTED\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔗  Source: ${mediaURL.substring(0, 30)}...
┃  📏  Size: ${imageMedia.size ? (imageMedia.size / 1024).toFixed(1) + 'KB' : 'Unknown'}
┃  🖌️  Quality: ${imageMedia.quality || 'High'}
┃  📦  Format: ${imageMedia.extension || 'JPEG'}
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`),
                contextInfo: {
                    externalAdReply: {
                        title: bold("✅ IMAGE EXTRACTION SUCCESS"),
                        body: bold("Powered by NexOracle"),
                        thumbnailUrl: QUANTUM_BANNER,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        sourceUrl: mediaURL
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

            // Send original url in case of quality loss
            await sock.sendMessage(m.chat, {
                text: bold(`🔗 ORIGINAL CONTENT URL\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  Direct link for full quality:
┃  ${mediaURL}
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`)
            });

        } catch (e) {
            console.error("[QUANTUM IMG] Error:", e);
            return m.reply(bold(`❌ QUANTUM FAILURE\n┏━━━━━━━━━━━━━━┓\n┃ ${e.message || "Extraction failed"}\n┗━━━━━━━━━━━━━━┛`));
        } finally {
            // Clean quantum progress
            if (progressMsg) {
                await sock.sendMessage(m.chat, { delete: progressMsg.key });
            }
        }
    }
};