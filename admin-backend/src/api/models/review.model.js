const mongoose = require('mongoose');

/**
 * Review Schema
 * @private
 */
 const ReviewSchema = new mongoose.Schema({
    reviewBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true, 
        unique: true 
    },
    reviewTo: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true, 
        unique: true  
    },
    score: { 
        type: Number,
        required: true 
    },
    status: {
        type: Boolean,
    },
    comment: { 
        type: String
    },
    title: { 
        type: String
    }

}, { timestamps: true }
);

/**
 * @typedef Review
 */

module.exports = mongoose.model('Review', ReviewSchema);