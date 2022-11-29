const ApiException = require("../exceptions/ApiException");

class NoteRepository {
  constructor(db) {
    this.db = db;
  }

  async GetAll() {
    try {
      const result = await this.db.queryAsync("SELECT * FROM notes;", []);
      return result?.rows;
    } catch (ex) {
      throw new ApiException("Unable to get all notes from database.", ex);
    }
  }

  async GetByNid(nid) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM notes WHERE nid = ? LIMIT 1;", [nid]);
      return result?.rows[0];
    } catch (ex) {
      throw new ApiException(`Unable to get note: ${nid}.`, ex);
    }
  }

  async GetByOwner(uid) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM notes WHERE ownerId = ?;", [uid]);
      return result?.rows;
    } catch (ex) {
      throw new ApiException(`Unable to get note owned by user: ${uid}`, ex);
    }
  }

  async GetByUid(uid) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM notes LEFT JOIN userNotes ON notes.nid = userNotes.nid WHERE userNotes.uid = ?;", [uid]);
      return result?.rows;
    } catch (ex) {
      throw new ApiException(`Unable to get notes for user: ${uid}`, ex);
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
    } catch (ex) {
      throw new ApiException(`Unable to add note for user: ${uid}`, ex);
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
    } catch (ex) {
      throw new ApiException(`Unable to check permissions for note: ${nid} for user: ${uid}`, ex);
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
    } catch (ex) {
      throw new ApiException(`Unable to check ownership of note: ${nid} for user: ${uid}`, ex);
    }
  }

  async LinkUser(nid, uid) {
    try {
      const link = [uid, nid].join("-");
      return await this.db.runAsync("INSERT INTO userNotes (link,nid,uid,isOwner) VALUES (?,?,?,?);", [link, nid, uid, false]);
    } catch (ex) {
      throw new ApiException(`Unable to give user: ${uid} access to note: ${nid}`, ex);
    }
  }

  async RemoveAccess(nid, uid) {
    try {
      return await this.db.runAsync("DELETE FROM userNotes WHERE nid = ? AND uid = ? and userNotes.isOwner = false;", [nid, uid]);
    } catch (ex) {
      throw new ApiException(`Unable to remove access for user: ${uid} from note: ${nid}`, ex);
    }
  }

  async DeleteNote(nid) {
    try {
      return await this.db.runAsync("DELETE FROM notes WHERE nid = ?;", [nid]);
    } catch (ex) {
      throw new ApiException(`Unable to delete note: ${nid}`, ex);
    }
  }

  async UpdateName(nid, name) {
    try {
      return await this.db.runAsync("UPDATE notes SET name = ? WHERE nid = ?;", [name, nid]);
    } catch (ex) {
      throw new ApiException(`Unable to update name for note: ${nid}`, ex);
    }
  }

  async UpdateColor(nid, color) {
    try {
      return await this.db.runAsync("UPDATE notes SET color = ? WHERE nid = ?;", [color, nid]);
    } catch (ex) {
      throw new ApiException(`Unable to update color for note: ${nid}`, ex);
    }
  }
}

module.exports = NoteRepository;
