const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { createReview, deleteReview } = require("../controllers/review");
const { isReviewAuthor, isLoggedIn, validateReview } = require("../middleware");

// Create a review for a specific campground
router.post("/", isLoggedIn, validateReview, catchAsync(createReview));

// Route to delete a specific review listed on a specific campground
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(deleteReview)
);

module.exports = router;
