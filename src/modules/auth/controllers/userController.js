const userService = require("../services/userService");
const {
  uploadProfileImage,
  isDriveConfigured,
  streamDriveFile,
} = require("../../../services/googleDriveService");
const { signAccessToken } = require("../../../utils/jwt");

/**
 * Helper: create a signed JWT for a user
 */
function createToken(userId) {
  return signAccessToken(userId);
}

/**
 * POST /api/auth/register - Register a new user
 */
async function register(req, res) {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ error: "Email, username, and password are required" });
    }

    const user = await userService.registerUser({
      email,
      username,
      password,
      firstName,
      lastName,
    });

    const token = createToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(400).json({ error: error.message });
  }
}

/**
 * POST /api/auth/login - Login user
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userService.loginUser(email, password);
    const token = createToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(401).json({ error: error.message });
  }
}

/**
 * GET /api/auth/user/:id - Get user by ID
 */
async function getUserProfile(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error.message);
    res.status(404).json({ error: error.message });
  }
}

/**
 * GET /api/auth/username/:username - Get public user profile by username
 */
async function getUserByUsername(req, res) {
  try {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);
    res.json({ user });
  } catch (error) {
    console.error("Get user by username error:", error.message);
    res.status(404).json({ error: error.message });
  }
}

/**
 * GET /api/auth/me - Get current user from JWT (requireAuth sets req.userId)
 */
async function getMe(req, res) {
  try {
    const user = await userService.getUserById(req.userId);
    res.json({ user });
  } catch (error) {
    console.error("Get me error:", error.message);
    res.status(404).json({ error: error.message || "User not found" });
  }
}

function assertSelfOrThrow(req, targetUserId) {
  if (!req.userId || String(req.userId) !== String(targetUserId)) {
    const err = new Error("You can only edit your own profile");
    err.statusCode = 403;
    throw err;
  }
}

function stripProtectedFields(body = {}) {
  const { email, password, _id, ...rest } = body;
  return rest;
}

function extractDriveFileIdFromUrl(url = "") {
  const byQuery = url.match(/[?&]id=([^&]+)/);
  if (byQuery) return byQuery[1];
  const byPath = url.match(/\/d\/([^/]+)/);
  if (byPath) return byPath[1];
  return null;
}

/**
 * PUT /api/auth/user/:id - Update user profile (email cannot be changed)
 */
async function updateProfile(req, res) {
  try {
    const { id } = req.params;
    assertSelfOrThrow(req, id);
    const updateData = stripProtectedFields(req.body);
    const user = await userService.updateUserProfile(id, updateData);
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res
      .status(error.statusCode || 400)
      .json({ error: error.message });
  }
}

/**
 * POST /api/auth/user/:id/avatar - Upload cropped profile picture to Google Drive
 * Body: { imageBase64: "data:image/jpeg;base64,..." }
 */
async function uploadAvatar(req, res) {
  try {
    const { id } = req.params;
    assertSelfOrThrow(req, id);

    if (!isDriveConfigured()) {
      return res.status(503).json({
        error:
          "Profile photo upload is not configured. Set GOOGLE_DRIVE_CREDENTIALS_PATH (or CLIENT_EMAIL + PRIVATE_KEY) and GOOGLE_DRIVE_FOLDER_ID in backend .env, then restart the server.",
      });
    }

    const { imageBase64 } = req.body;
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({ error: "imageBase64 is required" });
    }

    const match = imageBase64.match(
      /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/i,
    );
    if (!match) {
      return res
        .status(400)
        .json({ error: "Invalid image. Use JPEG, PNG, or WebP." });
    }

    const mimeType = match[1].toLowerCase();
    const buffer = Buffer.from(match[2], "base64");

    if (buffer.length > 2 * 1024 * 1024) {
      return res.status(400).json({ error: "Image must be under 2 MB" });
    }

    const ext = mimeType.includes("png")
      ? "png"
      : mimeType.includes("webp")
        ? "webp"
        : "jpg";
    const fileName = `polycode-avatar-${id}-${Date.now()}.${ext}`;

    const { url, fileId } = await uploadProfileImage({
      buffer,
      mimeType,
      fileName,
    });

    const user = await userService.setProfilePicture(id, {
      url,
      driveFileId: fileId,
    });

    res.json({
      message: "Profile picture uploaded",
      user,
      profilePicture: url,
    });
  } catch (error) {
    console.error("Upload avatar error:", error.message);
    res
      .status(error.statusCode || 400)
      .json({ error: error.message });
  }
}

/**
 * GET /api/auth/user/:id/avatar — stream profile image (fixes Drive hotlink blocks)
 */
async function getAvatarImage(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user.profilePictureDriveId && !user.profilePicture) {
      return res.status(404).json({ error: "No profile picture" });
    }

    const driveFileId =
      user.profilePictureDriveId ||
      extractDriveFileIdFromUrl(user.profilePicture);

    if (driveFileId) {
      const { stream, mimeType } = await streamDriveFile(driveFileId);
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Cache-Control", "public, max-age=3600");
      stream.pipe(res);
      return;
    }

    return res.redirect(user.profilePicture);
  } catch (error) {
    console.error("Avatar image error:", error.message);
    res.status(404).json({ error: "Could not load profile picture" });
  }
}

/**
 * POST /api/auth/change-password - Change user password
 */
async function changePasswordHandler(req, res) {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "userId, oldPassword, and newPassword are required" });
    }

    const user = await userService.changePassword(
      userId,
      oldPassword,
      newPassword,
    );
    res.json({ message: "Password changed successfully", user });
  } catch (error) {
    console.error("Change password error:", error.message);
    res.status(400).json({ error: error.message });
  }
}

/**
 * DELETE /api/auth/user/:id - Delete user account
 */
async function deleteAccount(req, res) {
  try {
    const { id } = req.params;
    const result = await userService.deleteUserAccount(id);
    res.json(result);
  } catch (error) {
    console.error("Delete account error:", error.message);
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  register,
  login,
  getMe,
  getUserProfile,
  getUserByUsername,
  updateProfile,
  uploadAvatar,
  getAvatarImage,
  changePasswordHandler,
  deleteAccount,
};
