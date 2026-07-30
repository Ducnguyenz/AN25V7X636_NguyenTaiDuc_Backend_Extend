const bcrypt = require("bcryptjs");

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }

    async register(username, password) {
        // Kiểm tra trùng tên
        const existing = await this.User.findOne({ username });
        if (existing) throw new Error("Tên đăng nhập đã tồn tại");
        
        // Băm mật khẩu và lưu vào DB
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await this.User.insertOne({
            username,
            password: hashedPassword,
            createdAt: new Date(),
        });
        
        return { _id: result.insertedId, username };
    }

    async login(username, password) {
        // Tìm user
        const user = await this.User.findOne({ username });
        if (!user) throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
        
        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
        
        return { _id: user._id, username: user.username };
    }
}

module.exports = UserService;