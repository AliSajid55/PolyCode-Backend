const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const progressController = require("./controllers/progressController");
const oopsCppProgressController = require("./controllers/oopsCppProgressController");
const requireAuth = require("../../middleware/requireAuth");

// ── User Auth Routes ─────────────────────────────────────────────────────────

/** POST /api/auth/register */
router.post("/register", userController.register);

/** POST /api/auth/login */
router.post("/login", userController.login);

/** GET /api/auth/me  — returns current user from Bearer token */
router.get("/me", requireAuth, userController.getMe);

/** GET /api/auth/username/:username */
router.get("/username/:username", userController.getUserByUsername);

/** GET /api/auth/user/:id */
router.get("/user/:id", userController.getUserProfile);

/** GET /api/auth/user/:id/avatar — profile picture image */
router.get("/user/:id/avatar", userController.getAvatarImage);

/** PUT /api/auth/user/:id */
router.put("/user/:id", requireAuth, userController.updateProfile);

/** POST /api/auth/user/:id/avatar — cropped image → Google Drive */
router.post(
  "/user/:id/avatar",
  express.json({ limit: "4mb" }),
  requireAuth,
  userController.uploadAvatar,
);

/** POST /api/auth/change-password */
router.post("/change-password", userController.changePasswordHandler);

/** DELETE /api/auth/user/:id */
router.delete("/user/:id", userController.deleteAccount);

// ── Progress Routes ───────────────────────────────────────────────────────────

router.get(
  "/progress/:userId/:language",
  progressController.getLanguageProgress,
);
router.get("/progress/:userId", progressController.getAllProgress);
router.post("/progress/mark-module", progressController.markModuleComplete);
router.post("/progress/mark-document", progressController.markDocumentComplete);
router.post("/progress/bookmark", progressController.toggleBookmark);
router.post("/progress/add-time", progressController.addTimeSpent);
router.post(
  "/progress/mark-language-complete",
  progressController.markLanguageComplete,
);
router.get("/progress/dashboard/:userId", progressController.getDashboardStats);

// ── Learn: OOP C++ Progress Routes ───────────────────────────────────────────

router.get(
  "/learn/oops-cpp/progress",
  requireAuth,
  oopsCppProgressController.getProgress,
);
router.post(
  "/learn/oops-cpp/progress/last-lesson",
  requireAuth,
  oopsCppProgressController.setLastLesson,
);
router.post(
  "/learn/oops-cpp/progress/complete",
  requireAuth,
  oopsCppProgressController.completeLesson,
);
router.post(
  "/learn/oops-cpp/progress/code",
  requireAuth,
  oopsCppProgressController.saveCode,
);
router.post(
  "/learn/oops-cpp/progress/note",
  requireAuth,
  oopsCppProgressController.saveNote,
);
router.post(
  "/learn/oops-cpp/progress/bookmark",
  requireAuth,
  oopsCppProgressController.toggleBookmark,
);
router.post(
  "/learn/oops-cpp/progress/time",
  requireAuth,
  oopsCppProgressController.addTime,
);

module.exports = router;
