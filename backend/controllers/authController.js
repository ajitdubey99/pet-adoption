/**
 * @fileoverview Authentication controller: register, login, getMe.
 */

const User = require("../models/User");
const { generateToken } = require("../utils/token");
const { sendSuccess, sendError } = require("../utils/response");

const formatUser = (user) => ({
  id: user._id, name: user.name, email: user.email,
  role: user.role, phone: user.phone, address: user.address, createdAt: user.createdAt,
});

/**
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (await User.findOne({ email })) return sendError(res, 409, "Email already registered.");
    const user = await User.create({ name, email, password, phone, address });
    const token = generateToken({ id: user._id, role: user.role });
    return sendSuccess(res, 201, "Account created.", { user: formatUser(user), token });
  } catch (error) { next(error); }
};

/**
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) return sendError(res, 401, "Invalid email or password.");
    const token = generateToken({ id: user._id, role: user.role });
    return sendSuccess(res, 200, "Login successful.", { user: formatUser(user), token });
  } catch (error) { next(error); }
};

/**
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = (req, res) => sendSuccess(res, 200, "Profile fetched.", { user: formatUser(req.user) });

module.exports = { register, login, getMe };
