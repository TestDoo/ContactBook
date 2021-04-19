var mongoose = require("mongoose");

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

module.exports = Contact;
