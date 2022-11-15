class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async GetAll() {
    return await this.db.queryAsync("SELECT * FROM users", []);
  }

  async GetByUsername(username) {
    return await this.db.queryAsync("SELECT * FROM users WHERE username = ?", [username]);
  }

  async GetByUid(uid) {
    return await this.db.queryAsync("SELECT * FROM users WHERE uid = ?", [uid]);
  }

  async GetByEmail(email) {
    return await this.db.queryAsync("SELECT * FROM users WHERE email = ?", [email]);
  }

  async AddUser(username, email, password) {
    return await this.db.runAsync("INSERT INTO users (username,email,password) VALUES (?,?,?)", [username, email, password]);
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
