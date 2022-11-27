const express = require("express");
const router = express.Router();
const User = require("../models/User");
const UserDTO = require("../models/UserDTO");
const Note = require("../models/Note");

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

router.post("/editcolor/:noteId", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    req.params.noteId = parseInt(req.params.noteId);
    let note = new Note({ nid: req.params.noteId });
    await note.ChangeColorByUser(req.session.user.uid, req.body.color);
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

router.post("/removeaccess/:noteId", async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    req.params.noteId = parseInt(req.params.noteId);
    req.body.userid = parseInt(req.body.userid);
    let note = new Note({ nid: req.params.noteId });
    await note.RemoveAccess(req.session.user.uid, req.body.userid);
    res.redirect("/");
  }
});

router.post("/share/:noteId", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    let user = new UserDTO({});
    await user.FindByName(req.body.user);
    if (!user.uid){
      res.sendStatus(400);
    } else {
      req.params.noteId = parseInt(req.params.noteId);
      let note = new Note({ nid: req.params.noteId });
      await note.ShareWith(req.session.user.uid, user.uid);
      res.json({user});
    }
  }
});

module.exports = router;
