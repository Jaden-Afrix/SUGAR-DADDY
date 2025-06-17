/*************************************************
 SUGAR DADDY - SYSTEM DIAGNOSTICS v2.0
 REAL-TIME PERFORMANCE MONITORING
 Owner: ALPHA-BLAKE
**************************************************/

const os = require("os");
const process = require("process");
const moment = require("moment");
require("moment-duration-format");
const { formatBytes } = require("../utils/helpers"); // Add helper function

const DIAG_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

// Create helper if not available
if (!formatBytes) {
  global.formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
}

module.exports = {
  name: "ping",
  alias: ["status", "health", "diagnostics"],
  category: "core",
  desc: "📊 Check system performance and bot health",
  
  async exec(m, { sock }) {
    const start = Date.now();
    
    // Get system stats
    const stats = this.getSystemStats();
    const end = Date.now();
    const ping = end - start;
    
    // Update ping in stats
    stats.ping = ping;
    
    // Create diagnostics report
    const report = this.generateReport(stats);
    
    await sock.sendMessage(m.chat, {
      text: report,
      contextInfo: {
        externalAdReply: {
          title: `📊 ${stats.status} - SYSTEM HEALTH`,
          body: `Response: ${ping}ms | Uptime: ${stats.uptime}`,
          thumbnailUrl: DIAG_BANNER,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: CHANNEL_LINK
        }
      }
    });
    
    // Add real-time reaction
    await sock.sendMessage(m.chat, {
      react: { text: stats.status === "OPTIMAL" ? "🟢" : "🟠", key: m.key }
    });
  },
  
  getSystemStats() {
    // Calculate uptime
    const uptime = moment.duration(process.uptime(), "seconds").format("d[d] h[h] m[m] s[s]");
    
    // Memory usage
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    // Load averages
    const load = os.loadavg().map(l => l.toFixed(2)).join(', ');
    
    // Health status
    const memoryUsage = (usedMem / totalMem) * 100;
    const status = memoryUsage > 90 ? "CRITICAL" :
      memoryUsage > 75 ? "WARNING" : "OPTIMAL";
    
    return {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      node: process.version,
      cpu: os.cpus()[0].model,
      cores: os.cpus().length,
      uptime,
      ping: 0,
      memory: {
        total: formatBytes(totalMem),
        used: formatBytes(usedMem),
        free: formatBytes(freeMem),
        usage: memoryUsage.toFixed(1) + '%'
      },
      load,
      status
    };
  },
  
  generateReport(stats) {
    return `📊 *SUGAR DADDY DIAGNOSTICS REPORT*

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔹 *RESPONSE TIME:* ${stats.ping}ms
┃  🔹 *STATUS:* ${this.getStatusIcon(stats.status)} ${stats.status}
┃  🔹 *UPTIME:* ${stats.uptime}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🖥️ *SYSTEM INFO*
▸ Host: ${stats.hostname}
▸ OS: ${stats.platform} (${stats.arch})
▸ Node: ${stats.node}
▸ CPU: ${stats.cpu.split(' ')[0]} (${stats.cores} cores)
▸ Load: ${stats.load}

🧠 *MEMORY USAGE*
▸ Total: ${stats.memory.total}
▸ Used: ${stats.memory.used} (${stats.memory.usage})
▸ Free: ${stats.memory.free}

📡 *RECOMMENDED ACTIONS*
${this.getRecommendations(stats.memory.usage)}

_Powered by ALPHA-BLAKE | ${new Date().toLocaleString()}_`;
  },
  
  getStatusIcon(status) {
    return {
      OPTIMAL: '🟢',
      WARNING: '🟠',
      CRITICAL: '🔴'
    } [status];
  },
  
  getRecommendations(usage) {
    const percent = parseFloat(usage);
    if (percent > 90) {
      return "▸ ❗ IMMEDIATE RESTART REQUIRED\n▸ 🔍 Check for memory leaks\n▸ ⚠️ Reduce bot workload";
    }
    if (percent > 75) {
      return "▸ ⚠️ Consider restarting soon\n▸ 🔍 Monitor memory usage\n▸ 🗑️ Clear unused caches";
    }
    return "▸ ✅ System operating normally\n▸ 🚀 No action required";
  }
};