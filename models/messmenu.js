const mongoose = require("mongoose");

const messMenuSchema = new mongoose.Schema({
    breakfast: { type: String, default: "" },
    lunch: { type: String, default: "" },
    dinner: { type: String, default: "" },
    file: { type: String, default: "" } // Stores the uploaded PDF/image path
});

// Prevent model recompilation
const MessMenu = mongoose.models.MessMenu || mongoose.model("MessMenu", messMenuSchema);

module.exports = MessMenu;
