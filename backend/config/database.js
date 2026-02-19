/**
 * @fileoverview MongoDB connection module using Mongoose.
 */

const mongoose = require("mongoose");
const config = require("./config");

/**
 * Connects to MongoDB. Exits process on failure.
 * @async
 * @returns {Promise<void>}
 */
const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.database.uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Gracefully closes the MongoDB connection.
 * @async
 * @returns {Promise<void>}
 */
const disconnectDatabase = async () => {
  await mongoose.connection.close();
  console.log("MongoDB disconnected.");
};

module.exports = { connectDatabase, disconnectDatabase };
