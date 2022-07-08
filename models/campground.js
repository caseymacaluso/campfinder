const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  location: String,
  description: String,
  image: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Middleware to remove all reviews associated with a campground when the campground is deleted
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
