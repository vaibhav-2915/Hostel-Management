const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const MessMenu = require("../models/messmenu");
const Feedback = require("../models/feedback");
const Notification = require("../models/notification");
const Complaints = require("../models/complaint");
const { ensureAuthenticated, ensureStudent } = require("../config/auth");

router.use(
  "/uploads/notifications",
  express.static(path.join(__dirname, "../public/uploads/notifications"))
);

// ✅ Ensure Feedback Upload Directory Exists
const feedbackUploadDir = path.join(__dirname, "../public/uploads/feedback");
if (!fs.existsSync(feedbackUploadDir)) {
  fs.mkdirSync(feedbackUploadDir, { recursive: true });
}

// ✅ Set up Multer for feedback image uploads
const storage = multer.diskStorage({
  destination: feedbackUploadDir,
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// ✅ Get Mess Menu Page (🔒 Students Only)
router.get(
  "/mess-menu",
  ensureAuthenticated,
  ensureStudent,
  async (req, res) => {
    try {
      const menu = await MessMenu.findOne();
      res.render("dashboard/student/messMenu", { menu });
    } catch (error) {
      console.error("Error fetching mess menu:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ✅ Get Feedback Form (🔒 Students Only)
router.get("/feedback", ensureAuthenticated, ensureStudent, (req, res) => {
  res.render("dashboard/student/feedback");
});

// ✅ Get Feedback Form (🔒 Students Only)
router.get(
  "/complaints",
  ensureAuthenticated,
  ensureStudent,
  async (req, res) => {
    try {
      const complaints = await Complaints.find(); // Fetch all complaints from DB
      res.render("dashboard/student/complaints", { complaints }); // Pass complaints to the EJS template
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

// ✅ Submit Feedback (🔒 Students Only)
router.post(
  "/feedback",
  ensureAuthenticated,
  ensureStudent,
  upload.single("feedbackImage"),
  async (req, res) => {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const { name, email, phone, hostel, description } = req.body;
    const feedbackImage = req.file
      ? `/uploads/feedback/${req.file.filename}`
      : "";

    if (!description) {
      return res.status(400).send("Description is required");
    }

    try {
      const newFeedback = await Feedback.create({
        name,
        email,
        phone,
        hostel,
        description,
        image: feedbackImage,
      });
      console.log("Feedback Saved:", newFeedback);
      res.redirect("/student/feedback");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ✅ Submit Feedback (🔒 Students Only)
router.post(
  "/complaints",
  ensureAuthenticated,
  ensureStudent,
  upload.single("feedbackImage"),
  async (req, res) => {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const { name, email, phone, enrollment, hostel, description } = req.body;
    const feedbackImage = req.file
      ? `/uploads/feedback/${req.file.filename}`
      : "";

    if (!description) {
      return res.status(400).send("Description is required");
    }

    try {
      const newComplaint = await Complaints.create({
        name,
        email,
        phone,
        enrollment,
        hostel,
        description,
        image: feedbackImage,
      });
      console.log("Feedback Saved:", newComplaint);
      res.redirect("/student/complaints");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ✅ Get Notifications (🔒 Students Only)
router.get(
  "/notifications",
  ensureAuthenticated,
  ensureStudent,
  async (req, res) => {
    try {
      const notifications = await Notification.find().sort({ createdAt: -1 });
      res.render("dashboard/student/notifications", { notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
