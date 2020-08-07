var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();
var mongoose = require("mongoose");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');

require("dotenv").config();

//Set up mongoose connection
mongoose.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));



// REQUIRE ROUTES
var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var messageRouter = require("./routes/message");
const passport = require("passport");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// SESSION CONFIGURATION
const mongooseConnection = mongoose.createConnection(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const sessionStore = new MongoStore({ mongooseConnection, collection: 'sessions' })

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
    maxAge: 604800000
  }
}));

// PASSPORT AUTHENTICATION
app.use(flash());
require("./config/passport-config");
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// SET UP ROUTES 
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
