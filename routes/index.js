const express = require("express");
const router = express.Router();
const models = require("../models/models");

const User = models.User;

// THE WALL - anything routes below this are protected by our passport (user must be logged in to access these routes)!
router.use(function(req, res, next) {
  if (!req.user) {
    res.redirect("/login");
  } else {
    return next();
  }
});

router.get("/", function(req, res) {
  res.redirect("/users");
});

// BUUBLES
router.get("/users/", function(req, res, next) {
  // Gets all users
  User.find(function(err, data) {
    console.log(data);
    // res.send(data)
    res.render("index", { users: JSON.stringify(data) });
  });
}); //.split('&#x27;').join("'")

router.get("/rooms/:id", function(req, res) {
  User.findById(req.params.id)
    .then(user => {
      res.render("room", {
        user: JSON.stringify(user),
        displayName: user.displayName,
        email: user.email
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;
