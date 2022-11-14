const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("API");
});

router.put("/user/new", async (req, res) => {
  res.send("API");
});

module.exports = router;
