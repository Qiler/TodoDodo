const express = require("express");
const router = express.Router();
const db = require("../modules/db");
const usersRepo = require("../repos/UserRepository");
const users = new usersRepo(db);
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/", async (req, res) => {
  res.render("register");
});

router.post("/submit", async (req, res) => {
  try {
    if (!req.body.username) {
      throw "Invalid Username.";
    }

    if (!req.body.username.match(/^[A-Za-z0-9_-]+$/)) {
      throw "Invalid characters in Username.";
    }

    let dbUser = await users.GetByUsername(req.body.username);
    if (dbUser?.username) {
      throw "Username already in use.";
    }

    if (req.body.email === "" || req.body.email === undefined || req.body.email === null) {
      throw "Invalid Email.";
    }

    if (!req.body.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw "Invalid Email format.";
    }

    dbUser = await users.GetByEmail(req.body.email);
    if (dbUser?.email != undefined) {
      throw "Email already in use.";
    }

    let password = await bcrypt.hash(req.body.password, 10);

    await users.AddUser(req.body.username, req.body.email, password);
    dbUser = await users.GetByUsername(req.body.username);
    if (dbUser?.username == undefined) {
      throw "Failed creating user.";
    }

    let user = new User(dbUser);
    req.session.regenerate(function (err) {
      if (err) next(err);
      req.session.loggedIn = true;
      req.session.user = user;
      req.session.save(function (err) {
        if (err) return next(err);
        res.redirect("/");
      });
    });
  } catch (err) {
    console.error(err);
    res.render("register", { errorMessage: err, formInput: { username: req.body.username, email: req.body.email } });
  }
});

module.exports = router;
