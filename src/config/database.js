const dns = require("dns");
const mongoose = require("mongoose");

const DEFAULT_DB_NAME = process.env.MONGODB_DB || "polycode";
const PLACEHOLDER_URI = "add_your_mongodb_uri_here";

// Router DNS on Windows often refuses SRV lookups required by mongodb+srv:// URIs.
if (process.env.MONGODB_DNS !== "system") {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

function decodeCredential(value = "") {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Re-encode user/password once so special chars in MONGODB_URI work reliably. */
function sanitizeMongoUri(uri = "") {
  const trimmed = uri.trim();
  const match = trimmed.match(/^(mongodb\+srv|mongodb):\/\//);
  if (!match) return trimmed;

  const scheme = match[1];
  const rest = trimmed.slice(match[0].length);
  const atIndex = rest.lastIndexOf("@");
  if (atIndex === -1) return trimmed;

  const auth = rest.slice(0, atIndex);
  const hostAndPath = rest.slice(atIndex + 1);
  const colonIndex = auth.indexOf(":");
  if (colonIndex === -1) return trimmed;

  const user = decodeCredential(auth.slice(0, colonIndex));
  const password = decodeCredential(auth.slice(colonIndex + 1));

  return `${scheme}://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${hostAndPath}`;
}

function buildMongoUriFromParts() {
  const user = process.env.MONGODB_USER?.trim();
  const password = process.env.MONGODB_PASSWORD?.trim();
  const cluster = process.env.MONGODB_CLUSTER?.trim();
  const db = process.env.MONGODB_DB?.trim() || DEFAULT_DB_NAME;

  if (!user || !password || !cluster) return "";

  const host = cluster
    .replace(/^mongodb(\+srv)?:\/\//, "")
    .split("/")[0]
    .split("?")[0];

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);

  return `mongodb+srv://${encodedUser}:${encodedPassword}@${host}/${db}?retryWrites=true&w=majority&authSource=admin`;
}

function getMongoUri() {
  const fromParts = buildMongoUriFromParts();
  if (fromParts) return fromParts;

  const explicit = process.env.MONGODB_URI?.trim() || "";
  if (explicit && !explicit.includes(PLACEHOLDER_URI)) {
    return sanitizeMongoUri(explicit);
  }

  return "";
}

function normalizeMongoUri(uri = "") {
  const trimmed = uri.trim();
  if (!trimmed) return "";

  let normalized = trimmed;

  // If no database name in path (e.g. ...mongodb.net/?appName=), insert default db.
  if (/\.mongodb\.net\/?\?/.test(normalized)) {
    normalized = normalized.replace(
      /\.mongodb\.net\/?\?/,
      `.mongodb.net/${DEFAULT_DB_NAME}?`,
    );
  } else if (/\.mongodb\.net\/?$/.test(normalized)) {
    normalized = `${normalized.replace(/\/$/, "")}/${DEFAULT_DB_NAME}`;
  }

  if (!/authSource=/.test(normalized)) {
    normalized += normalized.includes("?") ? "&authSource=admin" : "?authSource=admin";
  }

  return normalized;
}

function mongoConnectionHint(error) {
  const message = error?.message || "";

  if (/bad auth|authentication failed/i.test(message)) {
    return [
      "Atlas rejected the username or password.",
      "Fix: Atlas → Database Access → Edit user → Edit Password → copy new password.",
      "Then run in backend folder: npm run db:setup",
      "(Use the Database User name, NOT your Atlas login email.)",
    ].join(" ");
  }
  if (/querySrv ECONNREFUSED|ENOTFOUND|ECONNREFUSED/i.test(message)) {
    return "DNS/network blocked Atlas lookup. Allow 0.0.0.0/0 in Atlas → Network Access, or set MONGODB_DNS=system in .env if you fixed Windows DNS.";
  }
  if (/timed out|ETIMEDOUT/i.test(message)) {
    return "Cannot reach Atlas. In Atlas → Network Access, add 0.0.0.0/0 (or your current IP).";
  }

  return "Verify MONGODB_URI or MONGODB_USER/PASSWORD/CLUSTER in backend/.env.";
}

/**
 * Connect to MongoDB (cached for Vercel serverless cold starts).
 * @returns {Promise<import('mongoose').Mongoose|null>}
 */
async function connectToMongoDB() {
  const uri = normalizeMongoUri(getMongoUri());

  if (!uri) {
    console.warn(
      "⚠️  MongoDB not configured. Set MONGODB_URI or MONGODB_USER/PASSWORD/CLUSTER in backend/.env, then run: npm run db:setup",
    );
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 20000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      })
      .then((conn) => {
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("❌ MongoDB Connection Error:", error.message);
        console.error(`   → ${mongoConnectionHint(error)}`);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/**
 * Express middleware — wait for DB before auth/progress routes run.
 */
async function requireMongoConnection(req, res, next) {
  try {
    const conn = await connectToMongoDB();
    if (!conn) {
      return res.status(503).json({
        error:
          "Database is not configured. Set MONGODB_URI or run npm run db:setup in the backend folder.",
      });
    }
    return next();
  } catch (error) {
    console.error("MongoDB middleware error:", error.message);
    return res.status(503).json({
      error: mongoConnectionHint(error),
    });
  }
}

/**
 * Disconnect from MongoDB
 */
async function disconnectFromMongoDB() {
  try {
    cached.conn = null;
    cached.promise = null;
    await mongoose.disconnect();
    console.log("✅ MongoDB Disconnected");
  } catch (error) {
    console.error("❌ Error disconnecting from MongoDB:", error.message);
  }
}

module.exports = {
  connectToMongoDB,
  requireMongoConnection,
  disconnectFromMongoDB,
  getMongoUri,
  mongoConnectionHint,
  sanitizeMongoUri,
};
