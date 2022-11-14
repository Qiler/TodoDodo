const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("INDEX");
});

module.exports = router;
