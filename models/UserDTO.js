const db = require("../modules/db");
const UserRepo = require("../repos/UserRepository");
const users = new UserRepo(db);
const NoteRepo = require("../repos/NoteRepository");
const notes = new NoteRepo(db);
const Note = require("./Note");
const User = require("./User");
const fs = require("fs");
const defaultAvatar = fs.readFileSync("./public/images/default-avatar.png", "base64");

class UserDto extends User {
  constructor(user) {
    super(user);
    this.username = undefined;
    this.uid = undefined;
    this.creationDate = undefined;
    this.lastLogin = undefined;
    this.active = undefined;
    this.avatar = undefined;
    this.points = undefined;
  }

  async GetNotes() {
    try {
      const noteDb = await notes.GetByUid(this.uid);
      let noteArray = [];
      noteDb?.forEach((note) => {
        noteArray.push(new Note(note));
      });
      return noteArray;
    } catch {
      return null;
    }
  }

  async CreateNote(name, color = "#feff9c") {
    try {
      return await notes.AddNote(this.uid, name, color);
    } catch {
      return null;
    }
  }

  async FindByName(name) {
    let user = await users.GetByUsername(name);
    this.username = user?.username;
    this.uid = user?.uid;
    this.creationDate = new Date(user?.creationDate);
    this.lastLogin = new Date(user?.lastLogin);
    this.active = user?.active;
    this.avatar = user?.avatar ? user.avatar : defaultAvatar;
    this.points = user?.points;
  }

  async FindByID(uid) {
    let user = await users.GetByUid(uid);
    this.username = user?.username;
    this.uid = user?.uid;
    this.creationDate = new Date(user?.creationDate);
    this.lastLogin = new Date(user?.lastLogin);
    this.active = user?.active;
    this.avatar = user?.avatar ? user.avatar : defaultAvatar;
    this.points = user?.points;
  }
}

module.exports = UserDto;
