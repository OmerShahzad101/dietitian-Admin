const mongoose = require("mongoose");

/**
 * ConversationSchema Schema
 * @private
 */
const ConversationSchema = new mongoose.Schema(
  {
    participants : { type: Array, required : true, default: undefined },
  },
  { timestamps: true }
);

/**
 * @typedef ConversationSchema
 */

module.exports = mongoose.model("Conversation", ConversationSchema);
