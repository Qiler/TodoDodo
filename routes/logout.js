const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    req.session.destroy();
    res.redirect("/login");
  }
});

module.exports = router;
