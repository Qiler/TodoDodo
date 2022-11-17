const db = require("../modules/db");
const NoteRepo = require("../repos/NoteRepository");
const notes = new NoteRepo(db);
const TaskRepo = require("../repos/TaskRepository");
const tasks = new TaskRepo(db);
const Task = require("../models/Task");

class Note {
  constructor(note) {
    this.nid = note.nid;
    this.owner = note.owner;
    if (note.creationDate instanceof Date){
      this.creationDate = note.creationDate;
    } else {
      this.creationDate = new Date(note.creationDate * 1000);
    }
    this.name = note.name;
    this.color = note.color;
  }

  async GetTasks() {
    const taskDb = await tasks.GetByNid(this.nid);
    let taskArray = [];
    taskDb?.forEach((task) => {
      taskArray.push(new Task(task));
    });
    this.tasks = taskArray;
    return taskArray;
  }

  async CreateTask(description) {
    return await tasks.AddTask(this.nid, description);
  }

  async Delete() {
    return await notes.DeleteNote(this.nid);
  }

  async DeleteByUser(uid) {
    let noteWithPerms = await notes.CheckDeletePerm(uid, this.nid);
    if (noteWithPerms?.nid) {
      return await notes.DeleteNote(noteWithPerms.nid);
    }
    return null;
  }

  async ChangeTitleByUser(uid, name) {
    let noteWithPerms = await notes.CheckEditPerm(uid, this.nid);
    if (noteWithPerms?.nid) {
      return await notes.UpdateName(noteWithPerms.nid, name);
    }
    return null;
  }

  // ADD more stuff here
}

module.exports = Note;
