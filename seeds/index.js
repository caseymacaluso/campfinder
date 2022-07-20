const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/campfinder", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randomNum = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "62d602c027c02d04423434bb",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
      geometry: {
        type: "Point",
        coordinates: [cities[randomNum].longitude, cities[randomNum].latitude],
      },
      images: [
        {
          url: "https://res.cloudinary.com/diyqysgbc/image/upload/v1658277462/Campfinder/ivgxwparbrgmoucro5cn.jpg",
          filename: "Campfinder/ivgxwparbrgmoucro5cn",
        },
        {
          url: "https://res.cloudinary.com/diyqysgbc/image/upload/v1658277462/Campfinder/osooeaewjjhzip1poxud.jpg",
          filename: "Campfinder/osooeaewjjhzip1poxud",
        },
      ],
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error est natus consequatur illo porro minima aut deleniti dolores nulla omnis. Excepturi, exercitationem porro facilis atque architecto maxime vel qui tenetur?",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
