var express = require("express");
var router = express.Router();

// Home : / 에 get 요청이 오는 경우 -> /contacts로 redirect하는 코드
// redirect함수는 설정 경로로 이동시키는 함수이다.
router.get("/", function (req, res) {
    res.redirect("/contacts");
});

// 여기에 담긴 object가 moduel이 되어 require시에 사용된다.
module.exports = router;
