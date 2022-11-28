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
    try {
      return await tasks.AddTask(this.nid, uid, description);
    } catch {
      return null;
    }
  }

  async Delete() {
    try {
      return await notes.DeleteNote(this.nid);
    } catch {
      return null;
    }
  }

  async CreateTaskByUser(uid, description) {
    try {
      const noteWithPerms = await notes.CheckPermissions(this.nid, uid);
      if (noteWithPerms?.nid) {
        return await tasks.AddTask(this.nid, uid, description);
      }
      return null;
    } catch {
      return null;
    }
  }

  async DeleteByUser(uid) {
    try {
      const noteWithOwnership = await notes.CheckOwnership(this.nid, uid);
      if (noteWithOwnership?.nid) {
        return await notes.DeleteNote(noteWithOwnership.nid);
      }
      const noteWithPerms = await notes.CheckPermissions(this.nid, uid);
      if (noteWithPerms?.nid) {
        return await notes.RemoveAccess(this.nid, uid);
      }
      return null;
    } catch {
      return null;
    }
  }

  async ChangeTitleByUser(uid, name) {
    try {
      const noteWithPerms = await notes.CheckPermissions(this.nid, uid);
      if (noteWithPerms?.nid) {
        return await notes.UpdateName(noteWithPerms.nid, name);
      }
      return null;
    } catch {
      return null;
    }
  }

  async ChangeColorByUser(uid, color) {
    try {
      const noteWithPerms = await notes.CheckPermissions(this.nid, uid);
      if (noteWithPerms?.nid) {
        return await notes.UpdateColor(noteWithPerms.nid, color);
      }
      return null;
    } catch {
      return null;
    }
  }

  async ShareWith(uid, userid) {
    try {
      const noteWithPerms = await notes.CheckOwnership(this.nid, uid);
      if (noteWithPerms?.nid) {
        return await notes.LinkUser(this.nid, userid);
      }
      return null;
    } catch {
      return null;
    }
  }

  async RemoveAccess(uid, userid) {
    try {
      const noteWithPerms = await notes.CheckOwnership(this.nid, uid);
      if (noteWithPerms?.nid) {
        return await notes.RemoveAccess(this.nid, userid);
      }
      return null;
    } catch {
      return null;
    }
  }

  async CheckPermissions(uid) {
    const hasPermissions = await notes.CheckPermissions(this.nid, uid);
    return hasPermissions;
  }
}

module.exports = Note;
