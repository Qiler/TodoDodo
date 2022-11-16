class NoteRepository {
  constructor(db) {
    this.db = db;
  }

  async GetAll() {
    const result = await this.db.queryAsync("SELECT * FROM notes", []);
    return result?.rows;
  }

  async GetByOwner(uid) {
    const result = await this.db.queryAsync("SELECT * FROM notes WHERE owner = ?", [uid]);
    return result?.rows;
  }

  async GetByUid(uid) {
    const result = await this.db.queryAsync("SELECT * FROM notes LEFT JOIN userNotes ON notes.nid = userNotes.nid WHERE userNotes.uid = ?", [uid]);
    return result?.rows;
  }

  async AddNote(uid, name, color) {
    const result = await this.db.queryAsync("INSERT INTO notes (owner,name,color) VALUES (?,?,?) RETURNING nid", [uid, name, color]);
    if (result && result.rows && result.rows[0]) {
      return result.rows[0];
    }
    return null;
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
    return await this.db.runAsync("INSERT INTO userNotes (nid,uid) VALUES (?,?)", [nid, uid]);
  }

  async AddFullAccess(nid, uid) {
    return await this.db.runAsync("INSERT INTO userNotes (nid,uid,editPerm,deletePerm,taskPerm,sharePerm) VALUES (?,?,true,true,true,true)", [nid, uid]);
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
