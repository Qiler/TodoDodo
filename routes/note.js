const express = require("express");
const router = express.Router();
const User = require("../models/User");
const UserDTO = require("../models/UserDTO");
const Note = require("../models/Note");
const Task = require("../models/Task");

router.post("/create", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    let user = new User(req.session.user);
    await user.CreateNote("Todo");
    res.redirect("/");
  }
});

router.post("/editname/:noteId", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    req.params.noteId = parseInt(req.params.noteId);
    let note = new Note({ nid: req.params.noteId });
    await note.ChangeTitleByUser(req.session.user.uid, req.body.name);
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

router.post("/removeaccess", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    req.params.noteid = parseInt(req.params.noteid);
    req.params.userid = parseInt(req.params.userid);
    let note = new Note({ nid: req.params.noteid });
    await note.RemoveAccess(req.params.userid);
    res.redirect("/");
  }
});

router.post("/share/:noteId", async (req, res) => {
  console.log(req.params);
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    let user = new UserDTO({});
    await user.FindByName(req.body.user);
    req.params.noteId = parseInt(req.params.noteId);
    let note = new Note({ nid: req.params.noteId });
    console.log(note);
    await note.ShareWith(req.session.user.uid, user.uid);
    res.redirect("/");
  }
});

module.exports = router;
