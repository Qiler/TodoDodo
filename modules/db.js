const sqlite3 = require("sqlite3").verbose();

db = new sqlite3.Database("./todododo.db");

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

db.serialize(async function () {
  await db.runAsync("PRAGMA foreign_keys = ON");
  //USERS
  await db.runAsync(`CREATE TABLE IF NOT EXISTS users (
    uid          INTEGER PRIMARY KEY ON CONFLICT IGNORE AUTOINCREMENT,
    username     STRING  UNIQUE
                         NOT NULL
                         COLLATE NOCASE,
    email        STRING  UNIQUE
                         NOT NULL
                         COLLATE NOCASE,
    password     STRING  NOT NULL,
    creationDate INTEGER DEFAULT ((strftime('%s')+(strftime('%f')-strftime('%S')))*1000),
    lastLogin    INTEGER DEFAULT ((strftime('%s')+(strftime('%f')-strftime('%S')))*1000),
    active       BOOLEAN DEFAULT (true),
    avatar       STRING,
    points       INTEGER DEFAULT (0) 
);
`);

  //NOTES
  await db.runAsync(`CREATE TABLE IF NOT EXISTS notes (
    nid          INTEGER PRIMARY KEY ON CONFLICT IGNORE AUTOINCREMENT,
    owner                REFERENCES users (uid) ON DELETE CASCADE
                         NOT NULL,
    creationDate INTEGER DEFAULT ((strftime('%s')+(strftime('%f')-strftime('%S')))*1000),
    name         STRING,
    color        STRING  DEFAULT ('#feff9c') 
);
`);

  //TASKS
  await db.runAsync(`CREATE TABLE IF NOT EXISTS tasks (
    tid          INTEGER PRIMARY KEY ON CONFLICT IGNORE AUTOINCREMENT,
    nid                  REFERENCES notes (nid) ON DELETE CASCADE
                         NOT NULL,
    creationDate INTEGER DEFAULT ((strftime('%s')+(strftime('%f')-strftime('%S')))*1000),
    dueDate      INTEGER,
    finishedDate INTEGER,
    checked      BOOLEAN,
    checkedBy    INTEGER REFERENCES users (uid) ON DELETE NO ACTION,
    description  STRING
);
`);

  //USER NOTES
  await db.runAsync(`CREATE TABLE IF NOT EXISTS userNotes (
    link    STRING  PRIMARY KEY ON CONFLICT IGNORE,
    nid             REFERENCES notes (nid) ON DELETE CASCADE
                    NOT NULL,
    uid             REFERENCES users (uid) ON DELETE CASCADE
                    NOT NULL,
    isOwner BOOLEAN DEFAULT (false) 
);
`);
});

module.exports = db;
