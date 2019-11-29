const express        = require('express'),
      app            = express(),
      bodyParser     = require('body-parser'),
      mongoose       = require('mongoose'),
      flash          = require('connect-flash'),
      Campground     = require("./models/campground"),
      Comment        = require("./models/comment"),
      passport       = require('passport'),
      LocalStrategy  = require('passport-local'),
      methodOverride = require('method-override');
      User           = require('./models/user'),
      seedDB         = require("./seeds");

// Requiring Routes
const commentRoutes     = require("./routes/comments"),
      campgroundRoutes  = require("./routes/campgrounds"),
      indexRoutes       = require("./routes/index");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/DanCamp", {useNewUrlParser: true});
// seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Dani is great",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000, () => {
  console.log("The DanCamp server has started");
});
