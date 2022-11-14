class NoteRepository {
  constructor(db) {
    this.db = db;
  }

  async GetAll() {
    return await this.db.queryAsync("SELECT * FROM notes", []);
  }

  async GetByOwner(uid) {
    return await this.db.queryAsync("SELECT * FROM notes WHERE owner = ?", [uid]);
  }

  async GetByUid(uid) {
    return await this.db.queryAsync("SELECT * FROM notes LEFT JOIN userNotes ON notes.nid = userNotes.nid WHERE userNotes.uid = ?", [uid]);
  }

  async AddNote(uid, name, color) {
    return await this.db.runAsync("INSERT INTO notes (owner,name,color) VALUES (?,?,?)", [uid, name, color]);
  }

  async DeleteNote(nid) {
    return await this.db.runAsync("DELETE FROM notes WHERE nid = ?", [nid]);
  }

  async UpdateName(nid, name) {
    return await this.db.runAsync("UPDATE notes SET name = ? WHERE nid = ?", [name, nid]);
  }

  async UpdateColor(nid, color) {
    return await this.db.runAsync("UPDATE notes SET color = ? WHERE nid = ?", [color, nid]);
  }

  async AddAccess(nid, uid) {
    return await this.db.runAsync("INSERT INTO userNotes () VALUES ()", [nid, uid]);
  }

  async RemoveAccess(nid, uid) {
    return await this.db.runAsync("DELETE FROM userNotes WHERE nid = ? AND uid = ?", [nid, uid]);
  }

  async UpdateEditPermission(nid, uid, value) {
    return await this.db.runAsync("UPDATE userNotes SET editPerm ? WHERE nid = ? AND uid = ?", [value, nid, uid]);
  }

  async UpdateDeletePermission(nid, uid, value) {
    return await this.db.runAsync("UPDATE userNotes SET deletePerm ? WHERE nid = ? AND uid = ?", [value, nid, uid]);
  }

  async UpdateTaskPermission(nid, uid, value) {
    return await this.db.runAsync("UPDATE userNotes SET taskPerm ? WHERE nid = ? AND uid = ?", [value, nid, uid]);
  }

  async UpdateSharePermission(nid, uid, value) {
    return await this.db.runAsync("UPDATE userNotes SET sharePerm ? WHERE nid = ? AND uid = ?", [value, nid, uid]);
  }
}

module.exports = NoteRepository;
