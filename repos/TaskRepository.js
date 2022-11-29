const ApiException = require("../exceptions/ApiException");

class TaskRepository {
  constructor(db) {
    this.db = db;
  }

  async GetAll() {
    try {
      const result = await this.db.queryAsync("SELECT * FROM tasks WHERE", []);
      return result?.rows;
    } catch (ex) {
      throw new ApiException(`Unable to get all tasks from database.`, ex);
    }
  }

  async GetByNid(nid) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM tasks WHERE nid = ?", [nid]);
      return result?.rows;
    } catch (ex) {
      throw new ApiException(`Unable to get task from note: ${nid}`, ex);
    }
  }

  async GetByTid(tid) {
    try {
      const result = await this.db.queryAsync("SELECT * FROM tasks WHERE tid = ? LIMIT 1", [tid]);
      if (result && result.rows && result.rows[0]) {
        return result.rows[0];
      }
      return null;
    } catch (ex) {
      throw new ApiException(`Unable to get task: ${tid}`, ex);
    }
  }

  async AddTask(nid, addedBy, description) {
    try {
      const result = await this.db.queryAsync("INSERT INTO tasks (nid,addedBy,description) VALUES (?,?,?) RETURNING tid", [nid, addedBy, description]);
      if (result && result.rows && result.rows[0]) {
        return result.rows[0];
      }
      return null;
    } catch (ex) {
      throw new ApiException(`Unable to add task to note: ${nid}`, ex);
    }
  }

  async DeleteTask(tid) {
    try {
      const result = await this.db.runAsync("DELETE FROM tasks WHERE tid = ?", [tid]);
      return result;
    } catch (ex) {
      throw new ApiException(`Unable to delete task: ${tid}`, ex);
    }
  }

  async Update(tid, checked, description, checkedBy) {
    try {
      if (checked == true) {
        await this.db.runAsync("UPDATE tasks SET checkedBy = ?, finishedDate = ((strftime('%s') + (strftime('%f') - strftime('%S'))) * 1000) WHERE tid = ?", [checkedBy, tid]);
      }
      return await this.db.runAsync("UPDATE tasks SET description = ?, checked = ? WHERE tid = ?", [description, checked, tid]);
    } catch (ex) {
      throw new ApiException(`Unable to update task: ${tid}`, ex);
    }
  }

  async UpdateDueDate(tid, date) {
    try {
      return await this.db.runAsync("UPDATE tasks SET dueDate = ? WHERE tid = ?", [date, tid]);
    } catch (ex) {
      throw new ApiException(`Unable to update due date on task: ${tid}`, ex);
    }
  }

  async UpdateFinishedDate(tid, date) {
    try {
      return await this.db.runAsync("UPDATE tasks SET finishedDate = ? WHERE tid = ?", [date, tid]);
    } catch (ex) {
      throw new ApiException(`Unable to update dinished date on task: ${tid}`, ex);
    }
  }

  async UpdateChecked(tid, checked) {
    try {
      return await this.db.runAsync("UPDATE tasks SET checked = ? WHERE tid = ?", [checked, tid]);
    } catch (ex) {
      throw new ApiException(`Unable to update checked status on task: ${tid}`, ex);
    }
  }

  async UpdateCheckedBy(tid, uid) {
    try {
      return await this.db.runAsync("UPDATE tasks SET description = ? WHERE tid = ?", [uid, tid]);
    } catch (ex) {
      throw new ApiException(`Unable to update checked by user: ${uid} on task: ${tid}`, ex);
    }
  }

  async UpdateDescription(tid, description) {
    try {
      return await this.db.runAsync("UPDATE tasks SET description = ? WHERE tid = ?", [description, tid]);
    } catch (ex) {
      throw new ApiException(`Unable to update description on task: ${tid}`, ex);
    }
  }
}

module.exports = TaskRepository;
