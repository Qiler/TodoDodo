const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const sharp = require("sharp");

router.post("/change-avatar", async (req, res) => {
  if (!req.session.loggedIn) {
    res.sendStatus(401);
  } else {
    const user = new User(req.session.user);
    const image = req.body.avatar;
    const parts = image.split(";");
    const imageData = parts[1].split(",")[1];

    let avatar = new Buffer.from(imageData, "base64");
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
  }
});

router.post("/change-email", async (req, res) => {
  if (!req.session.loggedIn) {
    res.sendStatus(401);
  } else {
    const user = new User(req.session.user);
    user.UpdateEmail(req.body.email_change);
    req.session.user = user;
    req.session.save();
  }
});

router.post("/change-password", async (req, res) => {
  if (!req.session.loggedIn) {
    res.sendStatus(401);
  } else {
    const user = new User(req.session.user);
    let password = await bcrypt.hash(req.body.password_change, 10);
    user.UpdatePassword(password);
    req.session.user = user;
    req.session.save();
  }
});

module.exports = router;
