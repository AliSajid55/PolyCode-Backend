const express = require("express");
const rateLimit = require("express-rate-limit");
const optionalAuth = require("../../middleware/optionalAuth");
const requireAuth = require("../../middleware/requireAuth");
const chatController = require("./controllers/chatController");

const router = express.Router();

const assistantRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.ASSISTANT_RATE_LIMIT_MAX || 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please wait a moment before sending another message.",
    success: false,
  },
});

router.post(
  "/assistant",
  assistantRateLimit,
  optionalAuth,
  chatController.assistantChat,
);

router.get(
  "/assistant/session/:sessionId",
  optionalAuth,
  chatController.getAssistantSession,
);

router.delete(
  "/assistant/session/:sessionId",
  optionalAuth,
  chatController.clearAssistantSession,
);

router.get("/conversations", requireAuth, chatController.listConversations);

module.exports = router;
