const express = require("express");
const router = express.Router();
const db = require("../modules/db");
const Note = require("../models/Note");
const Task = require("../models/Task");
const TaskRepo = require("../repos/TaskRepository");
const tasks = new TaskRepo(db);

router.use((req, res, next) => {
  if (!req.session.loggedIn) {
    res.sendStatus(401);
  } else {
    next();
  }
});

router.post("/create/:noteId", async (req, res) => {
  req.params.noteId = parseInt(req.params.noteId);
  if (!req.params.noteId) {
    return res.sendStatus(400);
  }
  let note = new Note({ nid: req.params.noteId });
  await note.CreateTask(req.session.user.uid, "");
  res.redirect("/");
});

router.post("/edit/:taskId", async (req, res) => {
  req.body.checked = req.body.checked ? true : false;
  req.params.taskId = parseInt(req.params.taskId);
  if (!req.params.taskId) {
    return res.sendStatus(400);
  }
  let task = await tasks.GetByTid(req.params.taskId);
  task = new Task(task);
  await task.UpdateByUser(req.session.user.uid, req.body.checked, req.body.description);
  res.redirect("/");
});

router.post("/delete/:taskId", async (req, res) => {
  req.params.taskId = parseInt(req.params.taskId);
  if (!req.params.taskId) {
    return res.sendStatus(400);
  }
  let task = await tasks.GetByTid(req.params.taskId);
  task = new Task(task);
  await task.DeleteByUser(req.session.user.uid);
  res.redirect("/");
});

module.exports = router;
