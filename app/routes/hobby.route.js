const express = require("express");
const hobbies = require("../controllers/hobby.controller");
const auth = require("../middleware/auth"); // Gọi anh bảo vệ

const router = express.Router();

// Các API không cần truyền ID
router.route("/")
    .get(auth, hobbies.findAll)   // Xem danh sách (Cần token)
    .post(auth, hobbies.create);  // Thêm mới (Cần token)

// Các API cần truyền ID cụ thể
router.route("/:id")
    .get(auth, hobbies.findOne)   // Xem chi tiết (Cần token)
    .put(auth, hobbies.update)    // Sửa (Cần token)
    .delete(auth, hobbies.delete);// Xóa (Cần token)

module.exports = router;