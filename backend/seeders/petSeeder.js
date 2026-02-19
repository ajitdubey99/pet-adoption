/**
 * @fileoverview Sample pet data seeder.
 *
 * Inserts 12 sample pets into the database for development and testing.
 * Requires an admin user to already exist (run seed:admin first).
 *
 * Usage:
 *   npm run seed:pets
 *
 * Behavior:
 *   - Deletes ALL existing pets before inserting fresh sample data.
 *   - Uses the first admin account found as the `createdBy` reference.
 */

require("dotenv").config();
const { connectDatabase, disconnectDatabase } = require("../config/database");
const Pet = require("../models/Pet");
const User = require("../models/User");

/**
 * Sample pet records used for seeding.
 * Age values are in months.
 * @type {Array<Object>}
 */
const samplePets = [
  {
    name: "Buddy",
    species: "dog",
    breed: "Golden Retriever",
    age: 24,
    gender: "male",
    size: "large",
    description: "Buddy is an energetic and loving Golden Retriever who gets along with everyone. He loves fetch and long walks in the park.",
    vaccinated: true,
    neutered: true,
    status: "available",
  },
  {
    name: "Luna",
    species: "cat",
    breed: "Persian",
    age: 18,
    gender: "female",
    size: "medium",
    description: "Luna is a calm and affectionate Persian cat who loves to curl up on laps. Perfect for apartment living.",
    vaccinated: true,
    neutered: true,
    status: "available",
  },
  {
    name: "Max",
    species: "dog",
    breed: "German Shepherd",
    age: 36,
    gender: "male",
    size: "large",
    description: "Max is an intelligent and loyal German Shepherd. He is well-trained and would thrive in an active home.",
    vaccinated: true,
    neutered: false,
    status: "available",
  },
  {
    name: "Milo",
    species: "cat",
    breed: "Siamese",
    age: 12,
    gender: "male",
    size: "small",
    description: "Milo is a vocal and playful Siamese kitten. He loves toys and interactive play sessions.",
    vaccinated: true,
    neutered: false,
    status: "available",
  },
  {
    name: "Bella",
    species: "dog",
    breed: "Labrador Retriever",
    age: 6,
    gender: "female",
    size: "large",
    description: "Bella is a friendly Labrador puppy full of energy and curiosity. She is great with children.",
    vaccinated: true,
    neutered: false,
    status: "available",
  },
  {
    name: "Coco",
    species: "rabbit",
    breed: "Holland Lop",
    age: 8,
    gender: "female",
    size: "small",
    description: "Coco is a gentle Holland Lop rabbit who enjoys being held and exploring her environment.",
    vaccinated: false,
    neutered: true,
    status: "available",
  },
  {
    name: "Charlie",
    species: "dog",
    breed: "Beagle",
    age: 48,
    gender: "male",
    size: "medium",
    description: "Charlie is a cheerful Beagle with a great nose and an even greater personality. He loves outdoor adventures.",
    vaccinated: true,
    neutered: true,
    status: "available",
  },
  {
    name: "Nemo",
    species: "bird",
    breed: "Budgerigar",
    age: 10,
    gender: "male",
    size: "small",
    description: "Nemo is a bright and chatty budgie who can mimic sounds. Perfect for someone looking for a cheerful companion.",
    vaccinated: false,
    neutered: false,
    status: "available",
  },
  {
    name: "Daisy",
    species: "dog",
    breed: "Poodle",
    age: 30,
    gender: "female",
    size: "medium",
    description: "Daisy is a hypoallergenic Poodle who is very intelligent and easy to train. Great for families with allergies.",
    vaccinated: true,
    neutered: true,
    status: "available",
  },
  {
    name: "Whiskers",
    species: "cat",
    breed: "Maine Coon",
    age: 60,
    gender: "male",
    size: "large",
    description: "Whiskers is a majestic Maine Coon with a big fluffy coat and an even bigger heart. He is calm and dog-friendly.",
    vaccinated: true,
    neutered: true,
    status: "available",
  },
  {
    name: "Oliver",
    species: "rabbit",
    breed: "Mini Rex",
    age: 5,
    gender: "male",
    size: "small",
    description: "Oliver is an active Mini Rex rabbit who loves hopping around and exploring. He is gentle with gentle handling.",
    vaccinated: false,
    neutered: false,
    status: "available",
  },
  {
    name: "Ruby",
    species: "dog",
    breed: "Shih Tzu",
    age: 20,
    gender: "female",
    size: "small",
    description: "Ruby is a sweet Shih Tzu who loves cuddles and short walks. She is calm, well-mannered, and house-trained.",
    vaccinated: true,
    neutered: true,
    status: "available",
  },
];

/**
 * Seeds sample pet records into the database.
 * Clears existing pets before inserting fresh data.
 *
 * @async
 * @function seedPets
 * @returns {Promise<void>}
 */
const seedPets = async () => {
  try {
    await connectDatabase();

    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      console.error("No admin user found. Please run 'npm run seed:admin' first.");
      process.exit(1);
    }

    await Pet.deleteMany({});
    console.log("Existing pets cleared.");

    const petsWithAdmin = samplePets.map((pet) => ({
      ...pet,
      createdBy: admin._id,
    }));

    await Pet.insertMany(petsWithAdmin);

    console.log("--------------------------------------------------");
    console.log(`${samplePets.length} sample pets seeded successfully.`);
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("Pet seeder failed:", error.message);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
};

seedPets();
