const pluginLoader = require("./pluginLoader");
const parseMessage = require("./messageParser");

const plugins = pluginLoader();

module.exports = async function handleCommand(sock, m) {
  const { prefix, cmd, args, text, isCommand } = parseMessage(m);
  
  if (!isCommand) return;
  
  const command = plugins.find(p =>
    p.name === cmd || (p.alias && p.alias.includes(cmd))
  );
  
  if (!command) {
    return sock.sendMessage(m.chat, {
      text: `❓ Unknown command: *${cmd}*`,
    });
  }
  
  try {
    await command.exec(m, {
      sock,
      args,
      text,
      command: cmd,
      prefix,
      isGroup: m.key.remoteJid.endsWith("@g.us"),
      sender: m.key.participant || m.key.remoteJid,
    });
  } catch (err) {
    console.error("[COMMAND ERROR]", err);
    await sock.sendMessage(m.chat, {
      text: `❌ *Command Failed: ${cmd}*`,
    });
  }
};