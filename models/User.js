const db = require("../modules/db");

class User {
  constructor(user) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.uid = user.uid;
    this.creationDate = user.creationDate;
    this.lastLogin = user.lastLogin;
    this.active = user.active;
    this.avatar = user.avatar;
    this.points = user.points;
  }
}

module.exports = User;
//TODO add functionality to user class to implement database
