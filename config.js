module.exports = {
  // === Owner Settings ===
  ownerNumbers: ['254780931677', '263784812740'],
  ownerName: 'ALPHA-BLAKE',
  ownerChannel: 'https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24',
  
  // === Bot Identity ===
  botName: 'SUGAR DADDY',
  botFooter: 'Powered by ALPHA-BLAKE',
  botImage: 'https://i.ibb.co/4RfnHtVr/SulaMd.jpg',
  botSound: 'https://files.catbox.moe/cebgdf.mp3',
  
  // === Premium Users ===
  premiumUsers: ['263784812740', '254780931677'],
  
  // === Command Prefix ===
  prefixes: ['', '!', '.', '/', '#', '🧠'], // Accepts any of these
  
  // === Session Settings ===
  sessionFolder: './session',
  authFile: './sessions/blake-auth.json',
  
  // === Web Interface ===
  qrSite: 'http://localhost:5000/qr.html',
  telegramSupport: 'https://t.me/lpg1_tech',
  
  // === Functional Flags ===
  autoReact: true,
  autoTyping: true,
  publicMode: true, // false = private only
  callBlock: true, // anticall
  
  // === Default Messages ===
  messages: {
    wait: '*⏳ Please wait...*',
    error: '*❌ An error occurred*',
    success: '*✅ Done!*',
    ownerOnly: '*🚫 Only the owner can use this command*',
    groupOnly: '*👥 This command is for groups only*',
    privateOnly: '*🔒 This command is for private chats only*',
  },
  
  // === Logging and Debug ===
  logEvents: true, // true = print logs to terminal
  debug: false
};