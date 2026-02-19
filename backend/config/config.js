/**
 * @fileoverview Central configuration for the Pet Adoption API.
 * All environment-dependent settings are consolidated here.
 */

require("dotenv").config();

const config = {
  server: {
    port: parseInt(process.env.PORT, 10) || 5000,
    env: process.env.NODE_ENV || "development",
  },
  database: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/pet_adoption",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "fallback_secret_change_in_production",
    expiresIn: process.env.JWT_EXPIRE || "7d",
  },
  upload: {
    path: process.env.UPLOAD_PATH || "uploads/",
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  },
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 50,
  },
  admin: {
    name: process.env.ADMIN_NAME || "Super Admin",
    email: process.env.ADMIN_EMAIL || "admin@petadopt.com",
    password: process.env.ADMIN_PASSWORD || "Admin@123456",
  },
};

module.exports = config;
