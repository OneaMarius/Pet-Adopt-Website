const express = require("express");
const { check } = require("express-validator");
const imageUploadMiddleware = require("../middleware/image-upload");

const authController = require("../controllers/auth-controller");

const router = express.Router();

router.post(
   "/signup",
   check("email").notEmpty().isEmail().normalizeEmail(),
   check("password").notEmpty().isLength({ min: 6 }),
   check("name").notEmpty(),
   check("oras").notEmpty(),
   check("judet").notEmpty(),
   check("resedinta").notEmpty(),
   imageUploadMiddleware,
   authController.signup
);
router.post(
   "/login",
   check("email").notEmpty().isEmail().normalizeEmail(),
   check("password").notEmpty().isLength({ min: 6 }),
   authController.login
);
router.get("/", authController.getAuthUsers);
// router.get("/:uid", authController.getUserById);
router.patch("/donatepet", authController.updateUserDonatedPet);
router.patch("/follow", authController.updateUserFollow);
router.patch("/closeadoptrequest", authController.updateUserAdoptReqClosed);
// router.patch(
//    "/:uid",
//    check("password").notEmpty().isLength({ min: 6 }),
//    check("name").notEmpty(),
//    authController.updateUser
// );
// router.delete("/:uid", authController.deleteUser);

module.exports = router;
