/**
 * @fileoverview Master seeder that runs all seeders in order.
 *
 * Usage:
 *   npm run seed:all
 *
 * Order of execution:
 *   1. Admin user seeder
 *   2. Sample pets seeder
 */

require("dotenv").config();
const { connectDatabase, disconnectDatabase } = require("../config/database");
const config = require("../config/config");
const User = require("../models/User");
const Pet = require("../models/Pet");

/**
 * Sample pet data (mirrors petSeeder.js for use in combined seeder).
 * @type {Array<Object>}
 */
const samplePets = [
  { name: "Buddy", species: "dog", breed: "Golden Retriever", age: 24, gender: "male", size: "large", description: "Buddy is an energetic and loving Golden Retriever who gets along with everyone.", vaccinated: true, neutered: true, status: "available" },
  { name: "Luna", species: "cat", breed: "Persian", age: 18, gender: "female", size: "medium", description: "Luna is a calm and affectionate Persian cat who loves to curl up on laps.", vaccinated: true, neutered: true, status: "available" },
  { name: "Max", species: "dog", breed: "German Shepherd", age: 36, gender: "male", size: "large", description: "Max is an intelligent and loyal German Shepherd, well-trained and great for active homes.", vaccinated: true, neutered: false, status: "available" },
  { name: "Milo", species: "cat", breed: "Siamese", age: 12, gender: "male", size: "small", description: "Milo is a vocal and playful Siamese kitten who loves toys and interactive play.", vaccinated: true, neutered: false, status: "available" },
  { name: "Bella", species: "dog", breed: "Labrador Retriever", age: 6, gender: "female", size: "large", description: "Bella is a friendly Labrador puppy full of energy and curiosity, great with children.", vaccinated: true, neutered: false, status: "available" },
  { name: "Coco", species: "rabbit", breed: "Holland Lop", age: 8, gender: "female", size: "small", description: "Coco is a gentle Holland Lop rabbit who enjoys being held and exploring.", vaccinated: false, neutered: true, status: "available" },
  { name: "Charlie", species: "dog", breed: "Beagle", age: 48, gender: "male", size: "medium", description: "Charlie is a cheerful Beagle with a great personality who loves outdoor adventures.", vaccinated: true, neutered: true, status: "available" },
  { name: "Nemo", species: "bird", breed: "Budgerigar", age: 10, gender: "male", size: "small", description: "Nemo is a bright and chatty budgie who can mimic sounds.", vaccinated: false, neutered: false, status: "available" },
  { name: "Daisy", species: "dog", breed: "Poodle", age: 30, gender: "female", size: "medium", description: "Daisy is a hypoallergenic Poodle, intelligent and easy to train.", vaccinated: true, neutered: true, status: "available" },
  { name: "Ruby", species: "dog", breed: "Shih Tzu", age: 20, gender: "female", size: "small", description: "Ruby is a sweet Shih Tzu who loves cuddles and short walks.", vaccinated: true, neutered: true, status: "available" },
];

/**
 * Runs all seeders sequentially: admin first, then pets.
 *
 * @async
 * @function runAllSeeders
 * @returns {Promise<void>}
 */
const runAllSeeders = async () => {
  try {
    await connectDatabase();

    console.log("\n========== SEEDING ADMIN ==========");
    const { name, email, password } = config.admin;
    let admin = await User.findOne({ email });

    if (admin) {
      admin.name = name;
      admin.password = password;
      admin.role = "admin";
      await admin.save();
      console.log(`Admin updated: ${email}`);
    } else {
      admin = await User.create({ name, email, password, role: "admin" });
      console.log(`Admin created: ${email} | Password: ${password}`);
    }

    console.log("\n========== SEEDING PETS ==========");
    await Pet.deleteMany({});
    const petsWithAdmin = samplePets.map((pet) => ({ ...pet, createdBy: admin._id }));
    await Pet.insertMany(petsWithAdmin);
    console.log(`${samplePets.length} pets seeded.`);

    console.log("\n========== SEEDING COMPLETE ==========\n");
  } catch (error) {
    console.error("Seeder error:", error.message);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
};

runAllSeeders();
