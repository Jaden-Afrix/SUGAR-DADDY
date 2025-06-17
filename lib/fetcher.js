const axios = require("axios");

module.exports = async function fetchJson(url, options = {}) {
  try {
    const res = await axios.get(url, options);
    return res.data;
  } catch (err) {
    return { error: true, message: err.message };
  }
};