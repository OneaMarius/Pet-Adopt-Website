const express = require('express');
const petController = require('../controllers/pet-controller')
const router = express.Router();
const imageUploadMiddleware = require('../middleware/image-upload');

router.get("/", petController.getAllPets);

router.get("/:pid", petController.getPetById);

router.post("/", imageUploadMiddleware, petController.addNewPet);

router.patch("/followers", petController.updatePetFollowers);
router.patch("/:pid", petController.updatePet);


module.exports = router;



