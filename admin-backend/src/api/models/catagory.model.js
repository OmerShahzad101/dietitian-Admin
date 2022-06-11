const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Setup schema
var Category = new Schema({

    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        lowercase: true,
        minlength: 6,
        maxlength: 70,
        required: 'Email Invalid'
      },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
      },
}, {
    timestamps: true,
});


module.exports = mongoose.model('Category', Category);