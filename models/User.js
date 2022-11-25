const db = require("../modules/db");
const NoteRepo = require("../repos/NoteRepository");
const notes = new NoteRepo(db);
const Note = require("../models/Note");

class User {
  constructor(user) {
    this.username = user?.username;
    this.email = user?.email;
    this.password = user?.password;
    this.uid = user?.uid;
    this.creationDate = new Date(user?.creationDate);
    this.lastLogin = new Date(user?.lastLogin);
    this.active = user?.active;
    this.avatar = user?.avatar;
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
}

module.exports = User;
