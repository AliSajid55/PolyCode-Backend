/**
 * Configure MongoDB Atlas credentials in backend/.env and test the connection.
 *
 * Interactive:
 *   npm run db:setup
 *
 * Non-interactive (paste new Atlas password after reset):
 *   npm run db:setup -- --user=YOUR_DB_USER --password=YOUR_NEW_PASSWORD --cluster=cluster0.svtucni.mongodb.net
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const mongoose = require("mongoose");
const { getMongoUri, mongoConnectionHint } = require("../src/config/database");

const ENV_PATH = path.join(__dirname, "..", ".env");
const DEFAULT_CLUSTER = "cluster0.svtucni.mongodb.net";

function parseArgs(argv) {
  const args = {};
  for (const part of argv) {
    const match = part.match(/^--([^=]+)=(.*)$/);
    if (match) args[match[1]] = match[2];
  }
  return args;
}

function ask(question, { hidden = false } = {}) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    if (!hidden || !process.stdin.isTTY) {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
      return;
    }

    process.stdout.write(question);
    const stdin = process.openStdin();
    stdin.resume();
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");

    let value = "";
    const onData = (char) => {
      if (char === "\u0003") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        rl.close();
        process.exit(1);
      }
      if (char === "\r" || char === "\n") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        rl.close();
        resolve(value.trim());
        return;
      }
      if (char === "\u007f") {
        value = value.slice(0, -1);
        return;
      }
      value += char;
    };

    stdin.on("data", onData);
  });
}

function formatEnvValue(value) {
  if (/[\s#"'=]/.test(value)) {
    return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return value;
}

function upsertEnvLines(content, updates) {
  let next = content;
  if (!next.endsWith("\n") && next.length > 0) next += "\n";

  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, "m");
    const line = `${key}=${formatEnvValue(value)}`;
    if (regex.test(next)) {
      next = next.replace(regex, line);
    } else {
      next += `${line}\n`;
    }
  }

  return next;
}

function commentOutKey(content, key) {
  const regex = new RegExp(`^${key}=.*$`, "m");
  return content.replace(regex, (line) =>
    line.startsWith("#") ? line : `# ${line}`,
  );
}

async function testConnection(uri) {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 20000 });
  const host = mongoose.connection.host;
  await mongoose.disconnect();
  return host;
}

async function main() {
  const cli = parseArgs(process.argv.slice(2));

  console.log("\n=== MongoDB Atlas setup for PolyCode ===\n");

  if (!cli.user && !cli.password) {
    console.log("Atlas checklist:");
    console.log("  1. Database Access → Edit user → Edit Password → SAVE new password");
    console.log("  2. Network Access → 0.0.0.0/0");
    console.log("  3. Use Database User name (NOT your Atlas login email)\n");
  }

  const currentUser = process.env.MONGODB_USER?.trim() || "";
  const uriUser = process.env.MONGODB_URI?.match(
    /^mongodb(\+srv)?:\/\/([^:]+):/,
  )?.[2];
  const decodedUriUser = uriUser
    ? (() => {
        try {
          return decodeURIComponent(uriUser);
        } catch {
          return uriUser;
        }
      })()
    : "";

  const currentCluster =
    process.env.MONGODB_CLUSTER?.trim() ||
    process.env.MONGODB_URI?.match(/@([^/?]+)/)?.[1] ||
    DEFAULT_CLUSTER;

  const user =
    cli.user ||
    (process.stdin.isTTY
      ? (await ask(
          `Database username${decodedUriUser || currentUser ? ` [${decodedUriUser || currentUser}]` : ""}: `,
        )) ||
        decodedUriUser ||
        currentUser
      : decodedUriUser || currentUser);

  if (!user) {
    console.error(
      "\nUsername is required.\nExample:\n  npm run db:setup -- --user=polycodeUser --password=YOUR_PASSWORD --cluster=cluster0.svtucni.mongodb.net\n",
    );
    process.exit(1);
  }

  const password =
    cli.password ||
    (process.stdin.isTTY
      ? await ask("Database password from Atlas (hidden): ", { hidden: true })
      : "");

  if (!password) {
    console.error(
      "\nPassword is required.\nExample:\n  npm run db:setup -- --user=polycodeUser --password=YOUR_PASSWORD --cluster=cluster0.svtucni.mongodb.net\n",
    );
    process.exit(1);
  }

  const cluster =
    cli.cluster ||
    (process.stdin.isTTY
      ? (await ask(`Cluster hostname [${currentCluster}]: `)) || currentCluster
      : currentCluster);

  const db =
    cli.db ||
    process.env.MONGODB_DB?.trim() ||
    (process.stdin.isTTY
      ? (await ask("Database name [polycode]: ")) || "polycode"
      : "polycode");

  process.env.MONGODB_USER = user;
  process.env.MONGODB_PASSWORD = password;
  process.env.MONGODB_CLUSTER = cluster;
  process.env.MONGODB_DB = db;
  delete process.env.MONGODB_URI;

  const uri = getMongoUri();
  console.log("\nTesting connection...");

  try {
    const host = await testConnection(uri);
    console.log(`✅ Connected to ${host}\n`);
  } catch (error) {
    console.error(`\n❌ Connection failed: ${error.message}`);
    console.error(`   → ${mongoConnectionHint(error)}\n`);
    process.exit(1);
  }

  if (!fs.existsSync(ENV_PATH)) {
    console.error(`Missing ${ENV_PATH}. Copy .env.example to .env first.\n`);
    process.exit(1);
  }

  let envContent = fs.readFileSync(ENV_PATH, "utf8");
  envContent = upsertEnvLines(envContent, {
    MONGODB_USER: user,
    MONGODB_PASSWORD: password,
    MONGODB_CLUSTER: cluster,
    MONGODB_DB: db,
  });
  envContent = commentOutKey(envContent, "MONGODB_URI");

  fs.writeFileSync(ENV_PATH, envContent, "utf8");

  console.log("Saved to backend/.env:");
  console.log(`  MONGODB_USER=${user}`);
  console.log("  MONGODB_PASSWORD=********");
  console.log(`  MONGODB_CLUSTER=${cluster}`);
  console.log(`  MONGODB_DB=${db}`);
  console.log("  (old MONGODB_URI commented out)\n");
  console.log("Restart the server: npm run dev\n");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
