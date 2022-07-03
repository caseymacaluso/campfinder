//////// DECLARATIONS ////////////
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

// Connecting express
const app = express();

// Connecting to MongoDB
mongoose.connect("mongodb://localhost:27017/campfinder", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

//EJS Config
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
// Path configuration to find appropriate view file
app.set("views", path.join(__dirname, "views"));

// Parses incoming requests with urlencoded payloads. extended=true allows for things like arrays + objects to be encoded into the URL-encoded format
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // Allows for PUT/PATCH and DELETE requests to take place

///////// ROUTING AND CRUD /////////////

// Home Page
app.get("/", (req, res) => {
  res.render("home");
});

// Shows all listed campgrounds
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// Shows form to create a new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// Posts new campground created with form used in above route
app.post(
  "/campgrounds",
  catchAsync(async (req, res) => {
    if (!req.body.campground)
      throw new ExpressError("Invalid Campground Data", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Show one campground, specified by unique identifier
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);

// Shows form to edit a campground, specified by unique identifier
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

// Updates a campground, specified by unique identifier
app.put(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Removes a campground from the list/database, specified by a unique identifier
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// Add an error handler
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

// Listening on port 3000
app.listen(3000, () => {
  console.log("serving on port 3000");
});
