const User = require("../models/user");

// Renders the user registration form
const userRegisterForm = (req, res) => {
  res.render("users/register");
};

// Registers the new user, and automatically logs them in
const registerUser = async (req, res, next) => {
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
};

// Renders the user login form (existing users)
const userLoginForm = (req, res) => {
  res.render("users/login");
};

// Authenticates the user, redirects to previous URL or just to the index page
const authenticateUser = (req, res) => {
  req.flash("success", `Welcome back, ${req.body.username}!`);
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// Logs the current user out
const userLogout = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out");
    res.redirect("/campgrounds");
  });
};

module.exports = {
  userRegisterForm,
  registerUser,
  userLoginForm,
  authenticateUser,
  userLogout,
};
