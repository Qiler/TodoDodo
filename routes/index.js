const express = require("express");
const NoteDto = require("../models/NoteDto");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("/login");
  }
  let user = new User(req.session.user);
  let notes = await user.GetNotes();
  for (let i = 0; i < notes.length; i++) {
    notes[i] = new NoteDto(notes[i]);
    await notes[i].Init();
    await notes[i].GetTasks();
  }
  res.render("index", { notes: notes, notesCount: Object.keys(notes).length, user: user });
});

module.exports = router;
