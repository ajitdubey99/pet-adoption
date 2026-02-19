/**
 * @fileoverview Adoption application controller.
 * Handles submit, list, and admin review with automatic pet status updates.
 */

const AdoptionApplication = require("../models/AdoptionApplication");
const Pet = require("../models/Pet");
const { sendSuccess, sendError, buildPaginationMeta } = require("../utils/response");
const config = require("../config/config");

/**
 * @route POST /api/applications/:petId
 * @access User
 * @desc Submit adoption application. Pet status set to pending.
 */
const submitApplication = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.petId);
    if (!pet) return sendError(res, 404, "Pet not found.");
    if (pet.status !== "available") return sendError(res, 400, "This pet is not available for adoption.");
    if (await AdoptionApplication.findOne({ pet: req.params.petId, applicant: req.user._id })) {
      return sendError(res, 409, "You already applied for this pet.");
    }
    const application = await AdoptionApplication.create({ pet: req.params.petId, applicant: req.user._id, ...req.body });
    await Pet.findByIdAndUpdate(req.params.petId, { status: "pending" });
    const populated = await application.populate([{ path: "pet", select: "name species breed photoUrl" }, { path: "applicant", select: "name email" }]);
    return sendSuccess(res, 201, "Application submitted.", populated);
  } catch (error) { next(error); }
};

/**
 * @route GET /api/applications/my
 * @access User
 */
const getMyApplications = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(config.pagination.maxLimit, parseInt(req.query.limit, 10) || config.pagination.defaultLimit);
    const [applications, total] = await Promise.all([
      AdoptionApplication.find({ applicant: req.user._id }).populate("pet", "name species breed photoUrl status").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      AdoptionApplication.countDocuments({ applicant: req.user._id }),
    ]);
    return sendSuccess(res, 200, "Applications retrieved.", applications, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

/**
 * @route GET /api/applications
 * @access Admin
 */
const getAllApplications = async (req, res, next) => {
  try {
    const { status } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(config.pagination.maxLimit, parseInt(req.query.limit, 10) || config.pagination.defaultLimit);
    const filter = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) filter.status = status;
    const [applications, total] = await Promise.all([
      AdoptionApplication.find(filter).populate("pet", "name species breed photoUrl").populate("applicant", "name email phone").populate("reviewedBy", "name email").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      AdoptionApplication.countDocuments(filter),
    ]);
    return sendSuccess(res, 200, "All applications retrieved.", applications, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

/**
 * @route PATCH /api/applications/:id/review
 * @access Admin
 * @desc Approve auto-sets pet to adopted and rejects other pending applications.
 *       Reject reverts pet to available if no other pending applications remain.
 */
const reviewApplication = async (req, res, next) => {
  try {
    const application = await AdoptionApplication.findById(req.params.id);
    if (!application) return sendError(res, 404, "Application not found.");
    if (application.status !== "pending") return sendError(res, 400, "Only pending applications can be reviewed.");

    const { status, adminNote } = req.body;
    application.status = status;
    application.adminNote = adminNote || "";
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    await application.save();

    if (status === "approved") {
      await Pet.findByIdAndUpdate(application.pet, { status: "adopted" });
      await AdoptionApplication.updateMany(
        { pet: application.pet, _id: { $ne: application._id }, status: "pending" },
        { status: "rejected", adminNote: "Another applicant was approved.", reviewedBy: req.user._id, reviewedAt: new Date() }
      );
    }

    if (status === "rejected") {
      const otherPending = await AdoptionApplication.countDocuments({ pet: application.pet, status: "pending" });
      if (otherPending === 0) await Pet.findByIdAndUpdate(application.pet, { status: "available" });
    }

    const updated = await AdoptionApplication.findById(application._id)
      .populate("pet", "name species breed photoUrl")
      .populate("applicant", "name email")
      .populate("reviewedBy", "name email");

    return sendSuccess(res, 200, `Application ${status}.`, updated);
  } catch (error) { next(error); }
};

module.exports = { submitApplication, getMyApplications, getAllApplications, reviewApplication };
