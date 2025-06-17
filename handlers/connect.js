const handleCommand = require("./handlers/commandHandler");

sock.ev.on("messages.upsert", async ({ messages }) => {
  const m = messages[0];
  if (!m.message || m.key.fromMe) return;
  
  await handleCommand(sock, m);
});