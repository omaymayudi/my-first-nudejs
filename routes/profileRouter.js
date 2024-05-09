const express = require("express");
const router = express.Router();

const {updateOrCreateProfile} = require("../controllers/profileController")
const { authMiddleware } = require("../middleware/UserMiddleware")

router.post("/", authMiddleware, updateOrCreateProfile)

module.exports = router