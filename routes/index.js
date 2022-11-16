const express = require("express");
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
    /*     let stickyDb = await notes.GetByUid(req.session.user.uid);
    stickyDb.forEach(async (note) => {
      note.tasks = await tasks.GetByNid(note.nid);
    }); */
    res.render("index");
  }
});

module.exports = router;
