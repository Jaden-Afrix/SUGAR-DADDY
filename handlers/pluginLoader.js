const fs = require("fs");
const path = require("path");

const PLUGIN_PATH = path.join(__dirname, "../plugins");

function loadPlugins() {
  const plugins = [];
  
  fs.readdirSync(PLUGIN_PATH).forEach((file) => {
    const fullPath = path.join(PLUGIN_PATH, file);
    if (file.endsWith(".js")) {
      try {
        const plugin = require(fullPath);
        if (plugin?.name) {
          plugins.push(plugin);
        }
      } catch (err) {
        console.error(`[PLUGIN ERROR] Failed to load ${file}:`, err);
      }
    }
  });
  
  return plugins;
}

module.exports = loadPlugins;