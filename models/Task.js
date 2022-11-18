const db = require("../modules/db");
const NoteRepo = require("../repos/NoteRepository");
const notes = new NoteRepo(db);
const TaskRepo = require("../repos/TaskRepository");
const tasks = new TaskRepo(db);

class Task {
  constructor(task) {
    this.tid = task.tid;
    this.nid = task.nid;
    this.creationDate = new Date(task.creationDate);
    this.dueDate = new Date(task.dueDate);
    this.finishedDate = new Date(task.finishedDate);
    this.checked = task.checked;
    this.checkedBy = task.checkedBy;
    this.description = task.description;
    this.importance = task.importance;
    this.color = task.color;
    this.order = task.order;
  }

  async UpdateByUser(uid, checked, description) {
    let noteWithPerms = await notes.CheckEditPerm(uid, this.nid);
    if (noteWithPerms?.nid) {
      return await tasks.Update(this.tid, checked, description, uid);
    }
    return null;
  }

  async DeleteByUser(uid) {
    let noteWithPerms = await notes.CheckDeletePerm(uid, this.nid);
    if (noteWithPerms?.nid) {
      console.log(this.tid, uid);
      return await tasks.DeleteTask(this.tid);
    }
    return null;
  }
}

module.exports = Task;
