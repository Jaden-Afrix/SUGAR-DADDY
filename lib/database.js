const fs = require("fs");

let db = {
  users: {},
  settings: {},
};

module.exports = {
  get: () => db,
  save: () => fs.writeFileSync("./database.json", JSON.stringify(db, null, 2)),
  load: () => {
    if (fs.existsSync("./database.json")) {
      db = JSON.parse(fs.readFileSync("./database.json"));
    }
  },
};