class TaskRepository {
  constructor(db) {
    this.db = db;
  }

  async GetAll() {
    try {
      const result = await this.db.queryAsync("SELECT * FROM tasks WHERE", []);
      return result?.rows;
    } catch {
      return null;
    }
  }

  async GetByNid(nid) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM tasks WHERE nid = ?", [nid]);
      return result?.rows;
    } catch {
      return null;
    }
  }

  async GetByTid(tid) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM tasks WHERE tid = ? LIMIT 1", [tid]);
      if (result && result.rows && result.rows[0]) {
        return result.rows[0];
      }
      return null;
    } catch {
      return null;
    }
  }

  async AddTask(nid, addedBy, description) {
    try {
      const result = await this.db.queryAsync("INSERT INTO tasks (nid,addedBy,description) VALUES (?,?,?) RETURNING tid", [nid, addedBy, description]);
      if (result && result.rows && result.rows[0]) {
        return result.rows[0];
      }
      return null;
    } catch {
      return null;
    }
  }

  async DeleteTask(tid) {
    try {
      const result = await this.db.runAsync("DELETE FROM tasks WHERE tid = ?", [tid]);
      return result;
    } catch {
      return null;
    }
  }

  async Update(tid, checked, description, checkedBy) {
    try {
      if (checked == true) {
        await this.db.runAsync("UPDATE tasks SET checkedBy = ?, finishedDate = ((strftime('%s') + (strftime('%f') - strftime('%S'))) * 1000) WHERE tid = ?", [checkedBy, tid]);
      }
      return await this.db.runAsync("UPDATE tasks SET description = ?, checked = ? WHERE tid = ?", [description, checked, tid]);
    } catch {
      return null;
    }
  }

  async UpdateDueDate(tid, date) {
    try {
      return await this.db.runAsync("UPDATE tasks SET dueDate = ? WHERE tid = ?", [date, tid]);
    } catch {
      return null;
    }
  }

  async UpdateFinishedDate(tid, date) {
    try {
      return await this.db.runAsync("UPDATE tasks SET finishedDate = ? WHERE tid = ?", [date, tid]);
    } catch {
      return null;
    }
  }

  async UpdateChecked(tid, checked) {
    try {
      return await this.db.runAsync("UPDATE tasks SET checked = ? WHERE tid = ?", [checked, tid]);
    } catch {
      return null;
    }
  }

  async UpdateCheckedBy(tid, uid) {
    try {
      return await this.db.runAsync("UPDATE tasks SET description = ? WHERE tid = ?", [uid, tid]);
    } catch {
      return null;
    }
  }

  async UpdateDescription(tid, description) {
    try {
      return await this.db.runAsync("UPDATE tasks SET description = ? WHERE tid = ?", [description, tid]);
    } catch {
      return null;
    }
  }
}

module.exports = TaskRepository;
