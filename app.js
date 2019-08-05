const express     = require('express'),
      app         = express(),
      bodyParser  = require('body-parser'),
      mongoose    = require('mongoose');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/DanCamp", {useNewUrlParser: true});


// Schema Setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Granite Hill",
//     image: "https://pixabay.com/get/54e6d0434957a514f6da8c7dda793f7f1636dfe2564c704c732b7bdc9449c251_340.jpg",
//     description: "This is a huge granite hill, no bathrooms, no water, Beautiful granite!"
//   }, (err, campground) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("NEWLY CREATED CAMPGROUND: ");
//       console.log(campground);
//     }
//   }
// );


app.get("/", (req, res) => {
  res.render("landing");
});

//INDEX - Show all Campgrounds
app.get("/campgrounds", (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {campgrounds: allCampgrounds});
    }
  });
});

//NEW - Show form to create new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("new.ejs")
});

// CREATE - Create new campground
app.post("/campgrounds", (req, res) => {
  // get data from form and add to campgrounds array
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let newCampground = {name: name, image: image, description: desc}
  //  Create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // redirect bact to campgrounds page
      res.redirect("/campgrounds")
    }
  });
});

// SHOW - Show more info about one campground
app.get("/campgrounds/:id", (req, res) => {
  // Find the campground with provided ID
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      // render show template with that campground
      res.render("show", {campground: foundCampground});
    }
  });
});

app.listen(3000, () => {
  console.log("The Dan Camp server has started");
});
