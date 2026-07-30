const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");

// Dùng key "123" cho dễ test (khớp với file auth.js)
const JWT_SECRET = process.env.JWT_SECRET || "123";

exports.register = async (req, res, next) => {
    // Chặn nếu form trống
    if (!req.body?.username || !req.body?.password) {
        return next(new ApiError(400, "Vui lòng nhập đủ tên đăng nhập và mật khẩu"));
    }
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.register(req.body.username, req.body.password);
        return res.status(201).json({ message: "Đăng ký thành công", user });
    } catch (error) {
        if (error.message === "Tên đăng nhập đã tồn tại") {
            return next(new ApiError(409, error.message));
        }
        return next(new ApiError(500, error.message));
    }
};

exports.login = async (req, res, next) => {
    // Chặn nếu form trống
    if (!req.body?.username || !req.body?.password) {
        return next(new ApiError(400, "Vui lòng nhập đủ tên đăng nhập và mật khẩu"));
    }
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.login(req.body.username, req.body.password);
        
        // Cấp token 24h
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: "24h" }
        );
        return res.json({ token, user: { _id: user._id, username: user.username } });
    } catch (error) {
        return next(new ApiError(401, error.message));
    }
};