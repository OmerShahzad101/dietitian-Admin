const mongoose = require('mongoose');

/**
 * Category Schema
 * @private
 */
const ServicesSchema = new mongoose.Schema(
    {
        name: { 
            type: String
        },
        description: {
            type: String 
        },
        logo: { 
            type: String
        },
        status: { 
            type: Boolean, 
            default: true, 
            required: true 
        },
    }, 
    { 
        timestamps: true 
    }
);
/**
 * @typedef Services
 */

module.exports = mongoose.model('Services', ServicesSchema);