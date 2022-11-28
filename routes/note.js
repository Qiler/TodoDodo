const express = require("express");
const router = express.Router();
const User = require("../models/User");
const UserDto = require("../models/UserDto");
const Note = require("../models/Note");

router.use((req, res, next) => {
  if (!req.session.loggedIn) {
    return res.sendStatus(401);
  }
  next();
});

router.post("/create", async (req, res) => {
  const user = new User(req.session.user);
  await user.CreateNote("Todo");
  res.redirect("/");
});

router.post("/editname/:noteId", async (req, res) => {
  req.params.noteId = parseInt(req.params.noteId);
  if (!req.params.noteId) {
    return res.status(400).json({ error: "Missing note ID." });
  }

  if (req.body.name.length() > 40) {
    req.body.name = req.body.name.slice(0, 40);
  }

  const note = new Note({ nid: req.params.noteId });
  const updatedNote = await note.ChangeTitleByUser(req.session.user.uid, req.body.name);
  if (updatedNote) {
    return res.sendStatus(201);
  }
  return res.status(401).json({ error: "Unable to edit note." });
});

router.post("/editcolor/:noteId", async (req, res) => {
  req.params.noteId = parseInt(req.params.noteId);
  if (!req.params.noteId) {
    return res.status(400).json({ error: "Missing note ID." });
  }

  if (!req.body.color.match(/^#([0-9a-f]{3}){1,2}$/i)) {
    return res.status(400).json({ error: "Blank or malformed color." });
  }

  const note = new Note({ nid: req.params.noteId });
  const updatedNote = await note.ChangeColorByUser(req.session.user.uid, req.body.color);
  if (updatedNote) {
    return res.sendStatus(201);
  }
  return res.status(401).json({ error: "Unable to edit note." });
});

router.post("/delete/:noteId", async (req, res) => {
  req.params.noteId = parseInt(req.params.noteId);
  if (!req.params.noteId) {
    return res.status(400).json({ error: "Missing note ID." });
  }

  const note = new Note({ nid: req.params.noteId });
  const deletedNote = await note.DeleteByUser(req.session.user.uid);
  if (deletedNote) {
    return res.sendStatus(201);
  }
  return res.status(401).json({ error: "Unable to delete note." });
});

router.post("/removeaccess/:noteId", async (req, res) => {
  req.params.noteId = parseInt(req.params.noteId);
  if (!req.params.noteId) {
    return res.status(400).json({ error: "Missing note ID." });
  }

  req.body.userid = parseInt(req.body.userid);
  if (!req.body.userid) {
    return res.status(400).json({ error: "Missing user ID." });
  }

  const note = new Note({ nid: req.params.noteId });
  const updatedNote = await note.RemoveAccess(req.session.user.uid, req.body.userid);
  if (updatedNote) {
    return res.sendStatus(201);
  }
  return res.status(401).json({ error: "Unable to remove access from note." });
});

router.post("/share/:noteId", async (req, res) => {
  req.params.noteId = parseInt(req.params.noteId);
  if (!req.params.noteId) {
    return res.status(400).json({ error: "Missing note ID." });
  }

  if (!req.body.user) {
    return res.status(400).json({ error: "Missing user name." });
  }

  const user = new UserDto({});
  await user.FindByName(req.body.user);
  if (!user.uid) {
    return res.status(404).json({ error: "User not found." });
  }

  const note = new Note({ nid: req.params.noteId });
  const updatedNote = await note.ShareWith(req.session.user.uid, user.uid);
  if (updatedNote) {
    return res.status(201).json({ user });
  }
  return res.status(401).json({ error: "Unable to share note." });
});

module.exports = router;
