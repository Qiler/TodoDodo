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
    console.log(req.body);
    let dbUser = await users.GetByUsername(req.body.username);
    if (dbUser?.username != undefined) {
      throw "Username already in use.";
    }

    dbUser = await users.GetByEmail(req.body.email);
    if (dbUser?.email != undefined) {
      throw "Email already in use.";
    }

    let password = await bcrypt.hash(req.body.password, 10);

    console.log(req.body.username, req.body.email, password);
    await users.AddUser(req.body.username, req.body.email, password);
    dbUser = await users.GetByUsername(req.body.username);
    if (dbUser?.username == undefined) {
      throw "Failed crating user.";
    }

    let user = new User(dbUser);
    if (user != undefined) {
      req.session.regenerate(function (err) {
        if (err) next(err);
        req.session.loggedIn = true;
        req.session.user = user;
        req.session.save(function (err) {
          if (err) return next(err);
          res.redirect("/");
        });
      });
    } else {
      throw "Automatic login failed.";
    }
  } catch (err) {
    console.error(err);
    res.render("register", { errorMessage: err, formInput: { username: req.body.username, email: req.body.email } });
  }
});

module.exports = router;
