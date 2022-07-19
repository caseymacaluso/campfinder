const express = require("express");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const router = express.Router();
const passport = require("passport");

const authOptions = {
  failureFlash: true,
  failureRedirect: "/login",
};

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      console.log(registeredUser);
      req.flash("success", "Welcome to Campfinder!");
      res.redirect("/campgrounds");
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
    res.redirect("/campgrounds");
  }
);

module.exports = router;
