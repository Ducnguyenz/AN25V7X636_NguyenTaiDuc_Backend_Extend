const { ObjectId } = require("mongodb");

class HobbyService {
    constructor(client) {
        // Kết nối bảng "hobbies"
        this.Hobby = client.db().collection("hobbies");
    }

    // Dọn dẹp dữ liệu: Xóa các trường trống (undefined)
    extractData(payload) {
        const data = { name: payload.name };
        Object.keys(data).forEach(
            (key) => data[key] === undefined && delete data[key]
        );
        return data;
    }

    // Thêm sở thích mới
    async create(payload) {
        const data = this.extractData(payload);
        const result = await this.Hobby.insertOne(data);
        return { _id: result.insertedId, ...data };
    }

    // Lấy danh sách sở thích
    async find(filter) {
        const cursor = await this.Hobby.find(filter);
        return await cursor.toArray();
    }

    // Tìm 1 sở thích theo ID
    async findById(id) {
        return await this.Hobby.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // Cập nhật sở thích
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractData(payload);
        const result = await this.Hobby.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    // Xóa sở thích
    async delete(id) {
        const result = await this.Hobby.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = HobbyService;