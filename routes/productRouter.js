const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  detailProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  authMiddleware,
  permissionUser,
} = require("../middleware/UserMiddleware");
const { uploadOption } = require("../utils/fileUploadProduct");

router.post("/", authMiddleware, permissionUser("admin"), uploadOption.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/:id", detailProduct);
router.put("/:id", uploadOption.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
