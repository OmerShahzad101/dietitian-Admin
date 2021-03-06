const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Category = require('./category.model');
// Setup schema
var Blog = new Schema({
    
    title: {
        type: String,
        minlength: 3,
        maxlength: 30,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
    email:{
        type: String,
    },
    excerpt:{
        type: String,
    },
    category: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Category', 
    },
    status: { 
        type: Boolean, 
        default: true, 
        required: true 
    },
},
    {
        timestamps: true,
    });


module.exports = mongoose.model('Blog', Blog);