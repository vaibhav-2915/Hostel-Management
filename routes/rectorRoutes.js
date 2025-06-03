const express = require("express");
const router = express.Router();
const Complaints = require("../models/complaint");
const { ensureAuthenticated, ensureRector } = require("../config/auth");

// ✅ Feedback Routes
router.get(
  "/complaints",
  ensureAuthenticated,
  ensureRector,
  async (req, res) => {
    try {
      const feedbacks = await Complaints.find();
      res.render("dashboard/rector/complaints", { feedbacks });
    } catch (error) {
      console.error("Error loading feedbacks:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post(
  "/complaints/delete/:id",
  ensureAuthenticated,
  ensureRector,
  async (req, res) => {
    try {
      await Complaints.findByIdAndDelete(req.params.id);
      res.redirect("/rector/complaints");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
