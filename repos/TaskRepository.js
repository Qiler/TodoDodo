class TaskRepository {
  constructor(db) {
    this.db = db;
  }

  async GetAll() {
    const result = await this.db.queryAsync("SELECT * FROM tasks WHERE", []);
    return result?.rows;
  }

  async GetByNid(nid) {
    const result = await this.db.queryAsync("SELECT * FROM tasks WHERE nid = ?", [nid]);
    return result?.rows;
  }

  async GetByTid(tid) {
    const result = await this.db.queryAsync("SELECT * FROM tasks WHERE tid = ? LIMIT 1", [tid]);
    if (result && result.rows && result.rows[0]) {
      return result.rows[0];
    }
    return null;
  }

  async AddTask(nid, addedBy, description) {
    const result = await this.db.queryAsync("INSERT INTO tasks (nid,addedBy,description) VALUES (?,?,?) RETURNING tid", [nid, addedBy, description]);
    if (result && result.rows && result.rows[0]) {
      return result.rows[0];
    }
    return null;
  }

  async DeleteTask(tid) {
    return await this.db.runAsync("DELETE FROM tasks WHERE tid = ?", [tid]);
  }

  async Update(tid, checked, description, checkedBy) {
    if (checked == true) {
      await this.db.runAsync("UPDATE tasks SET checkedBy = ?, finishedDate = ((strftime('%s') + (strftime('%f') - strftime('%S'))) * 1000) WHERE tid = ?", [checkedBy, tid]);
    }
    return await this.db.runAsync("UPDATE tasks SET description = ?, checked = ? WHERE tid = ?", [description, checked, tid]);
  }
  
  async UpdateDueDate(tid, date) {
    return await this.db.runAsync("UPDATE tasks SET dueDate = ? WHERE tid = ?", [date, tid]);
  }
  
  async UpdateFinishedDate(tid, date) {
    return await this.db.runAsync("UPDATE tasks SET finishedDate = ? WHERE tid = ?", [date, tid]);
  }
  
  async UpdateChecked(tid, checked) {
    return await this.db.runAsync("UPDATE tasks SET checked = ? WHERE tid = ?", [checked, tid]);
  }

  async UpdateCheckedBy(tid, uid) {
    return await this.db.runAsync("UPDATE tasks SET description = ? WHERE tid = ?", [uid, tid]);
  }

  async UpdateDescription(tid, description) {
    return await this.db.runAsync("UPDATE tasks SET description = ? WHERE tid = ?", [description, tid]);
  }
  
}

module.exports = TaskRepository;
