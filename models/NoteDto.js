const db = require("../modules/db");
const UserRepo = require("../repos/UserRepository");
const users = new UserRepo(db);
const NoteRepo = require("../repos/NoteRepository");
const notes = new NoteRepo(db);
const Note = require("../models/Note");

class NoteDto extends Note {
  constructor(note) {
    super(note);
    this.nid = note?.nid;
    this.ownerId = note?.ownerId;
    this.ownersUsername = "Unknown user";
    if (note?.creationDate instanceof Date) {
      this.creationDate = note?.creationDate;
    } else {
      this.creationDate = new Date(note?.creationDate);
    }
    this.name = note?.name;
    this.color = note?.color;
    this.users = [];
  }

  async GetByID(nid) {
    const note = await notes.GetByNid(nid);
    try {
      this.nid = note.nid;
      this.ownerId = note.ownerId;
      this.creationDate = note.creationDate;
      this.name = note.name;
      this.color = note.color;
    } catch {
      console.error(`Unable to find note with id: ${nid}`);
    }
  }

  async Init() {
    this.ownersUsername = (await users.GetByUid(this.ownerId)).username;
    this.users = await users.GetByNoteAccess(this.nid);
  }
}

module.exports = NoteDto;
