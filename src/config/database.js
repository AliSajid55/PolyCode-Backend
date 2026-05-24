const mongoose = require("mongoose");

const DEFAULT_DB_NAME = process.env.MONGODB_DB || "polycode";

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

function normalizeMongoUri(uri = "") {
  const trimmed = uri.trim();
  if (!trimmed) return "";

  // If no database name in path (e.g. ...mongodb.net/?appName=), insert default db.
  if (/\.mongodb\.net\/?\?/.test(trimmed)) {
    return trimmed.replace(/\.mongodb\.net\/?\?/, `.mongodb.net/${DEFAULT_DB_NAME}?`);
  }
  if (/\.mongodb\.net\/?$/.test(trimmed)) {
    return `${trimmed.replace(/\/$/, "")}/${DEFAULT_DB_NAME}`;
  }

  return trimmed;
}

/**
 * Connect to MongoDB (cached for Vercel serverless cold starts).
 * @returns {Promise<import('mongoose').Mongoose|null>}
 */
async function connectToMongoDB() {
  const uri = normalizeMongoUri(process.env.MONGODB_URI);

  if (!uri) {
    console.warn(
      "⚠️  MONGODB_URI not found. Auth and saved progress will not work.",
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
          "Database is not configured. Set MONGODB_URI on the server (Vercel → Environment Variables).",
      });
    }
    return next();
  } catch (error) {
    console.error("MongoDB middleware error:", error.message);
    return res.status(503).json({
      error:
        "Cannot reach MongoDB. In Atlas: Network Access → allow 0.0.0.0/0, then verify MONGODB_URI.",
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
};
