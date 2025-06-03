const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    hostel: { type: String, required: true },
    description: { type: String, required: true }, // Added description field
    image: { type: String, default: "" } // Stores feedback image path
});

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
