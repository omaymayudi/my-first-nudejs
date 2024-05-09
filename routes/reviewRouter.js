const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/UserMiddleware")
const {createReview} = require("../controllers/reviewController")

router.post("/:productId", authMiddleware, createReview)


module.exports = router