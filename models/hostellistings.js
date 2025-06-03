const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // Faster search by name
    },
    room_occupancy: {
      type: String,
      required: true,
    },
    room_type: {
      // Renamed from "model" for clarity
      type: String,
      required: true,
      trim: true,
    },
    ac_rooms: {
      type: String,
      enum: ["yes", "no"], // Only allow "yes" or "no"
      required: true, // Ensure it's always specified
    },
    price: {
      type: Number,
      required: true,
      min: 1, // Price should be a valid positive number
    },
    description: {
      type: String,
      default: null,
      trim: true,
    },
    images: {
      type: [String],
      validate: {
        validator: (val) => val.length <= 5,
        message: "Exceeds the limit of 5 images",
      },
    },
  },
  { timestamps: true } // Automatically creates createdAt & updatedAt
);

module.exports = mongoose.model("Hostel", hostelSchema);
