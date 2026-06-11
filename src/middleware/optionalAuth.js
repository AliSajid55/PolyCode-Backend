const jwt = require("jsonwebtoken");

/**
 * Sets req.userId when a valid Bearer token is present; continues otherwise.
 */
function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "dev_secret",
      );
      req.userId = decoded.id;
    }
  } catch {
    /* public endpoint — ignore invalid tokens */
  }
  next();
}

module.exports = optionalAuth;
