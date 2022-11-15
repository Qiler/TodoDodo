const express = require("express");
const router = express.Router();
const db = require("../modules/db");

router.get("/", (req, res) => {
  console.log(req.session.loggedIn);
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    res.send(`Welcome back ${req.session.user}`);
  }
});

module.exports = router;
