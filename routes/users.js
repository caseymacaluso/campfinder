const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const passport = require("passport");
const {
  userRegisterForm,
  registerUser,
  userLoginForm,
  authenticateUser,
  userLogout,
} = require("../controllers/user");

const authOptions = {
  failureFlash: true,
  failureRedirect: "/login",
  keepSessionInfo: true,
};

router.get("/register", userRegisterForm);

router.post("/register", catchAsync(registerUser));

router.get("/login", userLoginForm);

router.post(
  "/login",
  passport.authenticate("local", authOptions),
  authenticateUser
);

router.get("/logout", userLogout);

module.exports = router;
