const chatService = require("../services/chatService");

function handleError(res, error, fallbackStatus = 500) {
  const statusCode = error.statusCode || fallbackStatus;
  const isDev = process.env.NODE_ENV !== "production";
  const isConfigError =
    error.code === "GROQ_NOT_CONFIGURED" ||
    /GROQ_API_KEY is not configured/i.test(error.message || "");

  let message = error.message;
  if (statusCode >= 500 && !isDev && !isConfigError) {
    message =
      "The assistant is temporarily unavailable. Please try again in a moment.";
  }

  return res.status(statusCode).json({ error: message, success: false });
}

async function assistantChat(req, res) {
  try {
    const { message, history = [], session_id: sessionId = "" } = req.body || {};

    const result = await chatService.sendAssistantMessage({
      message,
      history,
      sessionId: String(sessionId).trim(),
      userId: req.userId || null,
    });

    return res.json(result);
  } catch (error) {
    console.error("Assistant chat error:", error.message);
    return handleError(res, error, 502);
  }
}

async function getAssistantSession(req, res) {
  try {
    const sessionId = String(req.params.sessionId || "").trim();
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required." });
    }

    const conversation = await chatService.getConversationBySession(
      sessionId,
      req.userId || null,
    );

    if (!conversation) {
      return res.json({ sessionId, messages: [] });
    }

    return res.json({
      sessionId: conversation.sessionId,
      messages: conversation.messages.map((m) => ({
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      })),
      updatedAt: conversation.updatedAt,
    });
  } catch (error) {
    return handleError(res, error, 400);
  }
}

async function listConversations(req, res) {
  try {
    const conversations = await chatService.listUserConversations(req.userId);
    return res.json({
      conversations: conversations.map((c) => ({
        id: c._id,
        sessionId: c.sessionId,
        messageCount: c.messages.length,
        lastMessage: c.messages[c.messages.length - 1] || null,
        updatedAt: c.updatedAt,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    return handleError(res, error, 400);
  }
}

async function clearAssistantSession(req, res) {
  try {
    const sessionId = String(req.params.sessionId || "").trim();
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required." });
    }

    const cleared = await chatService.clearConversation(
      sessionId,
      req.userId || null,
    );

    if (!cleared) {
      return res.json({ success: true, cleared: false });
    }

    return res.json({ success: true, cleared: true });
  } catch (error) {
    return handleError(res, error, 400);
  }
}

module.exports = {
  assistantChat,
  getAssistantSession,
  listConversations,
  clearAssistantSession,
};
