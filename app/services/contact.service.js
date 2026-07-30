const { ObjectId } = require("mongodb");

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection("contacts");
    }

    // Trích xuất và làm sạch dữ liệu đầu vào
    extractContactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite, 
        };
        
        // Xóa các trường trống (undefined)
        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );
        return contact;
    }

    // 1. Hàm tạo mới liên hệ
    // Đã đổi sang insertOne để lưu mảng an toàn, bỏ ép kiểu boolean cũ
    async create(payload) {
        const contact = this.extractContactData(payload);
        const result = await this.Contact.insertOne(contact);
        return { _id: result.insertedId, ...contact };
    }

    // 2. Hàm tìm kiếm tất cả liên hệ dựa trên bộ lọc
    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    // 3. Hàm tìm kiếm liên hệ theo tên
    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    // 4. Tìm một liên hệ duy nhất theo ID
    async findById(id) {
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // 5. Cập nhật liên hệ theo ID
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    // 6. Xóa liên hệ theo ID
    async delete(id) {
        const result = await this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    // 7. Xóa toàn bộ liên hệ
    async deleteAll() {
        const result = await this.Contact.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = ContactService;