class NoteRepository {
  constructor(db) {
    this.db = db;
  }

  async GetAll() {
    const result = await this.db.queryAsync("SELECT * FROM notes;", []);
    return result?.rows;
  }

  async GetByNid(nid) {
    const result = await this.db.queryAsync("SELECT * FROM notes WHERE nid = ? LIMIT 1;", [nid]);
    return result?.rows[0];
  }

  async GetByOwner(uid) {
    const result = await this.db.queryAsync("SELECT * FROM notes WHERE ownerId = ?;", [uid]);
    return result?.rows;
  }

  async GetByUid(uid) {
    const result = await this.db.queryAsync("SELECT * FROM notes LEFT JOIN userNotes ON notes.nid = userNotes.nid WHERE userNotes.uid = ?;", [uid]);
    return result?.rows;
  }

  async AddNote(uid, name, color) {
    const result = await this.db.queryAsync("INSERT INTO notes (ownerId,name,color) VALUES (?,?,?) RETURNING nid;", [uid, name, color]);
    if (result && result.rows && result.rows[0]) {
      const link = [uid, result.rows[0].nid].join("-");
      await this.db.runAsync("INSERT INTO userNotes (link,nid,uid,isOwner) VALUES (?,?,?,?);", [link, result.rows[0].nid, uid, true]);
      return result.rows[0];
    }
    return null;
  }

  async CheckPermissions(nid, uid) {
    const result = await this.db.queryAsync(
      `SELECT * FROM notes 
                LEFT JOIN userNotes ON notes.nid = userNotes.nid
                WHERE userNotes.uid = ? AND userNotes.nid = ?
                LIMIT 1;`,
      [uid, nid]
    );
    return result?.rows[0];
  }

  async CheckOwnership(nid, uid) {
    const result = await this.db.queryAsync(
      `SELECT * FROM notes 
                LEFT JOIN userNotes ON notes.nid = userNotes.nid
                WHERE userNotes.uid = ? AND userNotes.nid = ? AND userNotes.isOwner = true
                LIMIT 1;`,
      [uid, nid]
    );
    return result?.rows[0];
  }

  async LinkUser(nid, uid) {
    const link = [uid, nid].join("-");
    return await this.db.runAsync("INSERT INTO userNotes (link,nid,uid,isOwner) VALUES (?,?,?,?);", [link, nid, uid, false]);
  }

  async RemoveAccess(nid, uid) {
    return await this.db.runAsync("DELETE FROM userNotes WHERE nid = ? AND uid = ? and userNotes.isOwner = false;", [nid, uid]);
  }

  async DeleteNote(nid) {
    return await this.db.runAsync("DELETE FROM notes WHERE nid = ?;", [nid]);
  }

  async UpdateName(nid, name) {
    return await this.db.runAsync("UPDATE notes SET name = ? WHERE nid = ?;", [name, nid]);
  }

  async UpdateColor(nid, color) {
    return await this.db.runAsync("UPDATE notes SET color = ? WHERE nid = ?;", [color, nid]);
  }
}

module.exports = NoteRepository;
