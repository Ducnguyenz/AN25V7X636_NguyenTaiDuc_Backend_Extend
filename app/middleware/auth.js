const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");

// Dùng key "123" cho dễ test 
const JWT_SECRET = process.env.JWT_SECRET || "123";

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // Kiểm tra xem có gửi token lên không
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new ApiError(401, "Vui lòng cung cấp token xác thực"));
    }
    
    // Lấy chuỗi token (bỏ đoạn "Bearer " ở đầu)
    const token = authHeader.split(" ")[1];
    
    try {
        // Giải mã token bằng key "123"
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Lưu thông tin user để các API phía sau sử dụng
        req.userId = decoded.userId;
        req.username = decoded.username;
        
        next(); // Token hợp lệ, cho phép đi tiếp
    } catch (error) {
        // Token sai hoặc hết hạn
        return next(new ApiError(401, "Token không hợp lệ hoặc đã hết hạn"));
    }
};