const express = require("express");
const Note = require("../models/Note");
const router = express.Router();
const User = require("../models/User");

router.get("/addnote", async (req, res) => {
  console.log(req.session.user);
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    let user = new User(req.session.user);
    console.log(await user.CreateNote("Smonk all the drugs"));
    res.send("Added note");
  }
});

router.get("/getnotes", async (req, res) => {
  console.log(req.session.user);
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    let user = new User(req.session.user);
    let note = await user.GetNotes();
    console.log(note);
    res.send(note);
  }
});

router.get("/", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    let user = new User(req.session.user);
    let notes = await user.GetNotes();
    notes.forEach(async (note) => {
      note = new Note(note);
      note.tasks = await note.GetTasks();
    });
    console.log(notes);
    res.render("index", { notes: notes, noteNumber: Object.keys(notes).length });
  }
});

module.exports = router;
