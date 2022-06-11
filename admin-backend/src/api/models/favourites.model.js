const mongoose = require("mongoose");

/**
 * FavouriteSchema Schema
 * @private
 */
const FavouriteSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true },
    clientFavourite: { type: Object, required: true },
  },
  { timestamps: true }
);

/**
 * @typedef FavouriteSchema
 */

module.exports = mongoose.model("Favourites", FavouriteSchema);
