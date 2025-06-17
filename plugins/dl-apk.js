/*************************************************
 SUGAR DADDY - QUANTUM APK DOWNLOADER v2.0
 Elite APK File Delivery via NexOracle API
 Owner: ALPHA-BLAKE
**************************************************/

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const QUANTUM_API = "https://api.nexoracle.com/downloader/apk";
const API_KEY = "7902cbef76b269e176";

// Quantum resources
const QUANTUM_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const QUANTUM_AUDIO = "https://files.catbox.moe/cebgdf.mp3";
const QUANTUM_CHANNEL = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

// Quantum cooldown protection
const APK_COOLDOWN = {};
const COOLDOWN_TIME = 30000; // 30 seconds
const MAX_SIZE = 50 * 1024 * 1024; // 50MB limit

module.exports = {
  name: "apk",
  alias: ["dlapk", "apkd"],
  category: "download",
  desc: "📦 Quantum APK file delivery",
  use: "<app_name>",
  
  async exec(m, { sock, args }) {
    // Quantum security protocols
    const query = args.join(" ");
    if (!query) return m.reply("❌ *QUERY REQUIRED*\n┏━━━━━━━━━━━━━━┓\n┃ Enter app name to search\n┃ Example: .apk instagram\n┗━━━━━━━━━━━━━━┛");
    
    // Quantum cooldown check
    const userKey = `${m.sender}_apk`;
    const lastRequest = APK_COOLDOWN[userKey] || 0;
    const now = Date.now();
    if (now - lastRequest < COOLDOWN_TIME) {
      const remaining = Math.ceil((COOLDOWN_TIME - (now - lastRequest)) / 1000);
      return m.reply(`⌛ *QUANTUM COOLDOWN*\n┏━━━━━━━━━━━━━━┓\n┃ Please wait ${remaining}s\n┃ before next download\n┗━━━━━━━━━━━━━━┛`);
    }
    APK_COOLDOWN[userKey] = now;
    
    // Quantum search initiation
    const progressMsg = await sock.sendMessage(m.chat, {
      text: `⚡ *QUANTUM APK SEARCH*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔍  Scanning Nexus for: *${query}*
┃  ⏱️  Estimated time: 10 seconds
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
      contextInfo: {
        externalAdReply: {
          title: "🌌 APK QUANTUM DOWNLOADER",
          body: "Powered by NexOracle",
          thumbnailUrl: QUANTUM_BANNER,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: QUANTUM_CHANNEL
        }
      }
    });
    
    try {
      // Execute quantum retrieval
      const { data } = await axios.get(`${QUANTUM_API}?apikey=${API_KEY}&q=${encodeURIComponent(query)}`, {
        timeout: 15000
      });
      
      if (!data || !data.title || !data.downloadUrl) {
        return m.reply("❌ *QUANTUM SCAN FAILED*\n┏━━━━━━━━━━━━━━┓\n┃ APK not found in database\n┗━━━━━━━━━━━━━━┛");
      }
      
      // Check file size
      const sizeMatch = data.size.match(/([\d.]+)\s*(MB|KB)/i);
      if (sizeMatch) {
        const sizeValue = parseFloat(sizeMatch[1]);
        const unit = sizeMatch[2].toUpperCase();
        const sizeBytes = unit === "MB" ? sizeValue * 1024 * 1024 : sizeValue * 1024;
        
        if (sizeBytes > MAX_SIZE) {
          return m.reply(`❌ *FILE TOO LARGE*\n┏━━━━━━━━━━━━━━┓\n┃ Size: ${data.size}\n┃ Max: 50MB\n┗━━━━━━━━━━━━━━┛`);
        }
      }
      
      // Quantum download initiation
      await sock.sendMessage(m.chat, {
        text: `⬇️ *QUANTUM DOWNLOAD STARTED*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📦  *App:* ${data.title}
┃  🧾  *Version:* ${data.version || 'Latest'}
┃  📏  *Size:* ${data.size || 'Unknown'}
┃  ⏱️  *Estimated Time:* ${Math.ceil((parseInt(data.size) || 15) / 5)} seconds
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
        contextInfo: {
          externalAdReply: {
            title: "⬇️ DOWNLOAD IN PROGRESS",
            body: data.title,
            thumbnailUrl: data.icon || QUANTUM_BANNER,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: data.downloadUrl
          }
        }
      });
      
      // Download APK file
      const apkResponse = await axios.get(data.downloadUrl, {
        responseType: "arraybuffer",
        timeout: 60000
      });
      
      const apkBuffer = Buffer.from(apkResponse.data);
      const fileName = `${data.title.replace(/[^\w\s]/gi, '')}_${data.version || 'v1.0'}.apk`.substring(0, 60);
      
      // Quantum file delivery
      await sock.sendMessage(m.chat, {
        document: apkBuffer,
        fileName: fileName,
        mimetype: 'application/vnd.android.package-archive',
        caption: `📦 *QUANTUM APK DELIVERY*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✅  ${data.title} (${data.version})
┃  📏  Size: ${formatBytes(apkBuffer.length)}
┃  🔒  Install with caution
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
        contextInfo: {
          externalAdReply: {
            title: "✅ DOWNLOAD COMPLETE",
            body: "Installation guide below",
            thumbnailUrl: data.icon || QUANTUM_BANNER,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: "https://www.wikihow.com/Install-APK-Files-on-Android"
          }
        }
      });
      
      // Quantum audio alert
      await sock.sendMessage(m.chat, {
        audio: { url: QUANTUM_AUDIO },
        mimetype: 'audio/mp4',
        ptt: true
      });
      
      // Quantum installation guide
      await sock.sendMessage(m.chat, {
        text: `📲 *QUANTUM INSTALLATION GUIDE*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  1. Open downloaded APK file
┃  2. Tap "Settings" → Enable "Unknown Sources"
┃  3. Return and tap "Install"
┃  4. Launch your new app!
┃  
┃  ⚠️ *Security Tip:* Scan with VirusTotal
┃  🔗 ${data.virustotal || 'https://www.virustotal.com/'}
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
        contextInfo: {
          externalAdReply: {
            title: "⚠️ SECURITY NOTICE",
            body: "Install trusted apps only",
            thumbnailUrl: "https://i.ibb.co/9sXqVcG/android-install.png",
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: "https://www.virustotal.com/"
          }
        }
      });
      
    } catch (e) {
      console.error("[QUANTUM APK] Error:", e);
      return m.reply(`❌ *QUANTUM FAILURE*\n┏━━━━━━━━━━━━━━┓\n┃ ${e.message || "Download failed"}\n┗━━━━━━━━━━━━━━┛`);
    } finally {
      // Clean quantum progress
      if (progressMsg) {
        await sock.sendMessage(m.chat, { delete: progressMsg.key });
      }
    }
  }
};

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}