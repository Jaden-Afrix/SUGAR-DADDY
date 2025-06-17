const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const fs = require("fs");
const path = require("path");
const { Boom } = require("@hapi/boom");
const chalk = require("chalk");
const figlet = require("figlet");

// === ENHANCED CONFIGURATION ===
const logger = pino({
  level: "silent",
  transport: {
    target: "pino-pretty",
    options: { colorize: true }
  }
});

const SESSION_FOLDER = "./session";
const BOT_NAME = "SUGAR DADDY";
const BOT_VERSION = "v1.0";
const BOT_AUTHOR = "ALPHA-BLAKE";

// === UTILITY FUNCTIONS ===
function createSessionFolder() {
  if (!fs.existsSync(SESSION_FOLDER)) {
    fs.mkdirSync(SESSION_FOLDER);
    console.log(chalk.green(`Created session folder: ${SESSION_FOLDER}`));
  }
}

function clearSession() {
  if (fs.existsSync(SESSION_FOLDER)) {
    fs.rmSync(SESSION_FOLDER, { recursive: true, force: true });
    console.log(chalk.yellow("Cleared previous session data"));
  }
}

// === MAIN CONNECTION FUNCTION ===
async function startBot() {
  // Show impressive ASCII art banner
  console.log(chalk.magenta(figlet.textSync(BOT_NAME, { font: "Standard" })));
  console.log(chalk.blue(`${BOT_NAME} ${BOT_VERSION} | By ${BOT_AUTHOR}\n`));
  
  // Handle session management
  createSessionFolder();
  
  try {
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_FOLDER);
    const { version, isLatest } = await fetchLatestBaileysVersion();
    
    if (!isLatest) {
      console.log(chalk.yellow("⚠️  Using older Baileys version - update recommended"));
    }
    
    const sock = makeWASocket({
      version,
      printQRInTerminal: true,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      logger,
      browser: [BOT_NAME, "Safari", BOT_VERSION],
      syncFullHistory: false,
      getMessage: async () => undefined,
      generateHighQualityLinkPreview: true,
      markOnlineOnConnect: true,
    });
    
    // === ENHANCED EVENT HANDLERS ===
    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr, isNewLogin } = update;
      
      if (isNewLogin) {
        console.log(chalk.green("✨ New login detected! Session updated."));
      }
      
      if (qr) {
        console.log(chalk.cyan("\n💎 SUGAR DADDY BOT QR CODE"));
        console.log(chalk.cyan("🔗 Scan within 60 seconds to connect\n"));
      }
      
      if (connection === "open") {
        console.log(chalk.green("\n✅ CONNECTION ESTABLISHED SUCCESSFULLY"));
        console.log(chalk.green(`🤖 Bot Name: ${BOT_NAME} ${BOT_VERSION}`));
        console.log(chalk.green(`👑 Author: ${BOT_AUTHOR}\n`));
      }
      
      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        
        console.log(chalk.red("\n❌ CONNECTION LOST"));
        console.log(chalk.red(`⚠️ Reason: ${lastDisconnect?.error?.message || "Unknown"}`));
        
        if (statusCode === DisconnectReason.loggedOut) {
          console.log(chalk.yellow("\n🔒 Session expired. Clearing session data..."));
          clearSession();
          console.log(chalk.yellow("🔄 Restart bot to generate new QR code"));
          process.exit(0);
        }
        
        if (shouldReconnect) {
          console.log(chalk.yellow("\n♻️ Attempting reconnect in 5 seconds..."));
          setTimeout(() => startBot(), 5000);
        }
      }
    });
    
    // === CREDENTIALS HANDLER ===
    sock.ev.on("creds.update", saveCreds);
    
    // === MESSAGE HANDLER ===
    sock.ev.on("messages.upsert", async ({ messages }) => {
      const m = messages[0];
      if (!m.message || m.key.fromMe) return;
      
      try {
        require("./messageHandler")(sock, m);
      } catch (error) {
        console.error(chalk.red("🚨 MESSAGE HANDLER ERROR:"), error);
      }
    });
    
    // === CONNECTION STATUS HANDLER ===
    sock.ev.on("connection.update", ({ isOnline, lastDisconnect }) => {
      if (isOnline) {
        console.log(chalk.green("🟢 Online"));
      }
    });
    
    // === GRACEFUL SHUTDOWN HANDLER ===
    process.on("SIGINT", () => {
      console.log(chalk.yellow("\n🛑 Received SIGINT - Gracefully shutting down"));
      sock.end();
      process.exit(0);
    });
    
  } catch (error) {
    console.error(chalk.red("🔥 CRITICAL STARTUP ERROR:"), error);
    console.log(chalk.yellow("♻️ Restarting bot in 10 seconds..."));
    setTimeout(() => startBot(), 10000);
  }
}

// === START THE BOT ===
startBot();