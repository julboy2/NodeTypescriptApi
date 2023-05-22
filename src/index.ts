import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./router";

// 1. 앱시작
const app = express();

dotenv.config();

app.use(
  cors({
    // 다른 도메인에서 접근할수 있도록 허용 : true 시 cookies , 인증헤더 등 포함하여 전송할 수 있음
    credentials: true,
  })
);

// 인증구현시 앱이 압축을 사용하는지 확인
// 클라이언트와 서버간의 데이터 전송량을 줄이기 위해 http 응답 데이터를 압축하는 기능을 제공
app.use(compression());

// 쿠키로 작업할 것이기 때문에 쿠키확인
app.use(cookieParser());

// json 형식의 사용하는지 확인
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});

const MONGO_URL = process.env.MONGO_URL;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
