/**
 * @fileoverview JWT authentication and role-based authorization middleware.
 */

const User = require("../models/User");
const { verifyToken } = require("../utils/token");
const { sendError } = require("../utils/response");

/**
 * Verifies Bearer JWT token and attaches user to req.user.
 * @async
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, "Access denied. No token provided.");
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return sendError(res, 401, "User no longer exists.");
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") return sendError(res, 401, "Token expired.");
    return sendError(res, 401, "Invalid token.");
  }
};

/**
 * Restricts access to specific roles. Must chain after protect.
 * @param {...string} roles
 * @returns {import('express').RequestHandler}
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return sendError(res, 403, `Access denied. Required roles: ${roles.join(", ")}.`);
  }
  next();
};

module.exports = { protect, authorize };
