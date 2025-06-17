// web/pair.js
const express = require('express');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} = require('@whiskeysockets/baileys');

const fs = require('fs');
const path = require('path');
const pino = require('pino');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static('public'));

const SESSION_DIR = './session';

// SOCKET FOR LIVE QR STREAM
io.on('connection', async (socket) => {
  console.log('[SOCKET] Client connected.');
  
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
  const { version } = await fetchLatestBaileysVersion();
  
  const sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
    },
    printQRInTerminal: false,
    browser: ["SUGAR-DADDY", "Chrome", "1.0"],
    syncFullHistory: false,
  });
  
  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update;
    
    if (qr) {
      console.log("[QR] New QR generated");
      socket.emit("qr", qr);
    }
    
    if (connection === "open") {
      console.log("[CONNECTED] Bot is connected.");
      socket.emit("connected", "Bot paired successfully!");
    }
  });
  
  sock.ev.on("creds.update", saveCreds);
});

// START SERVER
server.listen(PORT, () => {
  console.log(`🔗 QR Pairing Server started on http://localhost:${PORT}`);
});