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
  if (!req.body.username) {
    return throwError(req, res, "Username cannot be blank.");
  }

  if (!req.body.username.match(/^[A-Za-z0-9_-]+$/)) {
    return throwError(req, res, "Invalid characters in Username.");
  }

  let dbUser = await users.GetByUsername(req.body.username);
  if (dbUser?.username) {
    return throwError(req, res, "Username already in use.");
  }

  if (!req.body.email) {
    return throwError(req, res, "Email cannot be blank.");
  }

  if (!req.body.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return throwError(req, res, "Invalid Email format.");
  }

  dbUser = await users.GetByEmail(req.body.email);
  if (dbUser?.email != undefined) {
    return throwError(req, res, "Email already in use.");
  }

  if (!req.body.password) {
    return throwError(req, res, "Password cannot be blank.");
  }

  if (req.body.password.length() < 6) {
    return throwError(req, res, "Password must be at least 6 characters long.");
  }

  let password = await bcrypt.hash(req.body.password, 10);

  await users.AddUser(req.body.username, req.body.email, password);
  dbUser = await users.GetByUsername(req.body.username);
  if (dbUser?.username == undefined) {
    return throwError(req, res, "Failed creating user.");
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
});

function throwError(req, res, err) {
  res.status(400).render("register", { errorMessage: err, formInput: { username: req.body.username, email: req.body.email } });
}

module.exports = router;
