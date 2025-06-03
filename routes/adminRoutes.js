const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const MessMenu = require("../models/messmenu");
const Feedback = require("../models/feedback");
const Notification = require("../models/notification");
const { ensureAuthenticated, ensureAdmin } = require("../config/auth");

// ✅ Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure Multer for mess menu uploads
const messStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/uploads/mess");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const messUpload = multer({ storage: messStorage });

// ✅ Mess Menu Routes
router.get("/mess-menu", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    let menu = (await MessMenu.findOne()) || {
      breakfast: "",
      lunch: "",
      dinner: "",
      file: "",
    };
    res.render("dashboard/admin/messMenu", { menu });
  } catch (error) {
    console.error("Error loading mess menu:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/mess-menu",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    try {
      const { breakfast, lunch, dinner } = req.body;
      await MessMenu.findOneAndUpdate(
        {},
        { breakfast, lunch, dinner },
        { upsert: true, new: true }
      );
      res.redirect("/admin/mess-menu");
    } catch (error) {
      console.error("Error updating mess menu:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post(
  "/mess-menu/upload",
  ensureAuthenticated,
  ensureAdmin,
  messUpload.single("menuFile"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).send("File upload failed");

      await MessMenu.findOneAndUpdate(
        {},
        { file: `/uploads/mess/${req.file.filename}` },
        { upsert: true, new: true }
      );
      res.redirect("/admin/mess-menu");
    } catch (error) {
      console.error("Error uploading mess menu file:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post(
  "/mess-menu/delete",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    try {
      const menu = await MessMenu.findOne();
      if (menu && menu.file) {
        const filePath = path.join(__dirname, "../public", menu.file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        await MessMenu.findOneAndUpdate({}, { file: "" });
      }
      res.redirect("/admin/mess-menu");
    } catch (error) {
      console.error("Error deleting mess menu file:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ✅ Feedback Routes
router.get("/feedbacks", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.render("dashboard/admin/feedbacks", { feedbacks });
  } catch (error) {
    console.error("Error loading feedbacks:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/feedbacks/delete/:id",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    try {
      await Feedback.findByIdAndDelete(req.params.id);
      res.redirect("/admin/feedbacks");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ✅ Configure Multer for notification uploads
const notificationStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const notificationDir = path.join(
      __dirname,
      "../public/uploads/notifications"
    );
    if (!fs.existsSync(notificationDir)) {
      fs.mkdirSync(notificationDir, { recursive: true });
    }
    cb(null, notificationDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const notificationUpload = multer({ storage: notificationStorage });

// ✅ Notification Routes
router.get(
  "/notifications",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    try {
      const notifications = await Notification.find().sort({ createdAt: -1 });
      res.render("dashboard/admin/admin_notification_form", { notifications });
    } catch (error) {
      console.error("Error loading notifications:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post(
  "/notifications",
  ensureAuthenticated,
  ensureAdmin,
  notificationUpload.single("notificationFile"),
  async (req, res) => {
    try {
      const { title, message } = req.body;
      const filePath = req.file
        ? `/uploads/notifications/${req.file.filename}`
        : null;

      await Notification.create({ title, message, file: filePath });
      res.redirect("/admin/notifications");
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get(
  "/notifications/edit/:id",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    try {
      const notification = await Notification.findById(req.params.id);
      if (!notification) return res.status(404).send("Notification not found");

      res.render("dashboard/admin/edit_notification", { notification });
    } catch (error) {
      console.error("Error fetching notification for editing:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post(
  "/notifications/edit/:id",
  ensureAuthenticated,
  ensureAdmin,
  notificationUpload.single("notificationFile"),
  async (req, res) => {
    try {
      const { title, message } = req.body;
      let updatedData = { title, message };

      if (req.file) {
        updatedData.file = `/uploads/notifications/${req.file.filename}`;
      }

      await Notification.findByIdAndUpdate(req.params.id, updatedData);
      res.redirect("/admin/notifications");
    } catch (error) {
      console.error("Error updating notification:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post(
  "/notifications/delete/:id",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    try {
      const notification = await Notification.findById(req.params.id);
      if (!notification) return res.status(404).send("Notification not found");

      if (notification.file) {
        const filePath = path.join(__dirname, "../public", notification.file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await Notification.findByIdAndDelete(req.params.id);
      res.redirect("/admin/notifications");
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
