const mongoose = require('mongoose');

/**
 * Category Schema
 * @private
 */
const CmsSchema = new mongoose.Schema({
    name: { type: String },
    content: { type: String },
    status: { type: Boolean, default: true, required: true },
    slug: {
        type: String,
        unique: true
      },
}, { timestamps: true }
);

CmsSchema.pre('save', function(next) {
    this.slug = slugify(this.name);
    next();
});
// function to slugify a name
function slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
}
/**
 * @typedef Cms
 */

module.exports = mongoose.model('CMS', CmsSchema);