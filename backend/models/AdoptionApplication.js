/**
 * @fileoverview AdoptionApplication Mongoose model.
 * Tracks adoption requests with unique compound index preventing duplicates.
 */

const mongoose = require("mongoose");

const adoptionApplicationSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    livingArrangement: { type: String, required: true, trim: true, maxlength: 500 },
    hasOtherPets: { type: Boolean, default: false },
    otherPetsDescription: { type: String, trim: true, maxlength: 300 },
    adminNote: { type: String, trim: true, maxlength: 500 },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/** Prevents duplicate applications for the same pet by the same user. */
adoptionApplicationSchema.index({ pet: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("AdoptionApplication", adoptionApplicationSchema);
