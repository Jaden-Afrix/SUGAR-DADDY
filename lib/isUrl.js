module.exports = function isUrl(text) {
  return /https?:\/\/[^\s]+/.test(text);
};