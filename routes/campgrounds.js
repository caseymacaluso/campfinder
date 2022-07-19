const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  index,
  newCampgroundForm,
  createNewCampground,
  showCampground,
  editCampgroundForm,
  updateCampground,
  deleteCampground,
} = require("../controllers/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

router.get("/", catchAsync(index));

router.get("/new", isLoggedIn, newCampgroundForm);

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(createNewCampground)
);

router.get("/:id", catchAsync(showCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(editCampgroundForm));

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(updateCampground)
);

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(deleteCampground));

module.exports = router;
