const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 8000,
    },
  },
  { timestamps: true },
);

const assistantConversationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 128,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  { timestamps: true },
);

assistantConversationSchema.index({ sessionId: 1, userId: 1 });

module.exports = mongoose.model(
  "AssistantConversation",
  assistantConversationSchema,
);
