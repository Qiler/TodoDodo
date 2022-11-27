const express = require("express");
const router = express.Router();
const db = require("../modules/db");
const Note = require("../models/Note");
const Task = require("../models/Task");
const TaskRepo = require("../repos/TaskRepository");
const tasks = new TaskRepo(db);

router.post("/create/:noteId", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    req.params.noteId = parseInt(req.params.noteId);
    let note = new Note({ nid: req.params.noteId });
    await note.CreateTask(req.session.user.uid, "");
    res.redirect("/");
  }
});

router.post("/edit/:taskId", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    req.body.checked = req.body.checked ? true : false;
    req.params.taskId = parseInt(req.params.taskId);
    let task = await tasks.GetByTid(req.params.taskId);
    task = new Task(task);
    await task.UpdateByUser(req.session.user.uid, req.body.checked, req.body.description);
    res.redirect("/");
  }
});

router.post("/delete/:taskId", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    req.params.taskId = parseInt(req.params.taskId);
    let task = await tasks.GetByTid(req.params.taskId);
    task = new Task(task);
    await task.DeleteByUser(req.session.user.uid);
    res.redirect("/");
  }
});

module.exports = router;
