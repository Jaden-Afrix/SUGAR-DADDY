const cooldowns = new Map();

module.exports = function isSpamming(id, time = 5000) {
  if (cooldowns.has(id)) {
    const last = cooldowns.get(id);
    if (Date.now() - last < time) return true;
  }
  cooldowns.set(id, Date.now());
  return false;
};