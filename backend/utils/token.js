/**
 * @fileoverview JWT token generation and verification.
 */

const jwt = require("jsonwebtoken");
const config = require("../config/config");

/**
 * Generates a signed JWT for the given payload.
 * @param {Object} payload - { id, role }
 * @returns {string}
 */
const generateToken = (payload) =>
  jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

/**
 * Verifies and decodes a JWT token.
 * @param {string} token
 * @returns {Object} Decoded payload
 * @throws {Error} If invalid or expired
 */
const verifyToken = (token) => jwt.verify(token, config.jwt.secret);

module.exports = { generateToken, verifyToken };
