class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async GetAll() {
    const result = await this.db.queryAsync("SELECT * FROM users", []);
    return result?.rows;
  }

  async GetByUsername(username) {
    const result = await this.db.queryAsync("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
    if (result && result.rows && result.rows[0]) {
      return result.rows[0];
    }
    return null;
  }

  async GetByUid(uid) {
    const result = await this.db.queryAsync("SELECT * FROM users WHERE uid = ? LIMIT 1", [uid]);
    if (result && result.rows && result.rows[0]) {
      return result.rows[0];
    }
    return null;
  }

  async GetByEmail(email) {
    const result = await this.db.queryAsync("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    if (result && result.rows && result.rows[0]) {
      return result.rows[0];
    }
    return null;
  }

  async AddUser(username, email, password) {
    const result = await this.db.queryAsync("INSERT INTO users (username,email,password) VALUES (?,?,?) RETURNING uid", [username, email, password]);
    if (result && result.rows && result.rows[0]) {
      return result.rows[0];
    }
    return null;
  }

  async DeleteUser(uid) {
    return await this.db.runAsync("DELETE FROM users WHERE uid = ?", [uid]);
  }

  async UpdateUsername(uid, username) {
    return await this.db.runAsync("UPDATE users SET usename = ? WHERE uid = ?", [username, uid]);
  }

  async UpdateEmail(uid, email) {
    return await this.db.runAsync("UPDATE users SET email = ? WHERE uid = ?", [email, uid]);
  }

  async UpdatePassword(uid, password) {
    return await this.db.runAsync("UPDATE users SET password = ? WHERE uid = ?", [password, uid]);
  }

  async UpdateLastLogin(uid, date) {
    return await this.db.runAsync("UPDATE users SET lastLogin = ? WHERE uid = ?", [date, uid]);
  }

  async UpdateActive(uid, active) {
    return await this.db.runAsync("UPDATE users SET active = ? WHERE uid = ?", [active, uid]);
  }

  async UpdateAvatar(uid, avatar) {
    return await this.db.runAsync("UPDATE users SET avatar = ? WHERE uid = ?", [avatar, uid]);
  }

  async UpdatePoints(uid, points) {
    return await this.db.runAsync("UPDATE users SET points = ? WHERE uid = ?", [points, uid]);
  }
}

module.exports = UserRepository;
