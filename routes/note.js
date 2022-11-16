const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Note = require("../models/Note");
const Task = require("../models/Task");

router.get("/test", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    res.send("");
  }
});

router.get("/create", async (req, res) => {
  console.log(req.session.user);
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    let user = new User(req.session.user);
    await user.CreateNote("Todo Note");
    res.redirect("/");
  }
});

router.post("/delete/:noteId", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    req.params.noteId = parseInt(req.params.noteId);
    let note = new Note({ nid: req.params.noteId });
    await note.DeleteByUser(req.session.user.uid);
    res.redirect("/");
  }
});

router.post("/delete/:noteId", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    req.params.noteId = parseInt(req.params.noteId);
    let note = new Note({ nid: req.params.noteId });
    await note.DeleteByUser(req.session.user.uid);
    res.redirect("/");
  }
});

module.exports = router;
