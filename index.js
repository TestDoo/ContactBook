// index.js

var express = require("express");
var mongoose = require("mongoose");
var app = express();

// DB setting
// 1 : mongoose의 몇몇 글로벌 설정부 항상 이렇게 쓴다 생각
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

// 2 : node에서 기본으로 제공되는 process.env 오브젝트는 환경변수들을 가지고 있는 객체이다. MONGO_DB는 내 컴퓨터 환경변수에 저장된 이름이다.
mongoose.connect(process.env.MONGO_DB);

// 3 : mongoose의 db object를 가져와 db 변수에 넣는 과정
var db = mongoose.connection;

// 4 : db가 성공적으로 연결된 경우 출력함
// 앱이 싱핼되면 딱 한번만 일어나는 db.once('이벤트', 콜백함수)
db.once("open", function () {
    console.log("DB connected");
});

// 5 : db 연결 중 에러가 발생하면 출력함
// 다양한 경우에 발생하기 때문에 db.on('이벤트', 콜백함수)
db.on("error", function () {
    console.log("DB ERROR : ", err);
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Port setting
var port = 3000;
app.listen(port, function () {
    console.log("server on! http://localhost:" + port);
});
