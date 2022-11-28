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
    return res.status(400).json({ error: "Missing note ID." });
  }

  const note = new Note({ nid: req.params.noteId });
  const hasPermissions = note.CheckPermissions(req.session.user.uid);
  if (hasPermissions) {
    task = await note.CreateTask(req.session.user.uid, "");
    if (task) {
      res.status(201).json({ note: note, task: task });
    } else {
      return res.status(404).json({ error: "Unable to create task." });
    }
  }
  return res.status(401).json({ error: "Unable to create task." });
});

router.post("/edit/:taskId", async (req, res) => {
  req.body.checked = req.body.checked ? true : false;
  req.params.taskId = parseInt(req.params.taskId);
  if (!req.params.taskId) {
    return res.status(400).json({ error: "Missing task ID." });
  }

  let task = await tasks.GetByTid(req.params.taskId);
  if (task) {
    task = new Task(task);
    const updatedTask = await task.UpdateByUser(req.session.user.uid, req.body.checked, req.body.description);
    if (updatedTask) {
      res.status(200).redirect("/");
    } else {
      return res.status(401).json({ error: "Unable to edit task." });
    }
  }
  return res.status(404).json({ error: "Unable to find task with specified ID." });
});

router.post("/delete/:taskId", async (req, res) => {
  req.params.taskId = parseInt(req.params.taskId);
  if (!req.params.taskId) {
    return res.status(400).json({ error: "Missing task ID." });
  }

  let task = await tasks.GetByTid(req.params.taskId);
  if (task) {
    task = new Task(task);
    const deletedTask = await task.DeleteByUser(req.session.user.uid);
    if (deletedTask) {
      return res.status(200).redirect("/");
    } else {
      return res.status(401).json({ error: "Unable to delete task." });
    }
  }
  return res.status(404).json({ error: "Unable to find task with specified ID." });
});

router.post("/updatetaskdue/:taskId", async (req, res) => {
  const user = req.session.user;
  req.params.taskId = parseInt(req.params.taskId);
  if (!req.params.taskId) {
    return res.status(400).json({ error: "Missing task ID." });
  }

  if (!req.body.dueDate) {
    return res.status(400).json({ error: "Missing due date." });
  }

  let task = await tasks.GetByTid(req.params.taskId);
  if (task.tid) {
    task = new Task(task);
    const updatedTask = await task.UpdateDueDateByUser(user.uid, new Date(req.body.dueDate));
    if (updatedTask) {
      return res.status(200).redirect("/");
    } else {
      return res.status(401).json({ error: "Unable to edit task." });
    }
  }
  return res.status(400).json({ error: "Unable to find task with specified ID." });
});

module.exports = router;
