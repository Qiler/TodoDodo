const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "../", "todododo.db"), sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
  console.log("DB Loaded");
});

db.queryAsync = function (sql, params) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.all(sql, params, function (err, rows) {
      if (err) reject(err);
      else resolve({ rows: rows });
    });
  });
};

db.runAsync = function (sql, params) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.run(sql, params, function (err, rows) {
      if (err) reject(err);
      else resolve({ rows: rows });
    });
  });
};

//USERS
let sql = `CREATE TABLE IF NOT EXISTS users (
    uid          INTEGER PRIMARY KEY,
    username     STRING  UNIQUE
                         NOT NULL,
    email        STRING  UNIQUE
                         NOT NULL,
    password     STRING  NOT NULL,
    creationDate DATETIME DEFAULT SYSUTCDATETIME,
    lastLogin    DATETIME DEFAULT SYSUTCDATETIME,
    active       BOOLEAN DEFAULT (true),
    avatar       STRING,
    points       INTEGER DEFAULT (0)
);`;
db.run(sql);

//NOTES
sql = `CREATE TABLE IF NOT EXISTS notes (
    nid                  PRIMARY KEY
                         NOT NULL,
    owner                REFERENCES users (uid) 
                         NOT NULL,
    crationDate DATETIME DEFAULT SYSUTCDATETIME,
    name        STRING,
    color       STRING   DEFAULT ('#feff9c') 
);`;
db.run(sql);

//TASKS
sql = `CREATE TABLE IF NOT EXISTS tasks (
    tid                   PRIMARY KEY,
    nid                   REFERENCES notes (nid) 
                          NOT NULL,
    creationDate DATETIME DEFAULT SYSUTCDATETIME,
    dueDate      DATETIME,
    finishedDate DATETIME,
    checked      BOOLEAN,
    checkedBy             REFERENCES users (uid),
    description  STRING,
    importance   INTEGER  DEFAULT (1),
    color        STRING   NOT NULL
                          DEFAULT ('#002b59'),
    [order]      INTEGER
);`;
db.run(sql);

//USER NOTES
sql = `CREATE TABLE IF NOT EXISTS userNotes (
    nid                REFERENCES notes (nid) 
                       NOT NULL,
    uid                REFERENCES users (uid),
    editPerm     BOOLEAN  DEFAULT (false),
    deletePerm   BOOLEAN  DEFAULT (false),
    taskPerm     BOOLEAN  DEFAULT (false),
    sharePerm    BOOLEAN  DEFAULT (false),
);`;
db.run(sql);

module.exports = db;
