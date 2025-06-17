/*************************************************
 🔐 SUGAR DADDY - SESSION ENGINE v1.0
 Secure WhatsApp Multi-File Auth System
 Owner: ALPHA-BLAKE
**************************************************/

const { useMultiFileAuthState, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");

// === CONFIG ===
const SESSION_DIR = path.resolve(__dirname); // "./sessions"
const logger = pino({ level: "silent" });

/**
 * 📦 Initializes Multi-File Auth Session
 * This is used to securely manage and persist WhatsApp login state.
 */
async function initSession() {
  try {
    // Load multi-file auth state from ./sessions folder
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
    
    // Build authentication object for socket
    const auth = {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger)
    };
    
    return { auth, saveCreds };
  } catch (error) {
    console.error("[SESSION] ❌ Failed to load session state:", error.message);
    throw error;
  }
}

module.exports = { initSession };