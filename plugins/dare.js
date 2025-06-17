/*************************************************
 SUGAR DADDY - DARE GAME v2.0
 INTERACTIVE DARE CHALLENGE SYSTEM
 Owner: ALPHA-BLAKE
**************************************************/

const fs = require("fs");
const path = require("path");
const GAME_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const GAME_SOURCE = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

// Dare challenge database
const DARE_DB = [
  "Do your best impression of a famous celebrity",
  "Send the last photo in your gallery to this group",
  "Sing a song for 30 seconds in a funny voice",
  "Call a random contact and say 'I know what you did last summer'",
  "Post an embarrassing childhood photo in this group",
  "Wear socks on your hands for the next hour",
  "Do 20 pushups right now and record it",
  "Text your crush 'I think about you when I shower'",
  "Let the group choose your profile picture for 24 hours",
  "Eat a spoonful of a condiment you dislike",
  "Do a handstand against the wall for 30 seconds",
  "Send the most embarrassing text in your history to this group",
  "Call a family member and say 'I joined the circus'",
  "Dance like nobody's watching for 1 minute on video",
  "Wear your clothes inside out for the next 2 hours",
  "Speak in rhymes for the next 10 messages",
  "Put an ice cube down your shirt and keep it until it melts",
  "Let someone draw on your face with a marker",
  "Do your best animal impression for 1 minute",
  "Attempt to lick your elbow on camera"
];

// Difficulty levels
const DIFFICULTY = {
  EASY: "🌟 EASY",
  MEDIUM: "🔥 MEDIUM",
  HARD: "💀 HARD"
};

// Game statistics tracker
const gameStatsPath = path.join(__dirname, "../lib/dare_stats.json");
let GAME_STATS = {};

// Load game stats
if (fs.existsSync(gameStatsPath)) {
  try {
    GAME_STATS = JSON.parse(fs.readFileSync(gameStatsPath));
  } catch (e) {
    console.error("Error loading dare stats:", e);
  }
}

module.exports = {
  name: "dare",
  alias: ["d", "daregame", "challenge"],
  category: "game",
  desc: "🎮 Give and take daring challenges",
  
  async exec(m, { sock, args, participants }) {
    // Get mentioned user or default to sender
    const mentioned = m.mentionedJid?.[0] || m.sender;
    const username = mentioned.split("@")[0];
    const isSelf = mentioned === m.sender;
    
    // Initialize user stats
    if (!GAME_STATS[username]) {
      GAME_STATS[username] = {
        dares: 0,
        completed: 0,
        lastDare: "",
        lastDate: ""
      };
    }
    
    try {
      // Get random dare with difficulty
      const randomIndex = Math.floor(Math.random() * DARE_DB.length);
      const dare = DARE_DB[randomIndex];
      
      // Assign difficulty based on index
      let difficulty;
      if (randomIndex < 7) difficulty = DIFFICULTY.EASY;
      else if (randomIndex < 14) difficulty = DIFFICULTY.MEDIUM;
      else difficulty = DIFFICULTY.HARD;
      
      // Update stats
      GAME_STATS[username].dares++;
      GAME_STATS[username].lastDare = dare;
      GAME_STATS[username].lastDate = new Date().toISOString();
      
      // Save stats
      fs.writeFileSync(gameStatsPath, JSON.stringify(GAME_STATS, null, 2));
      
      // Build dare message
      const challengeMsg = `🎮 *DARE CHALLENGE* ${isSelf ? '' : `FOR @${username}`}\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ${difficulty} DARE:
┃  ${dare}
┃  
┃  ⏱️ _Complete within 3 minutes!_
┃  ✅ Use .done when finished
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
${isSelf ? 
  "🔹 This dare is for YOU!" : 
  `🔹 ${m.sender.split('@')[0]} dared you!`}\n
📊 *Your Stats:* 
▸ Total Dares: ${GAME_STATS[username].dares}
▸ Completed: ${GAME_STATS[username].completed}`;
      
      // Send challenge
      const dareMsg = await sock.sendMessage(m.chat, {
        text: challengeMsg,
        mentions: [mentioned],
        contextInfo: {
          externalAdReply: {
            title: `😈 ${username}'s DARE`,
            body: difficulty,
            thumbnailUrl: GAME_BANNER,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: GAME_SOURCE
          }
        }
      });
      
      // Add game reaction
      await sock.sendMessage(m.chat, {
        react: { text: "😈", key: m.key }
      });
      
      // Store active dare
      const activeDare = {
        user: mentioned,
        dare,
        timestamp: Date.now(),
        messageId: dareMsg.key.id
      };
      
      // Add to global active dares (you'll need to initialize this in your main file)
      if (!global.activeDares) global.activeDares = {};
      global.activeDares[mentioned] = activeDare;
      
      // Start 3-minute timer
      setTimeout(async () => {
        if (global.activeDares[mentioned]?.dare === dare) {
          delete global.activeDares[mentioned];
          await sock.sendMessage(m.chat, {
            text: `⌛ *TIME'S UP!*\n@${username} failed the dare!\n\n` +
              "┏━━━━━━━━━━━━━━━━━━━━━━━━━┓\n" +
              `┃  🚫 ${dare}\n` +
              "┃  🔸 Difficulty: " + difficulty + "\n" +
              "┗━━━━━━━━━━━━━━━━━━━━━━━━━┛",
            mentions: [mentioned]
          });
        }
      }, 180000);
      
    } catch (err) {
      console.error("DARE GAME ERROR:", err);
      await sock.sendMessage(m.chat, {
        text: `⚠️ *DARE SYSTEM FAILURE*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ▸ Error: ${err.message || "Unknown"}
┃  ▸ Please try again later
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`
      });
    }
  }
};