const db = require("../modules/db");
const UserRepo = require("../repos/UserRepository");
const users = new UserRepo(db);
const TaskRepo = require("../repos/TaskRepository");
const tasks = new TaskRepo(db);
const Task = require("./Task");

class TaskDto extends Task {
  constructor(task) {
    super(task);
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

  async GetByID(tid){
    const task = await tasks.GetByTid(tid);
    try{
      this.tid = task.tid;
      this.nid = task.nid;
      this.creationDate = task.creationDate;
      this.dueDate = task.dueDate;
      this.finishedDate = task.finishedDate;
      this.addedBy = task.addedBy;
      this.checked = task.checked;
      this.checkedBy = task.checkedBy;
      this.description = task.description;
    } catch {
      console.error(`Unable to find task with id: ${tid}`)
    }
  }

  async Init(){
    if (this.addedBy){
      this.addedBy = (await users.GetByUid(this.addedBy))?.username;
    }
    if (this.checkedBy){
      this.checkedBy = (await users.GetByUid(this.checkedBy))?.username;
    }
  }
}

module.exports = TaskDto;
