class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async GetAll() {
    try {
      const result = await this.db.queryAsync("SELECT * FROM users", []);
      return result?.rows;
    } catch {
      return null;
    }
  }

  async GetByUsername(username) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
      if (result && result.rows && result.rows[0]) {
        return result.rows[0];
      }
      return null;
    } catch {
      return null;
    }
  }

  async GetByUid(uid) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM users WHERE uid = ? LIMIT 1", [uid]);
      if (result && result.rows && result.rows[0]) {
        return result.rows[0];
      }
      return null;
    } catch {
      return null;
    }
  }

  async GetByEmail(email) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
      if (result && result.rows && result.rows[0]) {
        return result.rows[0];
      }
      return null;
    } catch {
      return null;
    }
  }

  async GetByNoteAccess(nid) {
    try {
      const result = await this.db.queryAsync(
        `SELECT * FROM users 
                LEFT JOIN userNotes ON users.uid = userNotes.uid
                WHERE userNotes.nid = ? AND userNotes.isOwner = false;`,
        [nid]
      );
      return result?.rows;
    } catch {
      return null;
    }
  }

  async AddUser(username, email, password) {
    try {
      const result = await this.db.queryAsync("INSERT INTO users (username,email,password) VALUES (?,?,?) RETURNING uid", [username, email, password]);
      if (result && result.rows && result.rows[0]) {
        return result.rows[0];
      }
      return null;
    } catch {
      return null;
    }
  }

  async DeleteUser(uid) {
    try {
      return await this.db.runAsync("DELETE FROM users WHERE uid = ?", [uid]);
    } catch {
      return null;
    }
  }

  async UpdateUsername(uid, username) {
    try {
      return await this.db.runAsync("UPDATE users SET usename = ? WHERE uid = ?", [username, uid]);
    } catch {
      return null;
    }
  }

  async UpdateEmail(uid, email) {
    try {
      return await this.db.runAsync("UPDATE users SET email = ? WHERE uid = ?", [email, uid]);
    } catch {
      return null;
    }
  }

  async UpdatePassword(uid, password) {
    try {
      return await this.db.runAsync("UPDATE users SET password = ? WHERE uid = ?", [password, uid]);
    } catch {
      return null;
    }
  }

  async UpdateLastLogin(uid, date) {
    try {
      return await this.db.runAsync("UPDATE users SET lastLogin = ? WHERE uid = ?", [date, uid]);
    } catch {
      return null;
    }
  }

  async UpdateActive(uid, active) {
    try {
      return await this.db.runAsync("UPDATE users SET active = ? WHERE uid = ?", [active, uid]);
    } catch {
      return null;
    }
  }

  async UpdateAvatar(uid, avatar) {
    try {
      return await this.db.runAsync("UPDATE users SET avatar = ? WHERE uid = ?", [avatar, uid]);
    } catch {
      return null;
    }
  }

  async UpdatePoints(uid, points) {
    try {
      return await this.db.runAsync("UPDATE users SET points = ? WHERE uid = ?", [points, uid]);
    } catch {
      return null;
    }
  }
}

module.exports = UserRepository;
