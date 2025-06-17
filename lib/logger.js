const chalk = require("chalk");

module.exports = {
  info: (text) => console.log(chalk.blue("[INFO]"), text),
  warn: (text) => console.log(chalk.yellow("[WARN]"), text),
  error: (text) => console.log(chalk.red("[ERROR]"), text),
  success: (text) => console.log(chalk.green("[SUCCESS]"), text),
};