const db = require("../modules/db");
const NoteRepo = require("../repos/NoteRepository");
const notes = new NoteRepo(db);
const TaskRepo = require("../repos/TaskRepository");
const tasks = new TaskRepo(db);

class Task {
  constructor(task) {
    this.tid = task?.tid;
    this.nid = task?.nid;
    this.creationDate = new Date(task?.creationDate);
    this.dueDate = new Date(task?.dueDate);
    this.finishedDate = new Date(task?.finishedDate);
    this.addedBy = task?.addedBy;
    this.checked = task?.checked;
    this.checkedBy = task?.checkedBy;
    this.description = task?.description;
  }

  async UpdateByUser(uid, checked, description) {
    try {
      let noteWithPerms = await notes.CheckPermissions(this.nid, uid);
      if (noteWithPerms?.nid) {
        return await tasks.Update(this.tid, checked, description, uid);
      }
      return null;
    } catch {
      return null;
    }
  }

  async UpdateDueDateByUser(uid, dueDate) {
    try {
      let noteWithPerms = await notes.CheckPermissions(this.nid, uid);
      if (noteWithPerms?.nid) {
        return await tasks.UpdateDueDate(this.tid, dueDate);
      }
      return null;
    } catch {
      return null;
    }
  }

  async DeleteByUser(uid) {
    try {
      let noteWithPerms = await notes.CheckPermissions(this.nid, uid);
      if (noteWithPerms?.nid) {
        return await tasks.DeleteTask(this.tid);
      }
      return null;
    } catch {
      return null;
    }
  }

  async CheckPermissions(uid) {
    try {
      let hasPermissions = await notes.CheckPermissions(this.nid, uid);
      return hasPermissions;
    } catch {
      return null;
    }
  }
}

module.exports = Task;
