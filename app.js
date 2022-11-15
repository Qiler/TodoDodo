const createError = require("http-errors");
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
//const SQLiteStore = require("connect-sqlite3")(session);
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
//const apiRouter = require("./routes/api");
const loginRouter = require("./routes/login");
const secret = process.env.TODODODO_SECRET || "Lv40&1H8Qfu4Su*mHw!s67I$Qa1R2IgR";
const db = require("./modules/db");

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
app.use(express.static("public"));
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 3 },
    //store: new SQLiteStore({ db: "sessions.db", dir: "./" }),
  })
);
app.use("/", indexRouter);
app.use("/login", loginRouter);
//app.use("/api", apiRouter);

app.listen(process.env.PORT || 3000);
