const Campground = require("../models/campground");

// Index page that shows all listed campgrounds
const index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

// Shows form to create a new campground
const newCampgroundForm = (req, res) => {
  res.render("campgrounds/new");
};

// Posts new campground
const createNewCampground = async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully created a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

// Shows specific campground, designated by unique ID
const showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Could not find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

// Renders form to edit a specific campground
const editCampgroundForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Could not find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

// Updates campground
const updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash("success", "Updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

// Deletes a specific campground
const deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully removed campground!");
  res.redirect("/campgrounds");
};

module.exports = {
  index,
  newCampgroundForm,
  createNewCampground,
  showCampground,
  editCampgroundForm,
  updateCampground,
  deleteCampground,
};
