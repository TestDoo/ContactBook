var express = require("express");
var router = express.Router();
// 1 : Contact module을 require로 호출한다.
var Contact = require("../models/Contact");

// Contacts - Index 2-7 : /contacts에 get 요청이 오는 경우 -> 에러가 있다면 에러를 json 형태로 웹브라우저에 표시하고, 에러가 없다면 검색 결과를 받아 views/contacts/index.ejs를 render한다.
router.get("/", function (req, res) {
    Contact.find({}, function (err, contacts) {
        if (err) return res.json(err);
        res.render("contacts/index", { contacts: contacts });
    });
});

// Contacts - New 2-8 : /contacts/new에 get 요청이 오는 경우 -> 새로운 주소록을 만드는 form이 있는 views/contacts/new.ejs를 render 해준다.
router.get("/new", function (req, res) {
    res.render("contacts/new");
});

// Contacts - create 2-8 : /contacts 에 post요청이 오는 경우(/contacts/new에서 form을 전달 받는 경우)
// -> 모델.create 는 DB에 data를 생성하는 함수이다. 첫번째 파라미터로 data의 object를 받고, 두번째 파라미터로 콜백함수를 받음 -> 두번째 파라미터인 콜백함수는 첫번째 파라미터로 error를 받고, 두번째 파라미터로 생성된 data를 받는다. 생성된 데이터는 하나이므로 단수형이다 에러 없이 contact data가 생성되면 /contacts로 redirect한다.
router.post("/", function (req, res) {
    Contact.create(req.body, function (err, contact) {
        if (err) return res.json(err);
        res.redirect("/contacts");
    });
});

// Contacts - show 3-3 : "contacts/:id"에 get 요청이 오는 경우
// :id처럼 route에 골론을 사용하면 해당 위치의 값을 받아 req.params에 넣게 된다. 예) "contacts/abcd1234" => req.params.id에 abcd1234가 입력됨
// Model.findOne 함수는 해당 모델의 document(문서)를 하나 찾는 함수이다. 첫번째 파라미터로 찾을 조건을 object로 입력하고 data를 찾은 후 콜백함수를 호출한다. model.findOne은 조건에 맞는 결과를 하나만 찾아 오브젝트로 전달한다. ==> 여기서는 _id가 req.params.id와 일치하는 data를 찾는 조건이다.
// 에러가 없다면 검색 결과를 받아 views/contacts/show.ejs를 render
router.get("/:id", function (req, res) {
    Contact.findOne({ _id: req.params.id }, function (err, contact) {
        if (err) return res.json(err);
        res.render("contacts/show", { contact: contact });
    });
});

// Contacts - edit 3-4 : "contacts/:id/edit"에 get 요청이 오는 경우
// 검색 결과를 받아 views/contacts/edit.ejs를 render합니다.
router.get("/:id/edit", function (req, res) {
    Contact.findOne({ _id: req.params.id }, function (err, contact) {
        if (err) return res.json(err);
        res.render("contacts/edit", { contact: contact });
    });
});

// Contacts - updata 3-5 : "contacts/:id"에 put 요청이 오는 경우
// Model.findOneAndUpdate는 DB에서 해당 model의 document를 하나 찾아 그 data를 수정하는 함수이다.
// 첫번째 파라미터로 찾을 조건을 object로 입력하고, 두번째 파라미터로 update할 정보를 object로 입력 data를 찾은 후 콜백함수를 호출한다. 이때 호출함수로 넘겨지는 값은 수정되기 전 값이다.
// Data 수정 후 "/contacts/"+req.params.id로 redirect한다.
router.put("/:id", function (req, res) {
    Contact.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, contact) {
        if (err) return res.json(err);
        res.redirect("/contacts/" + req.params.id);
    });
});

// Contacts - destroy 3-6 : "contacts/:id"에 delete 요청이 오는 경우
// Model.deleteOne은 DB에서 해당 model의 document를 하나 찾아 삭제하는 함수. 첫번째 parameter로 찾을 조건을 object로 입력하고 data를 찾은 후 callback함수를 호출합니다.
// Data 삭제후 "/contacts"로 redirect합니다.
router.delete("/:id", function (req, res) {
    Contact.deleteOne({ _id: req.params.id }, function (err) {
        if (err) return res.json(err);
        res.redirect("/contacts");
    });
});

module.exports = router;
