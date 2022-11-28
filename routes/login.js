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

router.post("/", async (req, res) => {
  if (!req.body.username) {
    return throwError(req, res, "Username cannot be blank.");
  }
  if (!req.body.username) {
    return throwError(req, res, "Password cannot be blank.");
  }

  let dbUser = await users.GetByUsername(req.body.username);
  if (dbUser?.uid == undefined) {
    return throwError(req, res, "Incorrect Username or Password.");
  }

  let user = new User(dbUser);
  let isPasswordCorrect = await bcrypt.compare(req.body.password, dbUser.password);
  if (isPasswordCorrect) {
    req.session.regenerate(function (err) {
      if (err) return next(err);
      req.session.loggedIn = true;
      req.session.user = user;
      req.session.save(function (err) {
        if (err) return next(err);
        res.redirect("/");
      });
    });
  } else {
    return throwError(req, res, "Incorrect Username or Password.");
  }
});

function throwError(req, res, err) {
  res.render("login", { errorMessage: err, formInput: { username: req.body.username } });
}

module.exports = router;
