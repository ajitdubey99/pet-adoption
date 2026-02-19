/**
 * @fileoverview Multer configuration for pet photo uploads.
 */

const multer = require("multer");
const path = require("path");
const config = require("../config/config");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.upload.path),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `pet-${unique}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (config.upload.allowedMimeTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, PNG, and WebP images are accepted."), false);
};

const uploadPetPhoto = multer({ storage, fileFilter, limits: { fileSize: config.upload.maxFileSize } }).single("photo");

module.exports = { uploadPetPhoto };
