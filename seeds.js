const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require("./models/comment")

const data = [
  {
    name: "Cloud's Rest",
    image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name: "Desert Mesa",
    image: "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name: "Canyon Floor",
    image: "https://farm4.staticflickr.com/189/493046463_841a18169e.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
]


function seedDB() {
  // Remove all Campgrounds
  Campground.remove({}, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Removed Campgrounds");
    // add a few campgrounds
    data.forEach((seed) => {
      Campground.create(seed, (err, campground) => {
          if (err) {
            console.log(err);
          } else {
            console.log("added a campground");
            // create a comment
            Comment.create(
              {
                text: "This place is great, but i wish there was internet.",
                author: "Dani"
              }, (err, comment) => {
                if (err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log("created new comment");
                }
              });
          }
      });
    });
  });

}

module.exports = seedDB;
