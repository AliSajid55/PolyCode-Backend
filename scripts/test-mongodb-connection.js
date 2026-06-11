/**
 * Quick MongoDB connection test. Run: npm run db:test
 */
require("dotenv").config();
const mongoose = require("mongoose");
const {
  getMongoUri,
  mongoConnectionHint,
} = require("../src/config/database");

async function main() {
  const uri = getMongoUri();
  if (!uri) {
    console.error(
      "\n❌ MongoDB is not configured.\n   Run: npm run db:setup\n",
    );
    process.exit(1);
  }

  console.log("\nTesting MongoDB connection...\n");

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 20000 });
    console.log(`✅ Connected: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}\n`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    console.error(`   → ${mongoConnectionHint(error)}\n`);
    process.exit(1);
  }
}

main();
