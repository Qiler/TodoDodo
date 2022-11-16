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
    const result = await this.db.queryAsync("SELECT * FROM task WHERE tid = ? LIMIT 1", [tid]);
    if (result && result.rows && result.rows[0]) {
      return result.rows[0];
    }
    return null;
  }

  async AddTask(nid, description) {
    const result = await this.db.queryAsync("INSERT INTO tasks (nid,description) VALUES (?,?) RETURNING tid", [nid, description]);
    if (result && result.rows && result.rows[0]) {
      return result.rows[0];
    }
    return null;
  }

  async DeleteTask(tid) {
    return await this.db.runAsync("DELETE FROM tasks WHERE tid = ?", [tid]);
  }

  async UpdateDescription(tid, description) {
    return await this.db.runAsync("UPDATE tasks SET description = ? WHERE tid = ?", [description, tid]);
  }

  async UpdateChecked(tid, checked) {
    return await this.db.runAsync("UPDATE tasks SET checked = ? WHERE tid = ?", [checked, tid]);
  }

  async UpdateCheckedBy(tid, uid) {
    return await this.db.runAsync("UPDATE tasks SET description = ? WHERE tid = ?", [uid, tid]);
  }

  async UpdateImportance(tid, importance) {
    return await this.db.runAsync("UPDATE tasks SET importance = ? WHERE tid = ?", [importance, tid]);
  }

  async UpdateColor(tid, color) {
    return await this.db.runAsync("UPDATE tasks SET color = ? WHERE tid = ?", [color, tid]);
  }

  async UpdateDueDate(tid, date) {
    return await this.db.runAsync("UPDATE tasks SET dueDate = ? WHERE tid = ?", [date, tid]);
  }

  async UpdateFinishedDate(tid, date) {
    return await this.db.runAsync("UPDATE tasks SET finishedDate = ? WHERE tid = ?", [date, tid]);
  }

  async UpdateOrder(tid, order) {
    return await this.db.runAsync("UPDATE tasks SET [order] = ? WHERE tid = ?", [order, tid]);
  }
}

module.exports = TaskRepository;
