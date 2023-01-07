const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

mongoose.set('strictQuery', true);
// 連接 mongoDB
mongoose
    .connect("mongodb://127.0.0.1:27017/mernDB")
    .then(() => {
        console.log("Connecting to mongodb...");
    })
    .catch((e) => {
        console.log(e);
    });

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

// 若接收到任何 route 為 /api/user 之路徑，則去連結至 auth
app.use("/api/user", authRoute);
// course route 應該被jwt保護
// 如果 request header 內部沒有 jwt，則 request 就會被視為是 unauthorized
app.use(
    "/api/courses", 
    passport.authenticate("jwt", {session: false}), 
    courseRoute
    );

// 只有登入系統的人，才能夠去新增課程或是註冊課程
// jwt

// need to judge port 3000(because 3000 is react default port)
app.listen(8080, () => {
    console.log("後端伺服器聆聽在 port 8080");
});