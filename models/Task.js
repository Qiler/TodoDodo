const db = require("../modules/db");

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
}

module.exports = Task;
