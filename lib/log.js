const chalk = require("chalk");
const moment = require("moment");

// Timestamp formatter
const time = () => chalk.gray(`[${moment().format("HH:mm:ss")}]`);

const log = {
  info: (label, message) => {
    console.log(`${time()} ${chalk.blueBright(`[INFO]`)} ${chalk.cyan(label)} ➤ ${message}`);
  },
  
  success: (label, message) => {
    console.log(`${time()} ${chalk.greenBright(`[SUCCESS]`)} ${chalk.cyan(label)} ➤ ${message}`);
  },
  
  warn: (label, message) => {
    console.log(`${time()} ${chalk.yellowBright(`[WARN]`)} ${chalk.cyan(label)} ➤ ${message}`);
  },
  
  error: (label, message) => {
    console.log(`${time()} ${chalk.redBright(`[ERROR]`)} ${chalk.cyan(label)} ➤ ${message}`);
  },
  
  event: (label, message) => {
    console.log(`${time()} ${chalk.magentaBright(`[EVENT]`)} ${chalk.cyan(label)} ➤ ${message}`);
  },
  
  custom: (type, label, message) => {
    console.log(`${time()} ${chalk.bold(`[${type.toUpperCase()}]`)} ${chalk.cyan(label)} ➤ ${message}`);
  },
};

module.exports = log;