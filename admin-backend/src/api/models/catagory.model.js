const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Setup schema
var Category = new Schema(
  {
    email: { type: String },
    title: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", Category);
