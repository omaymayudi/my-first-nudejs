const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const {authMiddleware} = require("../middleware/UserMiddleware");

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.post("/logout", authMiddleware, AuthController.logoutUSer);
router.get("/me", authMiddleware, AuthController.getMyUser)

module.exports = router;
