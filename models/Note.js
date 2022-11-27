const db = require("../modules/db");
const NoteRepo = require("../repos/NoteRepository");
const notes = new NoteRepo(db);
const TaskRepo = require("../repos/TaskRepository");
const tasks = new TaskRepo(db);
const Task = require("../models/Task");

class Note {
  constructor(note) {
    this.nid = note?.nid;
    this.ownerId = note?.ownerId;
    this.creationDate = note?.creationDate;
    this.name = note?.name;
    this.color = note?.color;
    this.users = [];
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

  async CreateTask(uid, description) {
    return await tasks.AddTask(this.nid, uid, description);
  }

  async Delete() {
    return await notes.DeleteNote(this.nid);
  }

  async DeleteByUser(uid) {
    let noteWithPerms = await notes.CheckPermissions(this.nid, uid);
    if (noteWithPerms?.nid) {
      return await notes.DeleteNote(noteWithPerms.nid);
    }
    return null;
  }

  async ChangeTitleByUser(uid, name) {
    let noteWithPerms = await notes.CheckPermissions(this.nid, uid);
    if (noteWithPerms?.nid) {
      return await notes.UpdateName(noteWithPerms.nid, name);
    }
    return null;
  }

  async ChangeColorByUser(uid, color) {
    let noteWithPerms = await notes.CheckPermissions(this.nid, uid);
    if (noteWithPerms?.nid) {
      return await notes.UpdateColor(noteWithPerms.nid, color);
    }
    return null;
  }

  async ShareWith(uid, userid) {
    let noteWithPerms = await notes.CheckOwnership(this.nid, uid);
    if (noteWithPerms?.nid) {
      return await notes.LinkUser(this.nid, userid);
    }
    return null;
  }

  async RemoveAccess(uid, userid) {
    let noteWithPerms = await notes.CheckOwnership(this.nid, uid);
    if (noteWithPerms?.nid) {
      return await notes.RemoveAccess(this.nid, userid);
    }
    return null;
  }

  async CheckPermissions(uid) {
    let permissions = await notes.CheckOwnership(this.nid, uid);
    return permissions;
  }
}

module.exports = Note;
