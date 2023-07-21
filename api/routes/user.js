const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const userController = require("../controllers/users");

router.get("/", userController.get_users);
router.get("/:userId", userController.get_user);
router.post("/login", userController.login_users);
router.post("/signup", userController.signup_users);
router.delete("/:userId", checkAuth, userController.delete_users);

module.exports = router;