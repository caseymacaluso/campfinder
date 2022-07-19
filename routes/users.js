const express = require("express");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const router = express.Router();
const passport = require("passport");

const authOptions = {
  failureFlash: true,
  failureRedirect: "/login",
  keepSessionInfo: true,
};

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Campfinder!");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", authOptions),
  (req, res) => {
    req.flash("success", `Welcome back, ${req.body.username}!`);
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
