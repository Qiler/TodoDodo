const express = require("express");
const router = express.Router();
const db = require("../modules/db");
const usersRepo = require("../repos/UserRepository");
const users = new usersRepo(db);
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/", async (req, res) => {
  res.render("login");
});

router.post("/auth", async (req, res) => {
  try {
    let dbUser = (await users.GetByUsername(req.body.username)).rows[0];
    let user = new User(dbUser);
    console.log(user);
    let loggedIn = await bcrypt.compare(req.body.password, dbUser.password);
    if (loggedIn) {
      req.session.regenerate(function (err) {
        if (err) next(err);
        req.session.loggedIn = true;
        req.session.user = user;
        req.session.save(function (err) {
          if (err) return next(err);
          res.redirect("/");
        });
      });
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
