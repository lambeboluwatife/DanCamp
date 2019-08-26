const express     = require('express'),
      app         = express(),
      bodyParser  = require('body-parser'),
      mongoose    = require('mongoose'),
      Campground  = require("./models/campground"),
      Comment     = require("./models/comment"),
      seedDB      = require("./seeds");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/DanCamp", {useNewUrlParser: true});
seedDB();


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
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

//NEW - Show form to create new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new.ejs")
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
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      // render show template with that campground
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// ============================
// COMMENTS ROUTES
// ============================

app.get("/campgrounds/:id/comments/new", (req, res) => {
  // find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
        res.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", (req, res) => {
  // lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
      if (err) {
        console.log(err);
        res.redirect("/campgrounds");
      } else {
        Comment.create(req.body.comment, (err, comment) => {
          if (err) {
            console.log(err);
          } else {
            campground.comments.push(comment);
            campground.save();
            res.redirect("/campgrounds/" + campground._id);
          }
        });
      }
    });
  // create new comment
  // connect new comment to campground
  // redirect campground show page
});

app.listen(3000, () => {
  console.log("The Dan Camp server has started");
});
