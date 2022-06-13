const mongoose = require('mongoose');
/**
 * Settings Schema
 * @private
 */
const SettingsSchema = new mongoose.Schema({
    email: { type: String, default: '' },
    mobile: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    discord: { type: String, default: '' },
    twitter: { type: String, default: '' },
    telegram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    desc: { type: String, default: '' },
    domain: { type: String, default: '' },
    api: { type: String, default: '' },
}, { timestamps: true }
);
/**
 * @typedef Settings
 */
module.exports = mongoose.model('Settings', SettingsSchema);