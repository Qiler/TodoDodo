const express = require("express");
const router = express.Router();
const User = require("../models/User");
const NoteDTO = require("../models/NoteDto");
const TaskDTO = require("../models/TaskDto");

router.get("/", (req, res) => {
  res.send("API");
});

router.get("/getnote/:noteId", async (req, res) => {
  if (!req.session.loggedIn) {
    res.json({});
  } else {
    let user = new User(req.session.user);
    req.params.noteId = parseInt(req.params.noteId);

    let note = new NoteDTO({
      nid: req.params.noteId,
      ownerId: user.uid,
    });

    await note.GetByID(req.params.noteId);
    await note.Init();
    await note.GetTasks();
    const permissions = await note.CheckPermissions(user.uid);
    const users = [];
    if (permissions){
      for (let user of note.users) {
        user = {
          uid: user.uid,
          username: user.username,
          avatar: user.avatar,
        };
        users.push(user);
      }
      res.json({ 
        nid: note.nid,
        ownerId: note.ownerId,
        owner: note.owner,
        creationDate: note.creationDate,
        name: note.name,
        color: note.color,
        tasks: note.tasks,
        users: users
      });
    } else {
      res.json({});
    }
  }
});

router.get("/gettask/:taskId", async (req, res) => {
  if (!req.session.loggedIn) {
    res.json({});
  } else {
    let user = new User(req.session.user);
    req.params.taskId = parseInt(req.params.taskId);
    let task = new TaskDTO();
    await task.GetByID(req.params.taskId);
    await task.Init();
    const permissions = await task.CheckPermissions(user.uid);
    if (permissions){
      res.json(task);
    } else {
      res.json({});
    }
  }
});

router.post("/updatetaskdue/:taskId", async (req, res) => {
  if (!req.session.loggedIn) {
    res.json({});
  } else {
    let user = new User(req.session.user);
    req.params.taskId = parseInt(req.params.taskId);
    let task = new TaskDTO();
    await task.GetByID(req.params.taskId);
    await task.UpdateDueDateByUser(user.uid,new Date(req.body.dueDate));
  }
});

module.exports = router;
