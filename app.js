require("dotenv").config();
const express = require("express");
const app = express();
const initializePassport = require("./passport-config");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
require("./dbConfig/config");

initializePassport(passport);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view-engine", "ejs");
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());
app.use(methodOverride("_method"));

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { username: req.user.name });
});

app.get("/login", checkNotauthenticated, (req, res) => {
  res.render("login.ejs");
});
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

app.delete("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotauthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(process.env.PORT, () => {
  console.log(`Server runing on port ${process.env.PORT}`);
});
