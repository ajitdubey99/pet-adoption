/**
 * @fileoverview Application routes: /api/applications
 */
const express = require("express");
const { submitApplication, getMyApplications, getAllApplications, reviewApplication } = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/auth");
const { applicationValidation, reviewApplicationValidation } = require("../validators/validators");
const router = express.Router();

router.get("/my", protect, authorize("user", "admin"), getMyApplications);
router.get("/", protect, authorize("admin"), getAllApplications);
router.post("/:petId", protect, authorize("user", "admin"), applicationValidation, submitApplication);
router.patch("/:id/review", protect, authorize("admin"), reviewApplicationValidation, reviewApplication);

module.exports = router;
