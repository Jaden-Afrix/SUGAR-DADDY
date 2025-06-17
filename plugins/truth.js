/*************************************************
 SUGAR DADDY - TRUTH GAME v2.0
 INTERACTIVE TRUTH CHALLENGE SYSTEM
 Owner: ALPHA-BLAKE
**************************************************/

const fs = require("fs");
const path = require("path");
const GAME_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const GAME_SOURCE = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

// Truth question database
const TRUTH_DB = [
  "What's the most embarrassing thing you've done to impress someone?",
  "Have you ever pretended to like a gift you hated? Which one?",
  "What's the weirdest thing you've ever eaten?",
  "If you could swap lives with anyone for a week, who would it be?",
  "What's the biggest lie you've ever told?",
  "What's your most irrational fear?",
  "What's the strangest dream you've ever had?",
  "Have you ever cheated in an exam?",
  "What's the most childish thing you still do?",
  "What's something you've done that you hope no one ever finds out?",
  "If you had to marry someone in this group, who would it be?",
  "What's the most trouble you've been in at school/work?",
  "What's your biggest insecurity?",
  "What's the most embarrassing song on your playlist?",
  "Have you ever stolen anything?",
  "What's the worst date you've ever been on?",
  "What's something you're secretly proud of?",
  "If you could eliminate one person from history, who would it be?",
  "What's the most expensive thing you've broken?",
  "What's your guilty pleasure TV show?"
];

// Game statistics tracker
const gameStatsPath = path.join(__dirname, "../lib/truth_stats.json");
let GAME_STATS = {};

// Load game stats
if (fs.existsSync(gameStatsPath)) {
  try {
    GAME_STATS = JSON.parse(fs.readFileSync(gameStatsPath));
  } catch (e) {
    console.error("Error loading game stats:", e);
  }
}

module.exports = {
  name: "truth",
  alias: ["t", "truthgame", "challenge"],
  category: "game",
  desc: "🎮 Answer random truth questions with friends",
  
  async exec(m, { sock, args, participants }) {
    // Get mentioned user or default to sender
    const mentioned = m.mentionedJid?.[0] || m.sender;
    const username = mentioned.split("@")[0];
    const isSelf = mentioned === m.sender;
    
    // Update game stats
    if (!GAME_STATS[username]) {
      GAME_STATS[username] = {
        questions: 0,
        lastQuestion: "",
        lastDate: ""
      };
    }
    
    try {
      // Get random question
      const question = TRUTH_DB[Math.floor(Math.random() * TRUTH_DB.length)];
      
      // Update stats
      GAME_STATS[username].questions++;
      GAME_STATS[username].lastQuestion = question;
      GAME_STATS[username].lastDate = new Date().toISOString();
      
      // Save stats
      fs.writeFileSync(gameStatsPath, JSON.stringify(GAME_STATS, null, 2));
      
      // Build challenge message
      const challengeMsg = `🎮 *TRUTH CHALLENGE* ${isSelf ? '' : `TO @${username}`}\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ❓ *QUESTION:*
┃  ${question}
┃  
┃  ⏱️ _You have 2 minutes to answer!_
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
${isSelf ? 
  "🔹 This question is for YOU!" : 
  `🔹 ${m.sender.split('@')[0]} challenged you!`}`;
      
      // Send challenge
      await sock.sendMessage(m.chat, {
        text: challengeMsg,
        mentions: [mentioned],
        contextInfo: {
          externalAdReply: {
            title: `🤫 ${username}'s TRUTH`,
            body: "Answer honestly!",
            thumbnailUrl: GAME_BANNER,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: GAME_SOURCE
          }
        }
      });
      
      // Add game reaction
      await sock.sendMessage(m.chat, {
        react: { text: "❓", key: m.key }
      });
      
      // Start 2-minute timer
      setTimeout(async () => {
        if (GAME_STATS[username].lastQuestion === question) {
          await sock.sendMessage(m.chat, {
            text: `⏰ *TIME'S UP!*\n@${username} failed to answer the truth!\n\n` +
              "┏━━━━━━━━━━━━━━━━━━━━━━━━━┓\n" +
              "┃  🚫 Truth avoided!\n" +
              "┃  🔸 Question: " + question + "\n" +
              "┗━━━━━━━━━━━━━━━━━━━━━━━━━┛",
            mentions: [mentioned]
          });
        }
      }, 120000);
      
    } catch (err) {
      console.error("TRUTH GAME ERROR:", err);
      await sock.sendMessage(m.chat, {
        text: `⚠️ *GAME SYSTEM FAILURE*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ▸ Error: ${err.message || "Unknown"}
┃  ▸ Please try again later
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`
      });
    }
  }
};