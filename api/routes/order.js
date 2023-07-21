const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const { get_all_orders } = require("../controllers/orders");
const { create_orders } = require("../controllers/orders");
const { get_order } = require("../controllers/orders");
const { delete_orders } = require("../controllers/orders");
const { edit_order } = require("../controllers/orders");

router.get("/", checkAuth, get_all_orders);
router.post("/", checkAuth, create_orders);
router.get("/:orderId", checkAuth, get_order);
router.patch("/:orderId", checkAuth, edit_order);
router.delete("/:orderId", delete_orders);

module.exports = router;
