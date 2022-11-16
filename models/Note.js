const db = require("../modules/db");
const TaskRepo = require("../repos/TaskRepository");
const tasks = new TaskRepo(db);
const Task = require("../models/Task");

class Note {
  constructor(note) {
    this.nid = note.nid;
    this.owner = note.owner;
    this.creationDate = new Date(note.creationDate);
    this.name = note.name;
    this.color = note.color;
  }

  async GetTasks() {
    const taskDb = await tasks.GetByNid(this.nid);
    let taskArray = [];
    taskDb?.forEach((task) => {
      taskArray.push(new Task(task));
    });
    return taskArray;
  }

  async AddTask(description) {
    return await tasks.AddTask(this.nid, description);
  }
}

module.exports = Note;
