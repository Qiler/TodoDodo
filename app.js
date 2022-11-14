const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const fs = require("fs");
const bodyParser = require("body-parser");

console.log("Environment: " + process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
  const logger = require("morgan");
  app.use(logger("dev"));
}

fs.open("todododo.db", "w", (err, fd) => {
  if (err) console.error(err);
  if (fd != null) fs.close(fd);
});

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use("/", indexRouter);
app.use("/api", apiRouter);

app.listen(process.env.PORT || 3000);
