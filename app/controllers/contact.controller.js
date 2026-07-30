const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// 1. Tạo và lưu một liên hệ mới
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Tên liên hệ không được để trống"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tạo liên hệ")
        );
    }
};

// 2. Lấy tất cả liên hệ từ CSDL
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await contactService.findByName(name);
        } else {
            documents = await contactService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi lấy danh sách liên hệ")
        );
    }

    return res.send(documents);
};

// 3. Tìm một liên hệ duy nhất theo ID
exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy liên hệ"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi lấy liên hệ có id=${req.params.id}`)
        );
    }
};

// 4. Cập nhật liên hệ theo ID
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy liên hệ"));
        }
        return res.send({ message: "Cập nhật liên hệ thành công" });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi cập nhật liên hệ có id=${req.params.id}`)
        );
    }
};

// 5. Xóa liên hệ theo ID
exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy liên hệ"));
        }
        return res.send({ message: "Xóa liên hệ thành công" });
    } catch (error) {
        return next(
            new ApiError(500, `Không thể xóa liên hệ có id=${req.params.id}`)
        );
    }
};

// 6. Xóa tất cả liên hệ
exports.deleteAll = async (_req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.send({
            message: `${deletedCount} liên hệ đã được xóa thành công`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả liên hệ")
        );
    }
};