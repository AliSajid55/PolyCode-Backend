const AssistantConversation = require("../models/AssistantConversation");
const { buildSystemPrompt } = require("../assistantSystemPrompt");
const { generateAssistantReply } = require("./groqService");

const MAX_HISTORY_MESSAGES = 10;
const MAX_STORED_MESSAGES = 50;

function normalizeHistory(history = []) {
  if (!Array.isArray(history)) return [];

  return history
    .filter((entry) => entry && typeof entry.content === "string")
    .map((entry) => ({
      role: entry.role === "assistant" ? "assistant" : "user",
      content: entry.content.trim(),
    }))
    .filter((entry) => entry.content.length > 0)
    .slice(-MAX_HISTORY_MESSAGES);
}

function sanitizeContext(context) {
  if (!context || typeof context !== "object") return {};
  const allowed = [
    "mode",
    "page",
    "route",
    "language",
    "course",
    "lessonId",
    "lessonTitle",
    "chapter",
    "tab",
    "code",
    "error",
    "challengeDescription",
  ];
  const out = {};
  for (const key of allowed) {
    if (context[key] != null && String(context[key]).trim()) {
      out[key] = String(context[key]).slice(0, key === "code" ? 4000 : 2000);
    }
  }
  return out;
}

function buildGroqMessages(history, userMessage, context = {}) {
  const messages = [
    { role: "system", content: buildSystemPrompt(sanitizeContext(context)) },
  ];

  for (const entry of history) {
    messages.push({ role: entry.role, content: entry.content });
  }

  messages.push({ role: "user", content: userMessage });
  return messages;
}

async function findOrCreateConversation(sessionId, userId) {
  let conversation = await AssistantConversation.findOne({ sessionId });

  if (!conversation) {
    conversation = new AssistantConversation({
      sessionId,
      userId: userId || null,
      messages: [],
    });
    await conversation.save();
    return conversation;
  }

  if (userId && !conversation.userId) {
    conversation.userId = userId;
    await conversation.save();
  }

  return conversation;
}

async function sendAssistantMessage({
  message,
  history = [],
  sessionId,
  userId = null,
  context = {},
}) {
  const trimmedMessage = String(message || "").trim();
  if (!trimmedMessage) {
    const err = new Error("Message is required.");
    err.statusCode = 400;
    throw err;
  }

  if (!sessionId) {
    const err = new Error("session_id is required.");
    err.statusCode = 400;
    throw err;
  }

  const normalizedHistory = normalizeHistory(history);
  const groqMessages = buildGroqMessages(
    normalizedHistory,
    trimmedMessage,
    context,
  );
  const reply = await generateAssistantReply(groqMessages);

  const conversation = await findOrCreateConversation(sessionId, userId);
  conversation.messages.push(
    { role: "user", content: trimmedMessage },
    { role: "assistant", content: reply },
  );

  if (conversation.messages.length > MAX_STORED_MESSAGES) {
    conversation.messages = conversation.messages.slice(-MAX_STORED_MESSAGES);
  }

  await conversation.save();

  return {
    success: true,
    response: reply,
    conversationId: conversation._id,
  };
}

async function getConversationBySession(sessionId, userId = null) {
  const conversation = await AssistantConversation.findOne({ sessionId });
  if (!conversation) return null;

  if (
    conversation.userId &&
    userId &&
    String(conversation.userId) !== String(userId)
  ) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  return conversation;
}

async function listUserConversations(userId) {
  return AssistantConversation.find({ userId })
    .sort({ updatedAt: -1 })
    .select("sessionId messages updatedAt createdAt")
    .limit(50);
}

async function clearConversation(sessionId, userId = null) {
  const conversation = await getConversationBySession(sessionId, userId);
  if (!conversation) return false;

  conversation.messages = [];
  await conversation.save();
  return true;
}

module.exports = {
  sendAssistantMessage,
  getConversationBySession,
  listUserConversations,
  clearConversation,
};
