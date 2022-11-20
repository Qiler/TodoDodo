const createError = require("http-errors");
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
//const SQLiteStore = require("connect-sqlite3")(session);
const bodyParser = require("body-parser");
const secret = process.env.TODODODO_SECRET || "Lv40&1H8Qfu4Su*mHw!s67I$Qa1R2IgR";
const path = require("path");

if (process.env.NODE_ENV != undefined) console.log("Environment: " + process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  //require("dotenv").config();
  const logger = require("morgan");
  app.use(logger("dev"));
}

app.set("view engine", "ejs");
app.set("views", "./views");

app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 3 },
    //store: new SQLiteStore({ db: "sessions.db", dir: "./" }),
  })
);
/* app.use((req, res, next) => {
  // Redirect when not logged in.
}); */

app.use("/", require("./routes/index"));
app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));
app.use("/register", require("./routes/register"));
app.use("/note", require("./routes/note"));
app.use("/task", require("./routes/task"));
//app.use("/api", require("./routes/api"));

app.listen(process.env.PORT || 3000);
