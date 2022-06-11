const mongoose = require("mongoose");
/**
 * ChatSchema Schema
 * @private
 */
const ChatSchema = new mongoose.Schema(
  {
    message : { type: String, required: true },
    senderId: { type: String, required: true },
    // recieverId: { type: String, required: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "conversation" },
  },
  { timestamps: true }
);
/**
 * @typedef ChatSchema
 */
module.exports = mongoose.model("Chat", ChatSchema);
