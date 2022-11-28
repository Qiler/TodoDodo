const express = require("express");
const router = express.Router();
const app = express();
const User = require("../models/User");
const NoteDto = require("../models/NoteDto");
const TaskDto = require("../models/TaskDto");
const UserDto = require("../models/UserDto");
const fs = require("fs");
const defaultAvatar = fs.readFileSync("./public/images/default-avatar.png", "base64");

router.get("/", (req, res) => {
  res.send("API");
});

router.use((req, res, next) => {
  if (req.path.startsWith("/getavatar")) {
    return next();
  }
  if (!req.session.loggedIn) {
    return res.status(401).json({});
  }
  return next();
});

router.get("/getnote/:noteId", async (req, res) => {
  const user = new User(req.session.user);
  req.params.noteId = parseInt(req.params.noteId);
  if (!req.params.noteId) {
    return res.status(400).json({});
  }

  const note = new NoteDto({
    nid: req.params.noteId,
    ownerId: user.uid,
  });

  await note.GetByID(req.params.noteId);
  await note.Init();
  await note.GetTasks();
  const permissions = await note.CheckPermissions(user.uid);
  const users = [];

  if (permissions) {
    for (let u of note.users) {
      u = {
        uid: u.uid,
        username: u.username,
      };
      users.push(u);
    }
    const response = {
      nid: note.nid,
      ownerId: note.ownerId,
      ownersUsername: note.ownersUsername,
      creationDate: note.creationDate,
      name: note.name,
      color: note.color,
      tasks: note.tasks,
      users: users,
    };
    return res.status(200).json(response);
  }
  return res.status(401).json({});
});

router.get("/gettask/:taskId", async (req, res) => {
  const user = new User(req.session.user);
  req.params.taskId = parseInt(req.params.taskId);
  if (!req.params.taskId) {
    return res.status(400).json({});
  }

  const task = new TaskDto();
  await task.GetByID(req.params.taskId);
  await task.Init();
  const permissions = await task.CheckPermissions(user.uid);
  if (permissions) {
    return res.status(200).json(task);
  }
  return res.status(401).json({});
});

router.get("/getuser/:userId", async (req, res) => {
  req.params.userId = parseInt(req.params.userId);
  if (!req.params.userId) {
    return res.status(400).json({});
  }

  const requestedUser = new UserDto();
  const user = await requestedUser.FindByID(req.params.userId);
  if (user) {
    return res.json(requestedUser);
  }
  return res.status(404).json({ error: "User not found." });
});

router.get("/getavatar", async (req, res) => {
  const user = new User(req.session.user);
  var avatar = Buffer.from(user?.avatar ? user.avatar : defaultAvatar, "base64");
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": avatar.length,
  });
  res.end(avatar);
});

router.get("/getavatar/:userId", async (req, res) => {
  req.params.userId = parseInt(req.params.userId);
  if (!req.params.userId) {
    return res.sendStatus(400);
  }

  const user = new UserDto();
  await user.FindByID(req.params.userId);
  if (!user.uid) {
    res.sendStatus(404);
  } else {
    var avatar = Buffer.from(user?.avatar ? user.avatar : defaultAvatar, "base64");

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": avatar.length,
    });
    res.end(avatar);
  }
});

module.exports = router;
