const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
//initDB();

const db = new sqlite3.Database("./todododo.db", sqlite3.OPEN_READWRITE, (err) => {
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

async function initDB() {
  await fs.open("todododo.db", "w", (err, fd) => {
    if (err) console.error(err);
    if (fd != null) fs.close(fd);
  });

  //USERS
  await db.runAsync(`CREATE TABLE IF NOT EXISTS users (
    uid          INTEGER PRIMARY KEY
                         AUTOINCREMENT,
    username     STRING  UNIQUE
                         NOT NULL,
    email        STRING  UNIQUE
                         NOT NULL,
    password     STRING  NOT NULL,
    creationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastLogin    DATETIME DEFAULT CURRENT_TIMESTAMP,
    active       BOOLEAN DEFAULT (true),
    avatar       STRING,
    points       INTEGER DEFAULT (0)
  );`);

  //NOTES
  await db.runAsync(`CREATE TABLE IF NOT EXISTS notes (
    nid                  PRIMARY KEY
                         AUTOINCREMENT,
    owner                REFERENCES users (uid) 
                         NOT NULL,
    creationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    name         STRING,
    color        STRING   DEFAULT ('#feff9c') 
  );`);

  //TASKS
  await db.runAsync(`CREATE TABLE IF NOT EXISTS tasks (
    tid                   PRIMARY KEY
                          AUTOINCREMENT,
    nid                   REFERENCES notes (nid) 
                          NOT NULL,
    creationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    dueDate      DATETIME,
    finishedDate DATETIME,
    checked      BOOLEAN,
    checkedBy    INTEGER  REFERENCES users (uid) ON DELETE NO ACTION,
    description  STRING,
    importance   INTEGER  DEFAULT (1),
    color        STRING   DEFAULT ('#002b59'),
    [order]      INTEGER
  );`);

  //USER NOTES
  await db.runAsync(`CREATE TABLE IF NOT EXISTS userNotes (
    nid                   REFERENCES notes (nid)
                          NOT NULL,
    uid                   REFERENCES users (uid)
                          NOT NULL,
    editPerm     BOOLEAN  DEFAULT (false),
    deletePerm   BOOLEAN  DEFAULT (false),
    taskPerm     BOOLEAN  DEFAULT (false),
    sharePerm    BOOLEAN  DEFAULT (false)
  );`);
}

module.exports = db;
