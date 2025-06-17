function parseMessage(message, prefixList = ['.', '/', '#', '!', '💥', '➤']) {
  const body = message?.message?.conversation ||
    message?.message?.extendedTextMessage?.text ||
    "";
  
  const prefix = prefixList.find(p => body.startsWith(p)) || "";
  const raw = body.slice(prefix.length).trim();
  const [cmd, ...args] = raw.split(/\s+/);
  
  return {
    body,
    prefix,
    cmd: cmd?.toLowerCase(),
    args,
    text: args.join(" "),
    isCommand: Boolean(cmd),
  };
}

module.exports = parseMessage;