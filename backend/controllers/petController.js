/**
 * @fileoverview Pet controller: CRUD and public listing with search/filter/pagination.
 */

const Pet = require("../models/Pet");
const { sendSuccess, sendError, buildPaginationMeta } = require("../utils/response");
const config = require("../config/config");

/**
 * @route GET /api/pets
 * @access Public
 * @desc Paginated, searchable, filterable pet listing.
 */
const getAllPets = async (req, res, next) => {
  try {
    const { search, species, breed, minAge, maxAge, status = "available", page = 1, limit = config.pagination.defaultLimit } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { breed: { $regex: search, $options: "i" } }];
    if (species) filter.species = species.toLowerCase();
    if (breed) filter.breed = { $regex: breed, $options: "i" };
    if (minAge !== undefined || maxAge !== undefined) {
      filter.age = {};
      if (minAge !== undefined) filter.age.$gte = parseInt(minAge, 10);
      if (maxAge !== undefined) filter.age.$lte = parseInt(maxAge, 10);
    }
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(config.pagination.maxLimit, Math.max(1, parseInt(limit, 10)));
    const [pets, total] = await Promise.all([
      Pet.find(filter).select("-createdBy").sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      Pet.countDocuments(filter),
    ]);
    return sendSuccess(res, 200, "Pets retrieved.", pets, buildPaginationMeta(total, pageNum, limitNum));
  } catch (error) { next(error); }
};

/**
 * @route GET /api/pets/:id
 * @access Public
 */
const getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return sendError(res, 404, "Pet not found.");
    return sendSuccess(res, 200, "Pet retrieved.", pet);
  } catch (error) { next(error); }
};

/**
 * @route POST /api/pets
 * @access Admin
 */
const createPet = async (req, res, next) => {
  try {
    const petData = { ...req.body, createdBy: req.user._id };
    if (req.file) petData.photoUrl = `/uploads/${req.file.filename}`;
    const pet = await Pet.create(petData);
    return sendSuccess(res, 201, "Pet created.", pet);
  } catch (error) { next(error); }
};

/**
 * @route PUT /api/pets/:id
 * @access Admin
 */
const updatePet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return sendError(res, 404, "Pet not found.");
    const updateData = { ...req.body };
    if (req.file) updateData.photoUrl = `/uploads/${req.file.filename}`;
    const updated = await Pet.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    return sendSuccess(res, 200, "Pet updated.", updated);
  } catch (error) { next(error); }
};

/**
 * @route DELETE /api/pets/:id
 * @access Admin
 */
const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return sendError(res, 404, "Pet not found.");
    return sendSuccess(res, 200, "Pet deleted.");
  } catch (error) { next(error); }
};

module.exports = { getAllPets, getPetById, createPet, updatePet, deletePet };
