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

router.get("/getnote/:noteId", async (req, res) => {
  let user = new User(req.session.user);
  req.params.noteId = parseInt(req.params.noteId);

  let note = new NoteDto({
    nid: req.params.noteId,
    ownerId: user.uid,
  });

  await note.GetByID(req.params.noteId);
  await note.Init();
  await note.GetTasks();
  const permissions = await note.CheckPermissions(user.uid);
  const users = [];
  if (permissions) {
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
      users: users,
    });
  } else {
    res.json({});
  }
});

router.get("/gettask/:taskId", async (req, res) => {
  let user = new User(req.session.user);
  req.params.taskId = parseInt(req.params.taskId);
  let task = new TaskDto();
  await task.GetByID(req.params.taskId);
  await task.Init();
  const permissions = await task.CheckPermissions(user.uid);
  if (permissions) {
    res.json(task);
  } else {
    res.json({});
  }
});

router.post("/updatetaskdue/:taskId", async (req, res) => {
  let user = new User(req.session.user);
  req.params.taskId = parseInt(req.params.taskId);
  let task = new TaskDto();
  await task.GetByID(req.params.taskId);
  await task.UpdateDueDateByUser(user.uid, new Date(req.body.dueDate));
});

router.get("/getuser/:userId", async (req, res) => {
  req.params.userId = parseInt(req.params.userId);
  let requestedUser = new UserDto();
  await requestedUser.FindByID(req.params.userId);
  res.json(requestedUser);
});

router.get("/getavatar", async (req, res) => {
  let user = new User(req.session.user);
  var avatar = Buffer.from(user?.avatar ? user.avatar : defaultAvatar, "base64");
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": avatar.length,
  });
  res.end(avatar);
});

router.get("/getavatar/:userId", async (req, res) => {
  req.params.userId = parseInt(req.params.userId);
  let user = new UserDto();
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
