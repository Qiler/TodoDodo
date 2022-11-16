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

  async GetTasks() {
    const taskDb = await tasks.GetByNid(this.nid);
    let taskArray = [];
    taskDb?.forEach((task) => {
      taskArray.push(new Note(task));
    });
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
    console.log(noteWithPerms);
    if (noteWithPerms?.nid) {
      return await notes.DeleteNote(noteWithPerms.nid);
    }
    return null;
  }

  // ADD more stuff here
}

module.exports = Note;
