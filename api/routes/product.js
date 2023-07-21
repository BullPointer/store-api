const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, crypto.randomUUID() + file.originalname),
});

const fileType = (req, file, cb) => {
  file.mimetype === "image/jpeg" || file.mimetype === "image/png"
    ? cb(null, true)
    : cb(null, false);
};

// const fileType =
const upload = multer({
  storage: storage,
  limits: { fieldSize: 1024 * 1024 * 5 },
  fileType: fileType,
});

const {
  get_all_products,
  create_products,
  get_product,
  delete_products,
  edit_product,
} = require("../controllers/products");

router.get("/", get_all_products);
router.post("/", upload.single("productImage"), create_products);
router.get("/:productId", get_product);
router.delete("/:productId", delete_products);
router.patch("/:productId", edit_product);

module.exports = router;
