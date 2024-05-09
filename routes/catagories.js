const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  detailCategories,
  updateCategories,
  deleteCategories,
} = require("../controllers/categories");
const {
  authMiddleware,
  permissionUser,
} = require("../middleware/UserMiddleware");

router.get(
  "/",
  authMiddleware,
  permissionUser("admin", "user"),
  getAllCategories
);
router.post("/", authMiddleware, permissionUser("admin"), createCategory);
router.get(
  "/:id",
  authMiddleware,
  permissionUser("admin", "user"),
  detailCategories
);
router.put("/:id", authMiddleware, permissionUser("admin"), updateCategories);
router.delete(
  "/:id",
  authMiddleware,
  permissionUser("admin"),
  deleteCategories
);

module.exports = router;
