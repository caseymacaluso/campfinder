const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");
const { reviewSchema, campgroundSchema } = require("./schemas");

const isLoggedIn = (req, res, next) => {
  const { id } = req.params;
  if (!req.isAuthenticated()) {
    req.session.returnTo =
      req.query._method === "DELETE" ? `/campgrounds/${id}` : req.originalUrl;
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  next();
};

// Function to do some server side validation on a campground
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have the necessary permissions to do that.");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have the necessary permissions to do that.");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// Function to do server-side validation on reviews
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  validateCampground,
  isAuthor,
  isReviewAuthor,
  validateReview,
};
