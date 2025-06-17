const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');

// Web pairing UI setup
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));

let sock;

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`Using Baileys v${version.join('.')}, Latest: ${isLatest}`);
  
  sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: 'silent' }),
    browser: ['SUGAR-DADDY', 'Safari', '1.0.0']
  });
  
  // Event: QR Code
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      io.emit('qr', qr);
      qrcode.generate(qr, { small: true });
    }
    
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log('🔴 Session logged out. Restarting...');
        startBot();
      } else {
        console.log('🔁 Connection closed. Reconnecting...');
        startBot();
      }
    }
    
    if (connection === 'open') {
      console.log('✅ Connected to WhatsApp');
      io.emit('connected', '🟢 WhatsApp Paired Successfully!');
    }
  });
  
  // Save credentials
  sock.ev.on('creds.update', saveCreds);
  
  // Message handling
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    const msg = messages[0];
    if (!msg?.message || msg.key.fromMe) return;
    
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const text = msg.message.conversation || msg.message?.extendedTextMessage?.text || "";
    
    console.log(`[MSG] ${from}: ${text}`);
    
    // Example commands
    if (text.toLowerCase().startsWith("ping")) {
      await sock.sendMessage(from, { text: "*PONG* 🛰️\n_Connection Stable!_" }, { quoted: msg });
    }
    
    if (text.toLowerCase().startsWith("owner")) {
      await sock.sendMessage(from, {
        text: "*Owner Info*\n\n📞 *Jaden Afrix*\n📍 +263784812740\n\n🔗 Channel: https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24",
        footer: "Powered by ALPHA-BLAKE",
        buttons: [
          { buttonId: "owner", buttonText: { displayText: "Contact Owner" }, type: 1 },
        ],
        headerType: 1,
      }, { quoted: msg });
    }
    
    // You can add full command routing to handler here
    // require("./messageHandler")(sock, msg);
  });
}

// Start bot
startBot();

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/qr.html`);
});