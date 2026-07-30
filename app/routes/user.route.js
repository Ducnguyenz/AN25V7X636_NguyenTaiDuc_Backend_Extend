const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

// Đường dẫn API cho Đăng ký và Đăng nhập
router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;