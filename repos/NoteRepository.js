class NoteRepository {
  constructor(db) {
    this.db = db;
  }

  async GetAll() {
    try {
      const result = await this.db.queryAsync("SELECT * FROM notes;", []);
      return result?.rows;
    } catch {
      return null;
    }
  }

  async GetByNid(nid) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM notes WHERE nid = ? LIMIT 1;", [nid]);
      return result?.rows[0];
    } catch {
      return null;
    }
  }

  async GetByOwner(uid) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM notes WHERE ownerId = ?;", [uid]);
      return result?.rows;
    } catch {
      return null;
    }
  }

  async GetByUid(uid) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM notes LEFT JOIN userNotes ON notes.nid = userNotes.nid WHERE userNotes.uid = ?;", [uid]);
      return result?.rows;
    } catch {
      return null;
    }
  }

  async AddNote(uid, name, color) {
    try {
      const result = await this.db.queryAsync("INSERT INTO notes (ownerId,name,color) VALUES (?,?,?) RETURNING nid;", [uid, name, color]);
      if (result && result.rows && result.rows[0]) {
        const link = [uid, result.rows[0].nid].join("-");
        await this.db.runAsync("INSERT INTO userNotes (link,nid,uid,isOwner) VALUES (?,?,?,?);", [link, result.rows[0].nid, uid, true]);
        return result.rows[0];
      }
      return null;
    } catch {
      return null;
    }
  }

  async CheckPermissions(nid, uid) {
    try {
      const result = await this.db.queryAsync(
        `SELECT * FROM notes 
                LEFT JOIN userNotes ON notes.nid = userNotes.nid
                WHERE userNotes.uid = ? AND userNotes.nid = ?
                LIMIT 1;`,
        [uid, nid]
      );
      return result?.rows[0];
    } catch {
      return null;
    }
  }

  async CheckOwnership(nid, uid) {
    try {
      const result = await this.db.queryAsync(
        `SELECT * FROM notes 
                LEFT JOIN userNotes ON notes.nid = userNotes.nid
                WHERE userNotes.uid = ? AND userNotes.nid = ? AND userNotes.isOwner = true
                LIMIT 1;`,
        [uid, nid]
      );
      return result?.rows[0];
    } catch {
      return null;
    }
  }

  async LinkUser(nid, uid) {
    try {
      const link = [uid, nid].join("-");
      return await this.db.runAsync("INSERT INTO userNotes (link,nid,uid,isOwner) VALUES (?,?,?,?);", [link, nid, uid, false]);
    } catch {
      return null;
    }
  }

  async RemoveAccess(nid, uid) {
    try {
      return await this.db.runAsync("DELETE FROM userNotes WHERE nid = ? AND uid = ? and userNotes.isOwner = false;", [nid, uid]);
    } catch {
      return null;
    }
  }

  async DeleteNote(nid) {
    try {
      return await this.db.runAsync("DELETE FROM notes WHERE nid = ?;", [nid]);
    } catch {
      return null;
    }
  }

  async UpdateName(nid, name) {
    try {
      return await this.db.runAsync("UPDATE notes SET name = ? WHERE nid = ?;", [name, nid]);
    } catch {
      return null;
    }
  }

  async UpdateColor(nid, color) {
    try {
      return await this.db.runAsync("UPDATE notes SET color = ? WHERE nid = ?;", [color, nid]);
    } catch {
      return null;
    }
  }
}

module.exports = NoteRepository;
