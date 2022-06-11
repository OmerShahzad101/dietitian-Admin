const mongoose = require("mongoose");

/**
 * Coach Schedule Schema
 * @private
 */
const CoachScheduleSchema = new mongoose.Schema(
  {
    coachId: { type: mongoose.ObjectId, required: true },
    selections: { type: Object, required: true },
  },
  { timestamps: true }
);

/**
 * @typedef CoachSchedule
 */

module.exports = mongoose.model("CoachSchedule", CoachScheduleSchema);
