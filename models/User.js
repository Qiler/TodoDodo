const db = require("../modules/db");
const UserRepo = require("../repos/UserRepository");
const users = new UserRepo(db);
const NoteRepo = require("../repos/NoteRepository");
const notes = new NoteRepo(db);
const Note = require("../models/Note");
const fs = require("fs");
const defaultAvatar = fs.readFileSync("./public/images/default-avatar.png", "base64");

class User {
  constructor(user) {
    this.username = user?.username;
    this.email = user?.email;
    this.password = user?.password;
    this.uid = user?.uid;
    this.creationDate = new Date(user?.creationDate);
    this.lastLogin = new Date(user?.lastLogin);
    this.active = user?.active;
    this.avatar = user?.avatar ? user.avatar : defaultAvatar;
    this.points = user?.points;
  }

  async GetNotes() {
    const noteDb = await notes.GetByUid(this.uid);
    let noteArray = [];
    noteDb?.forEach((note) => {
      noteArray.push(new Note(note));
    });
    return noteArray;
  }

  async CreateNote(name, color = "#feff9c") {
    return await notes.AddNote(this.uid, name, color);
  }

  async UpdateEmail(email){
    this.email = email;
    return await users.UpdateEmail(this.uid,email);
  }

  async UpdatePassword(password){
    this.password = password;
    return await users.UpdatePassword(this.uid,password);
  }

  async UpdateAvatar(avatar){
    this.avatar = avatar;
    return await users.UpdateAvatar(this.uid,avatar);
  }
}

module.exports = User;
