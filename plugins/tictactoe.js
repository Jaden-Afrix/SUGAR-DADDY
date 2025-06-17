/*************************************************
 SUGAR DADDY - TICTACTOE v2.0
 MULTIPLAYER STRATEGY GAME
 Owner: ALPHA-BLAKE
**************************************************/

const fs = require("fs");
const path = require("path");
const GAME_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const GAME_SOURCE = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

// Game state manager
const gameStatePath = path.join(__dirname, "../lib/tictactoe_games.json");
let GAME_STATES = {};

// Load existing games
if (fs.existsSync(gameStatePath)) {
  try {
    GAME_STATES = JSON.parse(fs.readFileSync(gameStatePath));
  } catch (e) {
    console.error("Error loading TicTacToe games:", e);
  }
}

// Game symbols
const SYMBOLS = {
  PLAYER_X: '❌',
  PLAYER_O: '⭕',
  EMPTY: '⬜'
};

module.exports = {
  name: "tictactoe",
  alias: ["ttt", "xo"],
  category: "game",
  desc: "❌⭕ Play Tic Tac Toe with friends",
  
  async exec(m, { sock, args, text }) {
    const chatId = m.chat;
    const player1 = m.sender;
    const player2 = m.mentionedJid?.[0];
    
    // Game commands
    const command = args[0]?.toLowerCase();
    
    // New game
    if (!command && player2) {
      return this.newGame(m, sock, chatId, player1, player2);
    }
    
    // Move command
    if (command && !isNaN(command)) {
      return this.makeMove(m, sock, chatId, player1, parseInt(command));
    }
    
    // Game status
    if (command === 'status') {
      return this.gameStatus(m, sock, chatId);
    }
    
    // Forfeit
    if (command === 'quit') {
      return this.forfeitGame(m, sock, chatId, player1);
    }
    
    // Show help
    return this.showHelp(m, sock);
  },
  
  // Create new game
  async newGame(m, sock, chatId, player1, player2) {
    // Check if player is challenging themselves
    if (player1 === player2) {
      return sock.sendMessage(chatId, { 
        text: "🚫 You can't challenge yourself! Mention another player."
      });
    }
    
    // Check existing game
    if (GAME_STATES[chatId]) {
      return sock.sendMessage(chatId, {
        text: `🎮 Game already in progress!\nType \`.ttt status\` to view`
      });
    }
    
    // Initialize game
    GAME_STATES[chatId] = {
      board: Array(9).fill(SYMBOLS.EMPTY),
      players: [player1, player2],
      currentPlayer: 0,
      moves: 0,
      started: Date.now()
    };
    
    // Save game state
    this.saveGameState();
    
    // Send game board
    await sock.sendMessage(chatId, {
      text: this.generateBoardText(chatId) + 
            `\n\n🎮 *${this.getPlayerName(player1)}* vs *${this.getPlayerName(player2)}*\n` +
            `❌ ${this.getPlayerName(player1)}\n⭕ ${this.getPlayerName(player2)}\n\n` +
            `🔹 *${this.getCurrentPlayerName(chatId)}* starts first!\n` +
            `📌 Use \`.ttt <1-9>\` to play\n` +
            `💢 Quit with \`.ttt quit\``,
      contextInfo: {
        externalAdReply: {
          title: "❌⭕ TIC TAC TOE",
          body: "Challenge accepted!",
          thumbnailUrl: GAME_BANNER,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: GAME_SOURCE
        }
      }
    });
    
    // Send move grid
    await sock.sendMessage(chatId, {
      text: "🔢 *MOVE GRID REFERENCE*\n" +
            "1️⃣ 2️⃣ 3️⃣\n" +
            "4️⃣ 5️⃣ 6️⃣\n" +
            "7️⃣ 8️⃣ 9️⃣\n\n" +
            "Example: \`.ttt 5\` for center"
    });
  },
  
  // Player makes a move
  async makeMove(m, sock, chatId, player, move) {
    const game = GAME_STATES[chatId];
    if (!game) {
      return sock.sendMessage(chatId, {
        text: "🚫 No active game! Start with `.ttt @player`"
      });
    }
    
    // Validate move
    if (move < 1 || move > 9) {
      return sock.sendMessage(chatId, {
        text: "❌ Invalid move! Choose 1-9"
      });
    }
    
    // Check player turn
    const playerIndex = game.players.indexOf(player);
    if (playerIndex !== game.currentPlayer) {
      return sock.sendMessage(chatId, {
        text: `⏳ It's ${this.getCurrentPlayerName(chatId)}'s turn!`
      });
    }
    
    // Check position availability
    const pos = move - 1;
    if (game.board[pos] !== SYMBOLS.EMPTY) {
      return sock.sendMessage(chatId, {
        text: "🚫 Position already taken!"
      });
    }
    
    // Make move
    const symbol = game.currentPlayer === 0 ? SYMBOLS.PLAYER_X : SYMBOLS.PLAYER_O;
    game.board[pos] = symbol;
    game.moves++;
    
    // Check winner
    const winner = this.checkWinner(game.board);
    if (winner !== null) {
      return this.endGame(m, sock, chatId, winner);
    }
    
    // Check draw
    if (game.moves === 9) {
      return this.endGame(m, sock, chatId, null);
    }
    
    // Switch player
    game.currentPlayer = game.currentPlayer === 0 ? 1 : 0;
    this.saveGameState();
    
    // Send updated board
    await sock.sendMessage(chatId, {
      text: this.generateBoardText(chatId) + 
            `\n\n✅ *${this.getPlayerName(player)}* played at position ${move}\n` +
            `🔹 Next: ${this.getCurrentPlayerName(chatId)}'s turn (${game.currentPlayer === 0 ? '❌' : '⭕'})`
    });
  },
  
  // Show game status
  async gameStatus(m, sock, chatId) {
    const game = GAME_STATES[chatId];
    if (!game) {
      return sock.sendMessage(chatId, {
        text: "🚫 No active game! Start with `.ttt @player`"
      });
    }
    
    await sock.sendMessage(chatId, {
      text: this.generateBoardText(chatId) + 
            `\n\n🎮 *Game Status*\n` +
            `❌ ${this.getPlayerName(game.players[0])}\n` +
            `⭕ ${this.getPlayerName(game.players[1])}\n` +
            `🔹 Current turn: ${this.getCurrentPlayerName(chatId)} (${game.currentPlayer === 0 ? '❌' : '⭕'})\n` +
            `⏱️ Moves: ${game.moves}/9\n` +
            `📌 Use \`.ttt <1-9>\` to play`
    });
  },
  
  // Player forfeits
  async forfeitGame(m, sock, chatId, player) {
    const game = GAME_STATES[chatId];
    if (!game) {
      return sock.sendMessage(chatId, {
        text: "🚫 No active game to quit!"
      });
    }
    
    const winnerIndex = game.players.indexOf(player) === 0 ? 1 : 0;
    await sock.sendMessage(chatId, {
      text: `🏳️ *${this.getPlayerName(player)} forfeited!*\n` +
            `🎉 Winner: ${this.getPlayerName(game.players[winnerIndex])}`
    });
    
    delete GAME_STATES[chatId];
    this.saveGameState();
  },
  
  // End game and announce result
  async endGame(m, sock, chatId, winnerIndex) {
    const game = GAME_STATES[chatId];
    let resultText;
    
    if (winnerIndex !== null) {
      const winnerSymbol = winnerIndex === 0 ? SYMBOLS.PLAYER_X : SYMBOLS.PLAYER_O;
      resultText = `🎉 *${this.getPlayerName(game.players[winnerIndex])} WINS!* ${winnerSymbol}`;
    } else {
      resultText = "🤝 *DRAW!* No winner this time";
    }
    
    await sock.sendMessage(chatId, {
      text: this.generateBoardText(chatId) + `\n\n${resultText}\n⏱️ Total moves: ${game.moves}`
    });
    
    delete GAME_STATES[chatId];
    this.saveGameState();
  },
  
  // Show help
  async showHelp(m, sock) {
    await sock.sendMessage(m.chat, {
      text: `❌⭕ *TIC TAC TOE COMMANDS*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🆕 *Start Game:* 
┃    \`.ttt @player\`
┃  
┃  🎮 *Make Move:* 
┃    \`.ttt <1-9>\` (see grid below)
┃  
┃  📊 *Game Status:* 
┃    \`.ttt status\`
┃  
┃  🏳️ *Quit Game:* 
┃    \`.ttt quit\`
┃  
┃  🔢 *Move Grid:*
┃    1️⃣ 2️⃣ 3️⃣
┃    4️⃣ 5️⃣ 6️⃣
┃    7️⃣ 8️⃣ 9️⃣
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
📌 Example: \`.ttt 5\` plays center`,
      contextInfo: {
        externalAdReply: {
          title: "🎮 TIC TAC TOE GUIDE",
          body: "Beat your friends!",
          thumbnailUrl: GAME_BANNER,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: GAME_SOURCE
        }
      }
    });
  },
  
  // Utility functions
  generateBoardText(chatId) {
    const game = GAME_STATES[chatId];
    if (!game) return "🚫 No active game";
    
    const board = game.board;
    return `🎮 *TIC TAC TOE*\n` +
           `${board[0]} ${board[1]} ${board[2]}\n` +
           `${board[3]} ${board[4]} ${board[5]}\n` +
           `${board[6]} ${board[7]} ${board[8]}`;
  },
  
  getPlayerName(jid) {
    return jid.split("@")[0];
  },
  
  getCurrentPlayerName(chatId) {
    const game = GAME_STATES[chatId];
    return this.getPlayerName(game.players[game.currentPlayer]);
  },
  
  checkWinner(board) {
    // All winning combinations
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    // Check for winner
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] !== SYMBOLS.EMPTY && 
          board[a] === board[b] && 
          board[a] === board[c]) {
        // Return player index (0 for X, 1 for O)
        return board[a] === SYMBOLS.PLAYER_X ? 0 : 1;
      }
    }
    
    // No winner
    return null;
  },
  
  saveGameState() {
    fs.writeFileSync(gameStatePath, JSON.stringify(GAME_STATES, null, 2));
  }
};