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

// === DB scheman ===
// 2-4 : 함수로 DB에서 사용할 스키마를 설정. 데이터베이스에 정보를 어떠한 형식으로 저장할 지를 지정해주는 것 - required : 반드시 입력되어야 한다 / unique : 값이 중복되면 안된다
// 스키마는 모델의 대상에 대한 구체적인 구조를 뜻합니다.
var contactSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String },
    phone: { type: String },
});

// 2-5 : contact schema의 model을 생성해 Contact 변수에 연결 시켜주는 코드
// mongoose.model() 함수의 첫번째 파라미터는 mongoDB에서 사용되는 콜렉션의 이름
// 두번째는 mongoose.Schema로 생성된 오브젝트이다.
// DB에 있는 contact라는 데이터 콜렉션을 현재 코드의 Contact라는 변수에 연결해 주는 역할을 한다.
var Contact = mongoose.model("contact", contactSchema);

// === Routes ===
// Home 2-6 : / 에 get 요청이 오는 경우 -> /contacts로 redirect하는 코드
// redirect함수는 설정 경로로 이동시키는 함수이다.
app.get("/", function (req, res) {
    res.redirect("/contacts");
});

// Contacts - Index 2-7 : /contacts에 get 요청이 오는 경우 -> 에러가 있다면 에러를 json 형태로 웹브라우저에 표시하고, 에러가 없다면 검색 결과를 받아 views/contacts/index.ejs를 render한다.
app.get("/contacts", function (req, res) {
    Contact.find({}, function (err, contacts) {
        if (err) return res.json(err);
        res.render("contacts/index", { contacts: contacts });
    });
});

// Contacts - New 2-8 : /contacts/new에 get 요청이 오는 경우 -> 새로운 주소록을 만드는 form이 있는 views/contacts/new.ejs를 render 해준다.
app.get("/contacts/new", function (req, res) {
    res.render("contacts/new");
});

// Contacts - create 2-8 : /contacts 에 post요청이 오는 경우(/contacts/new에서 form을 전달 받는 경우)
// -> 모델.create 는 DB에 data를 생성하는 함수이다. 첫번째 파라미터로 data의 object를 받고, 두번째 파라미터로 콜백함수를 받음 -> 두번째 파라미터인 콜백함수는 첫번째 파라미터로 error를 받고, 두번째 파라미터로 생성된 data를 받는다. 생성된 데이터는 하나이므로 단수형이다 에러 없이 contact data가 생성되면 /contacts로 redirect한다.
app.post("/contacts", function (req, res) {
    Contact.create(req.body, function (err, contact) {
        if (err) return res.json(err);
        res.redirect("/contacts");
    });
});

// Contacts - show 3-3 : "contacts/:id"에 get 요청이 오는 경우
// :id처럼 route에 골론을 사용하면 해당 위치의 값을 받아 req.params에 넣게 된다. 예) "contacts/abcd1234" => req.params.id에 abcd1234가 입력됨
// Model.findOne 함수는 해당 모델의 document(문서)를 하나 찾는 함수이다. 첫번째 파라미터로 찾을 조건을 object로 입력하고 data를 찾은 후 콜백함수를 호출한다. model.findOne은 조건에 맞는 결과를 하나만 찾아 오브젝트로 전달한다. ==> 여기서는 _id가 req.params.id와 일치하는 data를 찾는 조건이다.
// 에러가 없다면 검색 결과를 받아 views/contacts/show.ejs를 render
app.get("/contacts/:id", function (req, res) {
    Contact.findOne({ _id: req.params.id }, function (err, contact) {
        if (err) return res.json(err);
        res.render("contacts/show", { contact: contact });
    });
});

// Contacts - edit 3-4 : "contacts/:id/edit"에 get 요청이 오는 경우
// 검색 결과를 받아 views/contacts/edit.ejs를 render합니다.
app.get("/contacts/:id/edit", function (req, res) {
    Contact.findOne({ _id: req.params.id }, function (err, contact) {
        if (err) return res.json(err);
        res.render("contacts/edit", { contact: contact });
    });
});

// Contacts - updata 3-5 : "contacts/:id"에 put 요청이 오는 경우
// Model.findOneAndUpdate는 DB에서 해당 model의 document를 하나 찾아 그 data를 수정하는 함수이다.
// 첫번째 파라미터로 찾을 조건을 object로 입력하고, 두번째 파라미터로 update할 정보를 object로 입력 data를 찾은 후 콜백함수를 호출한다. 이때 호출함수로 넘겨지는 값은 수정되기 전 값이다.
// Data 수정 후 "/contacts/"+req.params.id로 redirect한다.
app.put("/contacts/:id", function (req, res) {
    Contact.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, contact) {
        if (err) return res.json(err);
        res.redirect("/contacts/" + req.params.id);
    });
});

// Contacts - destroy 3-6 : "contacts/:id"에 delete 요청이 오는 경우
// Model.deleteOne은 DB에서 해당 model의 document를 하나 찾아 삭제하는 함수. 첫번째 parameter로 찾을 조건을 object로 입력하고 data를 찾은 후 callback함수를 호출합니다.
// Data 삭제후 "/contacts"로 redirect합니다.
app.delete("/contacts/:id", function (req, res) {
    Contact.deleteOne({ _id: req.params.id }, function (err) {
        if (err) return res.json(err);
        res.redirect("/contacts");
    });
});

// Port setting
var port = 3000;
app.listen(port, function () {
    console.log("server on! http://localhost:" + port);
});
