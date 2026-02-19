/**
 * @fileoverview Pet Mongoose model for the adoption system.
 */

const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    species: {
      type: String,
      required: true,
      enum: ["dog", "cat", "bird", "rabbit", "other"],
      lowercase: true,
    },
    breed: { type: String, required: true, trim: true, maxlength: 100 },
    age: { type: Number, required: true, min: 0, comment: "Age in months." },
    gender: { type: String, required: true, enum: ["male", "female"] },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    photoUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["available", "pending", "adopted"],
      default: "available",
    },
    size: { type: String, required: true, enum: ["small", "medium", "large"] },
    vaccinated: { type: Boolean, default: false },
    neutered: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

petSchema.index({ name: "text", breed: "text", description: "text" });
petSchema.index({ species: 1, status: 1 });

module.exports = mongoose.model("Pet", petSchema);
