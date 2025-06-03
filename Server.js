const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
// const dotenv = require("dotenv");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const path = require("path");
const app = express();
const ejsMate = require("ejs-mate");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const rectorRoutes = require("./routes/rectorRoutes");
const listings = require("./routes/listingRoutes");
const {
  ensureAuthenticated,
  ensureAdmin,
  ensureStudent,
  ensureRector,
} = require("./config/auth");
const Listing = require("./models/hostellistings");

// Passport config (⚡ Load before using it)
require("./config/passportConfig")(passport);

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/authDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Fix: Ensure session is set BEFORE using `connect-flash`
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true, // <-- Change from `false` to `true`
    cookie: { secure: false }, // Change to `true` in production with HTTPS
  })
);

// ✅ Initialize Passport session AFTER express-session
app.use(passport.initialize());
app.use(passport.session());

// ✅ Load `connect-flash` AFTER `express-session`
app.use(flash());

// Middleware: Attach user data to templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ✅ Global vars for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Debugging Middleware (Print session & user data)
app.use((req, res, next) => {
  console.log("Session Data:", req.session);
  console.log("User Data:", req.user);
  next();
});

// Set View Engine
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/admin", ensureAuthenticated, ensureAdmin, adminRoutes);
app.use("/student", ensureAuthenticated, ensureStudent, studentRoutes);
app.use("/rector", ensureAuthenticated, ensureRector, rectorRoutes);
app.use("/listings", ensureAuthenticated, ensureAdmin, listings);

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/dashboard", require("./routes/dashboard"));

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/hostelListing", async (req, res) => {
  try {
    const listings = await Listing.find();
    res.render("hostels", { listings });
  } catch (err) {
    res.status(500).send("Error loading listings");
  }
});

// ✅ View a Single Listing (Everyone Can Access)
app.get("/hostel/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).send("Hostel not found");
    res.render("showHostel", { listing });
  } catch (err) {
    res.status(500).send("Error loading hostel");
  }
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
