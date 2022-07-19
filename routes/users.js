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

router.route("/register").get(userRegisterForm).post(catchAsync(registerUser));

router
  .route("/login")
  .get(userLoginForm)
  .post(passport.authenticate("local", authOptions), authenticateUser);

router.get("/logout", userLogout);

module.exports = router;
