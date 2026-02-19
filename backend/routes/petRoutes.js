/**
 * @fileoverview Pet routes: /api/pets
 */
const express = require("express");
const { getAllPets, getPetById, createPet, updatePet, deletePet } = require("../controllers/petController");
const { protect, authorize } = require("../middleware/auth");
const { uploadPetPhoto } = require("../middleware/upload");
const { petValidation } = require("../validators/validators");
const router = express.Router();

router.get("/", getAllPets);
router.get("/:id", getPetById);
router.post("/", protect, authorize("admin"), uploadPetPhoto, petValidation, createPet);
router.put("/:id", protect, authorize("admin"), uploadPetPhoto, petValidation, updatePet);
router.delete("/:id", protect, authorize("admin"), deletePet);

module.exports = router;
