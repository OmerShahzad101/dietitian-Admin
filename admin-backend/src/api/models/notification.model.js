const mongoose = require('mongoose');

/**
 * Category Schema
 * @private
 */
const NotificationSchema = new mongoose.Schema(
    {
        to: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users" 
        },
        type: { 
            type: Number,
            default: 1 
        }, // example 
        // 1 = Appointment, 
        // 2 = Booking Reminder, 
        // 3 = Messages, 
        // 4 = Package Expire, 
        // 5 = Invitation Accepted,  
        // 6 = Withdraw
        // 7 = Review
        content: {
            type: String
        },
        isRead: {
            type: Boolean
        }
    }, 
    { 
        timestamps: true 
    }
);
/**
 * @typedef Notifications
 */

module.exports = mongoose.model('notifications', NotificationSchema);