/**
 * @fileoverview Admin account seeder.
 *
 * Creates or updates the admin account using credentials from .env
 * (ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD).
 *
 * Usage:
 *   npm run seed:admin
 *
 * Behavior:
 *   - If admin with the given email already exists, it is updated.
 *   - If no admin exists, a new one is created.
 *   - The password is hashed automatically by the User model pre-save hook.
 */

require("dotenv").config();
const { connectDatabase, disconnectDatabase } = require("../config/database");
const config = require("../config/config");
const User = require("../models/User");

/**
 * Seeds the admin user into the database.
 * Logs the result and exits the process when done.
 *
 * @async
 * @function seedAdmin
 * @returns {Promise<void>}
 */
const seedAdmin = async () => {
  try {
    await connectDatabase();

    const { name, email, password } = config.admin;

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      existingAdmin.name = name;
      existingAdmin.password = password;
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("--------------------------------------------------");
      console.log("Admin account UPDATED successfully.");
      console.log(`  Email   : ${email}`);
      console.log(`  Password: ${password}`);
      console.log("--------------------------------------------------");
    } else {
      await User.create({ name, email, password, role: "admin" });
      console.log("--------------------------------------------------");
      console.log("Admin account CREATED successfully.");
      console.log(`  Name    : ${name}`);
      console.log(`  Email   : ${email}`);
      console.log(`  Password: ${password}`);
      console.log("  Role    : admin");
      console.log("--------------------------------------------------");
    }
  } catch (error) {
    console.error("Admin seeder failed:", error.message);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
};

seedAdmin();
