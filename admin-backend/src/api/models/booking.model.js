const mongoose = require("mongoose");

/**
 * Booking Schema
 * @private
 */
const BookingSchema = new mongoose.Schema(
  {
    client: { type: mongoose.ObjectId, required: true, ref: "users" },
    coach: { type: mongoose.ObjectId, required: true, ref: "users" },
    slots: { type: String, required: true },
    bookingDate: { type: String },
    meetingLink: { type: String },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

/**
 * @typedef Booking
 */

module.exports = mongoose.model("Booking", BookingSchema);
