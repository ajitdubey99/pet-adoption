/**
 * @fileoverview Global Express error handler and 404 middleware.
 */

const { sendError } = require("../utils/response");

/**
 * Global error handler. Register LAST in middleware chain.
 * Normalizes Mongoose, JWT, and general errors into JSON responses.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.stack || err.message}`);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Unexpected server error.";
  let errors = null;

  if (err.name === "CastError") { statusCode = 400; message = `Invalid value for: ${err.path}`; }
  if (err.name === "ValidationError") { statusCode = 422; message = "Validation failed."; errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message })); }
  if (err.code === 11000) { statusCode = 409; const field = Object.keys(err.keyValue)[0]; message = `A record with this ${field} already exists.`; }
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") { statusCode = 401; message = "Authentication failed."; }

  return sendError(res, statusCode, message, errors);
};

/**
 * 404 handler for undefined routes.
 */
const notFound = (req, res) =>
  sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);

module.exports = { errorHandler, notFound };
