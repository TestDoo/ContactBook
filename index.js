// index.js

var express = require("express");
var mongoose = require("mongoose");
// 2-1 : body-parser module를 bodyPaser 변수에 담는다.
var bodyParser = require("body-parser");
// 3-1 :  method-override module을 methodOverride변수에 담는다.
var methodOverride = require("method-override");
var app = express();

// === DB setting ===
// 1-1 : mongoose의 몇몇 글로벌 설정부 mongoose를 사용하려면 항상 이렇게 쓴다 생각
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

// 1-2 : node에서 기본으로 제공되는 process.env 오브젝트는 환경변수들을 가지고 있는 객체이다. - MONGO_DB는 내 컴퓨터 환경변수에 저장된 이름이다. => 환경변수 중에서 MONGO_DB로 저장된 애를 쓰겠다는 의미
mongoose.connect(process.env.MONGO_DB);

// 1-3 : mongoose의 db object를 가져와 db 변수에 넣는 과정 - 이 db 변수에는 DB와 관련된 이벤트 리스너 함수들이 들어 있다.
var db = mongoose.connection;

// 1-4 : db가 성공적으로 연결된 경우 출력함 - 앱이 싱핼되면 딱 한번만 일어나는 db.once('이벤트', 콜백함수)
db.once("open", function () {
    console.log("DB connected");
});

// 1-5 : db 연결 중 에러가 발생하면 출력함 - 다양한 경우에 발생하기 때문에 db.on('이벤트', 콜백함수)
db.on("error", function () {
    console.log("DB ERROR : ", err);
});

// === Other settings ===
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// 2-2,3
// 2-2 bodyParser를 사용하기 위해 필요한 코드들이다. json형식의 데이터를 받는다는 설정
// 2-3 urlencoded data를 extended 알고리듬을 사용해서 분석한다는 설정
//  2번을 설정하면, route의 callback함수(function(req, res, next){...})의 req.body에서 form으로 입력받은 데이터를 사용할 수 있습니다. 이 부분이 지금 이해가 안가시면 이렇게 처리를 해 줘야 웹브라우저의 form에 입력한 데이터가 bodyParser를 통해 req.body으로 생성이 된다는 것만 아셔도 괜찮습니다.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 3-2 : _method의 query로 들어오는 값으로 HTTP method를 바꾼다. 예를 들어 _method=delete를 받으면 delete를 읽어 해당 request의 HTTP method를 delete로 바꾼다.
app.use(methodOverride("_method"));

// === Routes ===
// 3 - 1, 2 : app.use({'route', 콜백함수}) 는 route에 요청이 오는 경우에만 콜백함수를 호출함
app.use("/", require("./routes/home"));
app.use("/contacts", require("./routes/contacts"));

// Port setting
var port = 3000;
app.listen(port, function () {
    console.log("server on! http://localhost:" + port);
});
