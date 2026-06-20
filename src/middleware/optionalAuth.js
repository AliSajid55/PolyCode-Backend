const { verifyAccessToken } = require("../utils/jwt");

/**
 * Sets req.userId when a valid Bearer token is present; continues otherwise.
 */
function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = verifyAccessToken(token);
      req.userId = decoded.id;
    }
  } catch {
    /* public endpoint — ignore invalid tokens */
  }
  next();
}

module.exports = optionalAuth;
