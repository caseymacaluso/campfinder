const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
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

router
  .route("/")
  .get(catchAsync(index))
  // .post(isLoggedIn, validateCampground, catchAsync(createNewCampground));
  .post(upload.array("image"), (req, res) => {
    console.log(req.body, req.files);
    res.send("Success");
  });

router.get("/new", isLoggedIn, newCampgroundForm);

router
  .route("/:id")
  .get(catchAsync(showCampground))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(editCampgroundForm));

module.exports = router;
