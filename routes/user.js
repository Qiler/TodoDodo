const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const UserRepo = require("../repos/UserRepository");
const users = new UserRepo(db);
const sharp = require("sharp");

router.use((req, res, next) => {
  if (!req.session.loggedIn) {
    return res.sendStatus(401);
  } else {
    next();
  }
});

router.post("/change-avatar", async (req, res) => {
  const user = new User(req.session.user);
  if (!req.body.avatar) {
    return res.status(400).json({ error: "Image cannot be blank." });
  }
  const image = req.body.avatar;
  const parts = image.split(";");
  let imageData = parts[1]?.split(",")[1];
  if (!imageData) {
    return res.status(400).json({ error: "Invalid image format." });
  }

  let avatar = new Buffer.from(imageData, "base64");
  try {
    await sharp(avatar)
      .resize({ width: 128, height: 128 })
      .toBuffer()
      .then(async (resizedImageBuffer) => {
        let resizedImageData = resizedImageBuffer.toString("base64");
        await user.UpdateAvatar(resizedImageData);
        req.session.user.avatar = resizedImageData;
        req.session.save();
        res.sendStatus(200);
      });
  } catch {
    return res.status(400).json({ error: "Malformed or unsuported image." });
  }
});

router.post("/change-email", async (req, res) => {
  if (!req.body.email_change) {
    return res.status(400).json({ error: "Email cannot be blank." });
  }

  if (!req.body.email_change.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: "Invalid Email format." });
  }

  const dbUser = await users.GetByEmail(req.body.email_change);
  if (dbUser) {
    return res.status(406).json({ error: "Email already in use." });
  }

  const user = new User(req.session.user);
  user.UpdateEmail(req.body.email_change);
  req.session.user = user;
  req.session.save();
  res.sendStatus(201);
});

router.post("/change-password", async (req, res) => {
  if (!req.body.password_change) {
    return res.status(400).json({ error: "Password cannot be blank." });
  }
  const user = new User(req.session.user);
  let password = await bcrypt.hash(req.body.password_change, 10);
  user.UpdatePassword(password);
  req.session.user = user;
  req.session.save();
  res.sendStatus(200);
});

module.exports = router;
