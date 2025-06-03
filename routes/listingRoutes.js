const express = require("express");
const Listing = require("../models/hostellistings");
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require("../config/auth");

// ✅ View All Listings (Everyone Can Access)
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find();
    res.render("dashboard/admin/hostels/index", { listings });
  } catch (err) {
    res.status(500).send("Error loading listings");
  }
});

// 🔒 Add New Listing (Admins Only)
router.get("/add", ensureAuthenticated, ensureAdmin, (req, res) => {
  res.render("dashboard/admin/hostels/new");
});

// ✅ View a Single Listing (Everyone Can Access)
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).send("Hostel not found");
    res.render("dashboard/admin/hostels/show", { listing });
  } catch (err) {
    res.status(500).send("Error loading hostel");
  }
});

router.post("/add", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
  } catch (err) {
    res.status(500).send("Error adding hostel");
  }
});

// 🔒 Edit Listing (Admins Only)
router.get("/edit/:id", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).send("Hostel not found");
    res.render("dashboard/admin/hostels/edit", { listing });
  } catch (err) {
    res.status(500).send("Error loading hostel");
  }
});

router.put("/edit/:id", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect(`/listings/${req.params.id}`);
  } catch (err) {
    res.status(500).send("Error updating hostel");
  }
});

// 🔒 Delete Listing (Admins Only)
router.delete("/:id", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
  } catch (err) {
    res.status(500).send("Error deleting hostel");
  }
});

module.exports = router;
