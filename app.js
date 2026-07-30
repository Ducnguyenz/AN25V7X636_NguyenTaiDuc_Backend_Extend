const express = require("express");
const cors = require("cors");

const contactsRouter = require("./app/routes/contact.route");

const userRouter = require("./app/routes/user.route");
const hobbyRouter = require("./app/routes/hobby.route");

const ApiError = require("./app/api-error");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Xin chào mở cổng thành công" });
});


app.use("/api/contacts", contactsRouter);
app.use("/api/auth", userRouter);       
app.use("/api/hobbies", hobbyRouter);  


app.use((req, res, next) => {
  return next(new ApiError(404, "Không tìm thấy tài nguyên"));
});


app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Lỗi máy chủ nội bộ",
  });
});

module.exports = app;