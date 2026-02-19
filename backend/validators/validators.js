/**
 * @fileoverview Express-validator middleware chains for all routes.
 */

const { body, validationResult } = require("express-validator");
const { sendError } = require("../utils/response");

/**
 * Checks validation results and returns 422 if invalid.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 422, "Validation failed.", errors.array());
  next();
};

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required.").isLength({ max: 100 }),
  body("email").trim().isEmail().withMessage("Valid email required.").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  body("phone").optional().trim().isLength({ max: 20 }),
  body("address").optional().trim().isLength({ max: 300 }),
  validate,
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("Valid email required.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
  validate,
];

const petValidation = [
  body("name").trim().notEmpty().withMessage("Pet name is required."),
  body("species").isIn(["dog", "cat", "bird", "rabbit", "other"]).withMessage("Invalid species."),
  body("breed").trim().notEmpty().withMessage("Breed is required."),
  body("age").isInt({ min: 0 }).withMessage("Age must be a non-negative integer (months)."),
  body("gender").isIn(["male", "female"]).withMessage("Gender must be male or female."),
  body("description").trim().notEmpty().withMessage("Description is required."),
  body("size").isIn(["small", "medium", "large"]).withMessage("Size must be small, medium, or large."),
  body("vaccinated").optional().isBoolean(),
  body("neutered").optional().isBoolean(),
  validate,
];

const applicationValidation = [
  body("message").trim().notEmpty().withMessage("Message is required.").isLength({ max: 1000 }),
  body("livingArrangement").trim().notEmpty().withMessage("Living arrangement is required."),
  body("hasOtherPets").optional().isBoolean(),
  body("otherPetsDescription").optional().trim().isLength({ max: 300 }),
  validate,
];

const reviewApplicationValidation = [
  body("status").isIn(["approved", "rejected"]).withMessage("Status must be approved or rejected."),
  body("adminNote").optional().trim().isLength({ max: 500 }),
  validate,
];

module.exports = { registerValidation, loginValidation, petValidation, applicationValidation, reviewApplicationValidation };
