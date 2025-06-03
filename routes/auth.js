const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

// Register Page
router.get("/register", (req, res) => res.render("register"));

// Register Handle
router.post("/register", async (req, res) => {
  const { name, email, password, password2, role } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2 || !role)
    errors.push({ msg: "Please fill in all fields" });
  if (password !== password2) errors.push({ msg: "Passwords do not match" });

  if (errors.length > 0) {
    return res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
      role,
    });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      errors.push({ msg: "Email is already registered" });
      return res.render("register", {
        errors,
        name,
        email,
        password,
        password2,
        role,
      });
    }

    const newUser = new User({ name, email, password, role });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();

    req.flash("success_msg", "You are now registered and can log in");
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.redirect("/auth/register");
  }
});

router.get("/login", (req, res) => res.render("login"));

router.post("/login", (req, res, next) => {
  console.log("Login request received:", req.body);

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return next(err);
    }
    if (!user) {
      console.log("Authentication failed:", info);
      req.flash("error_msg", "Invalid credentials");
      return res.redirect("/auth/login");
    }

    console.log("User authenticated:", user);

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }

      console.log("Saving session...");
      req.session.save(() => {
        // Ensure session is saved before redirect
        console.log("Redirecting to dashboard...");
        const redirectUrl =
          user.role === "admin"
            ? "/dashboard/admin"
            : user.role === "student"
            ? "/dashboard/student"
            : "/dashboard/rector";
        res.redirect(redirectUrl);
      });
    });
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  console.log("Logging out user:", req.user);

  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return next(err);
      }

      console.log("Session successfully destroyed.");
      res.clearCookie("connect.sid"); // Remove session cookie

      // ✅ Fix: Redirect immediately after session is destroyed
      return res.redirect("/auth/login");
    });
  });
});

module.exports = router;
