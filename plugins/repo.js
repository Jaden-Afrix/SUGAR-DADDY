/*************************************************
 SUGAR DADDY - REPOSITORY SYSTEM v2.0
 INTERACTIVE SOURCE CODE ENGAGEMENT PLATFORM
 Owner: ALPHA-BLAKE
**************************************************/

const axios = require("axios");
const moment = require("moment");
const REPO_BANNER = "https://files.catbox.moe/ck4i9e.jpg";
const REPO_URL = "https://github.com/Jaden-Afrix/SUGAR-DADDY";
const API_URL = "https://api.github.com/repos/Jaden-Afrix/SUGAR-DADDY";

// Repository statistics
const statsPath = require('path').join(__dirname, '../lib/repo_stats.json');
let REPO_STATS = { views: 0, clones: 0, lastUpdated: '' };

// Load stats
try {
  if (require('fs').existsSync(statsPath)) {
    REPO_STATS = JSON.parse(require('fs').readFileSync(statsPath));
  }
} catch (e) {
  console.error('Repo stats error:', e);
}

module.exports = {
  name: "repo",
  alias: ["source", "github", "codebase"],
  category: "core",
  desc: "💻 Access and explore the bot's source code",
  
  async exec(m, { sock }) {
    // Update stats
    REPO_STATS.views++;
    this.saveStats();
    
    const user = m.pushName || m.sender.split('@')[0];
    
    try {
      // Get repo data from GitHub API
      const repoData = await this.fetchRepoData();
      
      // Create interactive message
      await sock.sendMessage(m.chat, {
        text: this.generateRepoInfo(user, repoData),
        templateButtons: [
          { urlButton: { displayText: "⭐ VIEW REPOSITORY", url: REPO_URL } },
          { urlButton: { displayText: "🚀 DEPLOY TO HEROKU", url: `${REPO_URL}/tree/main#deployment` } },
          { quickReplyButton: { displayText: "📊 REPO STATS", id: "!repo stats" } }
        ],
        contextInfo: {
          externalAdReply: {
            title: "💻 SOURCE CODE ACCESS",
            body: "Contribute to SUGAR DADDY",
            thumbnailUrl: REPO_BANNER,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: REPO_URL
          }
        }
      });
      
      // Add reaction
      await sock.sendMessage(m.chat, {
        react: { text: "💻", key: m.key }
      });
      
    } catch (err) {
      console.error("REPO ERROR:", err);
      // Fallback if API fails
      await sock.sendMessage(m.chat, {
        text: `📦 *SUGAR DADDY REPOSITORY*\n\n` +
          `🔗 ${REPO_URL}\n\n` +
          "💻 Official source code repository\n" +
          "🌟 Star & contribute to the project!\n\n" +
          "📊 Stats unavailable temporarily\n" +
          `👋 Thanks ${user} for your interest!`,
        contextInfo: {
          externalAdReply: {
            title: "📦 GITHUB REPOSITORY",
            body: "Explore the bot's codebase",
            thumbnailUrl: REPO_BANNER,
            sourceUrl: REPO_URL
          }
        }
      });
    }
  },
  
  async handleEvent(m, { sock }) {
    if (m?.message?.templateButtonReplyMessage?.selectedId === "!repo stats") {
      const stats = REPO_STATS;
      const lastUpdated = stats.lastUpdated ? moment(stats.lastUpdated).fromNow() : 'Never';
      
      await sock.sendMessage(m.chat, {
        text: `📊 *REPOSITORY ENGAGEMENT*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👁️ Views via bot: ${stats.views}
┃  📅 Last viewed: ${lastUpdated}
┃  
┃  🌟 *Development Stats:*
┃  • Commits: ${stats.commits || 'N/A'}
┃  • Contributors: ${stats.contributors || 'N/A'}
┃  • Latest Release: ${stats.latestRelease || 'N/A'}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
📌 Help grow the project by starring!`
      });
    }
  },
  
  async fetchRepoData() {
    const { data } = await axios.get(API_URL, {
      timeout: 5000,
      headers: { 'User-Agent': 'SugarDaddy-Bot' }
    });
    
    // Update stats from API
    REPO_STATS.commits = data.commits_count || 0;
    REPO_STATS.contributors = data.contributors_count || 0;
    REPO_STATS.latestRelease = data.releases[0]?.name || 'None';
    REPO_STATS.lastUpdated = new Date().toISOString();
    this.saveStats();
    
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      issues: data.open_issues_count,
      watchers: data.watchers_count,
      license: data.license?.name || 'MIT',
      created: moment(data.created_at).format('MMM YYYY'),
      updated: moment(data.updated_at).fromNow(),
      description: data.description || 'SUGAR DADDY WhatsApp Bot'
    };
  },
  
  generateRepoInfo(user, data) {
    return `💻 *SUGAR DADDY REPOSITORY*

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ${data.description}
┃  
┃  🌟 Stars: ${data.stars}
┃  🍴 Forks: ${data.forks}
┃  📂 Issues: ${data.issues}
┃  👀 Watchers: ${data.watchers}
┃  
┃  📜 License: ${data.license}
┃  🚀 Created: ${data.created}
┃  🔄 Updated: ${data.updated}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👇 *Quick Actions:*
• View Repository
• Deploy to Heroku
• See Statistics

👋 Thanks ${user} for your interest!`;
  },
  
  saveStats() {
    REPO_STATS.lastUpdated = new Date().toISOString();
    require('fs').writeFileSync(statsPath, JSON.stringify(REPO_STATS, null, 2));
  }
};