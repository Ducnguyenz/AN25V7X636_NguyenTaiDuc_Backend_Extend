const HobbyService = require("../services/hobby.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    // Chặn nếu form trống
    if (!req.body?.name) {
        return next(new ApiError(400, "Tên sở thích không được để trống"));
    }
    try {
        const hobbyService = new HobbyService(MongoDB.client);
        const doc = await hobbyService.create(req.body);
        return res.status(201).json(doc);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi tạo sở thích"));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const hobbyService = new HobbyService(MongoDB.client);
        const docs = await hobbyService.find({});
        return res.json(docs);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi lấy danh sách sở thích"));
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const hobbyService = new HobbyService(MongoDB.client);
        const doc = await hobbyService.findById(req.params.id);
        if (!doc) return next(new ApiError(404, "Không tìm thấy sở thích"));
        return res.json(doc);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi tìm sở thích"));
    }
};

exports.update = async (req, res, next) => {
    // Chặn nếu form trống
    if (!req.body?.name) {
        return next(new ApiError(400, "Tên sở thích không được để trống"));
    }
    try {
        const hobbyService = new HobbyService(MongoDB.client);
        const doc = await hobbyService.update(req.params.id, req.body);
        if (!doc) return next(new ApiError(404, "Không tìm thấy sở thích"));
        return res.json({ message: "Cập nhật sở thích thành công" });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi cập nhật sở thích"));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const hobbyService = new HobbyService(MongoDB.client);
        const doc = await hobbyService.delete(req.params.id);
        if (!doc) return next(new ApiError(404, "Không tìm thấy sở thích"));
        return res.json({ message: "Xóa sở thích thành công" });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi xóa sở thích"));
    }
};