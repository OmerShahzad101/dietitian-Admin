const mongoose = require('mongoose');

/**
 * UsersMemberships Schema
 * @private
 */
const UsersMembershipsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    type:{ type:Number}, // 1 Member and 3 Coach
    membershipId: { type: mongoose.Schema.Types.ObjectId, ref: "membership" },
    membershipData : {},
    status: { type: Boolean, required: true, default: true},
}, { timestamps: true }
);

/**
 * @typedef UsersMemberships
 */

module.exports = mongoose.model('UsersMemberships', UsersMembershipsSchema);