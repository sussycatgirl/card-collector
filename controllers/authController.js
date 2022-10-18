"use strict";

const passport = require("passport");

const User = require("../models/user");

// Display correct page on index GET
exports.index_get = (req, res, next) => {
  res.render("index", { title: "Card Collector" });
};

// Display sign up on GET
exports.signup_get = (req, res, next) => {
  res.render("form-sign-up", { title: "Register" });
};

// Handle sign up on POST
exports.sign_up_post = [
  // Validate and sanitize fields
  body("username", "Must be a valid email address")
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .normalizeEmail()
    .escape(),
  body("password", "Password required").trim().isLength({ min: 1 }),
  body("passConfirm", "Password confirmation must match password")
    .trim()
    .isLength({ min: 1 })
    .custom((value, { req }) => value === req.body.password),

  // Process request after validation/sanitization
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, rerender
      res.render("form-sign-up", {
        title: "Register",
        errors: errors.array()
      });
    }

    try {
      // Check if user exists
      const found_user = await User.find({ username: req.body.username });
      if (found_user.length > 0) {
        return res.render("form-sign-up", {
          title: "Register",
          error: "Email is already in use"
        });
      }

      // Continue registration
      const user = new User({
        creator: null,
        username: req.body.username,
        password: req.body.password
      });

      console.log(user._id);

      user.save((err) => {
        if (err) {
          return next(err);
        }

        // Successful, redirect to login
        res.redirect("/login");
      });
    } catch (err) {
      return next(err);
    }
  }
];

// Handle login on GET
exports.login_get = (req, res, next) => {
  res.render("form-log-in", {
    title: "Log In",
    errors: req.flash("error")
  });
};

// Handle login on POST
exports.login_post = passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true
});

// Handle logout on POST
exports.logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
