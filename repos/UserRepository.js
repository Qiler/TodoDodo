const ApiException = require("../exceptions/ApiException");

class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async GetAll() {
    try {
      const result = await this.db.queryAsync("SELECT * FROM users", []);
      return result?.rows;
    } catch (ex) {
      throw new ApiException(`Unable to get all users from database.`, ex);
    }
  }

  async GetByUsername(username) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
      if (result && result.rows && result.rows[0]) {
        return result.rows[0];
      }
      return null;
    } catch (ex) {
      throw new ApiException(`Unable to get user with name: ${username}`, ex);
    }
  }

  async GetByUid(uid) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM users WHERE uid = ? LIMIT 1", [uid]);
      if (result && result.rows && result.rows[0]) {
        return result.rows[0];
      }
      return null;
    } catch (ex) {
      throw new ApiException(`Unable to get user with id: ${uid}`, ex);
    }
  }

  async GetByEmail(email) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
      if (result && result.rows && result.rows[0]) {
        throw new ApiException(`Unable to get user with email: ${email}`, ex);
      }
      return null;
    } catch (ex) {
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
    } catch (ex) {
      throw new ApiException(`Unable to get user that has access to note: ${nid}`, ex);
    }
  }

  async AddUser(username, email, password) {
    try {
      const result = await this.db.queryAsync("INSERT INTO users (username,email,password) VALUES (?,?,?) RETURNING uid", [username, email, password]);
      if (result && result.rows && result.rows[0]) {
        return result.rows[0];
      }
      return null;
    } catch (ex) {
      throw new ApiException(`Unable to add user with username: ${username}`, ex);
    }
  }

  async DeleteUser(uid) {
    try {
      return await this.db.runAsync("DELETE FROM users WHERE uid = ?", [uid]);
    } catch (ex) {
      throw new ApiException(`Unable to delete user: ${uid}`, ex);
    }
  }

  async UpdateUsername(uid, username) {
    try {
      return await this.db.runAsync("UPDATE users SET usename = ? WHERE uid = ?", [username, uid]);
    } catch (ex) {
      throw new ApiException(`Unable to update username for user: ${uid}`, ex);
    }
  }

  async UpdateEmail(uid, email) {
    try {
      return await this.db.runAsync("UPDATE users SET email = ? WHERE uid = ?", [email, uid]);
    } catch (ex) {
      throw new ApiException(`Unable to update email for user: ${uid}`, ex);
    }
  }

  async UpdatePassword(uid, password) {
    try {
      return await this.db.runAsync("UPDATE users SET password = ? WHERE uid = ?", [password, uid]);
    } catch (ex) {
      throw new ApiException(`Unable to update password for user: ${uid}`, ex);
    }
  }

  async UpdateLastLogin(uid, date) {
    try {
      return await this.db.runAsync("UPDATE users SET lastLogin = ? WHERE uid = ?", [date, uid]);
    } catch (ex) {
      return null;
    }
  }

  async UpdateActive(uid, active) {
    try {
      return await this.db.runAsync("UPDATE users SET active = ? WHERE uid = ?", [active, uid]);
    } catch (ex) {
      throw new ApiException(`Unable to update activity state for user: ${uid}`, ex);
    }
  }

  async UpdateAvatar(uid, avatar) {
    try {
      return await this.db.runAsync("UPDATE users SET avatar = ? WHERE uid = ?", [avatar, uid]);
    } catch (ex) {
      throw new ApiException(`Unable to update avatar for user: ${uid}`, ex);
    }
  }

  async UpdatePoints(uid, points) {
    try {
      return await this.db.runAsync("UPDATE users SET points = ? WHERE uid = ?", [points, uid]);
    } catch (ex) {
      throw new ApiException(`Unable to update points for user: ${uid}`, ex);
    }
  }
}

module.exports = UserRepository;
