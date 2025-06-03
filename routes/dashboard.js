const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

router.get("/admin", ensureAuthenticated, (req, res) => {
  if (req.user?.role === "admin") {
    res.render("dashboard/admin/admin", { user: req.user });
  } else {
    res.status(403).send("Unauthorized");
  }
});

router.get("/student", ensureAuthenticated, (req, res) => {
  if (req.user?.role === "student") {
    res.render("dashboard/student/student", { user: req.user });
  } else {
    res.status(403).send("Unauthorized");
  }
});

router.get("/rector", ensureAuthenticated, (req, res) => {
  if (req.user?.role === "rector") {
    res.render("dashboard/rector/rector", { user: req.user });
  } else {
    res.status(403).send("Unauthorized");
  }
});

module.exports = router;
