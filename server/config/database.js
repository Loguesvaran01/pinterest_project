/**
 * MongoDB Database Configuration
 * Handles connection with retry logic and helpful error messages
 */

const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes("<username>") || uri.includes("<password>")) {
    console.error(`
❌ MongoDB URI is not properly configured!

Please update server/.env with your MongoDB connection string.

OPTION 1 — MongoDB Atlas (Free, Recommended):
  1. Go to https://cloud.mongodb.com
  2. Create a free account
  3. Create a free M0 cluster
  4. Click "Connect" → "Drivers" → Copy the connection string
  5. Paste it as MONGODB_URI in server/.env

OPTION 2 — Local MongoDB:
  Install MongoDB Community from: https://www.mongodb.com/try/download/community
  Then set: MONGODB_URI=mongodb://localhost:27017/pinvault
    `);
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });
  } catch (error) {
    console.error(`
❌ MongoDB connection failed: ${error.message}

Common fixes:
  • Check your MONGODB_URI in server/.env
  • For Atlas: Make sure your IP is whitelisted (Network Access → Add IP → 0.0.0.0/0)
  • For Atlas: Check username/password are correct
  • For local: Make sure MongoDB service is running
    `);
    process.exit(1);
  }
};

module.exports = connectDB;
