const jwt = require("jsonwebtoken");
const { VerifyToken } = require("../utils/tokenUtils");

// dotenv 파일을 통해 시크릿 정보 가저오기
const secretKey = "howdoi_";

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  try {
    // req.header에 토큰 정보가 있는지 확인
    if (req.headers.authorization === undefined) {
        return res
        .status(400)
        .json({ message: "로그인 후 이용가능합니다." });
    }

    // 토큰 입력값 검증
    const token = req.headers.authorization;
    const [AuthType, AuthToken] = (token ?? "").split(" ");
    if (!AuthToken || AuthType !== "Bearer") {
        return res
        .status(400)
        .json({ message: "로그인 후 이용 가능한 기능입니다.(토큰 형식이 올바르지 않음)" });
    }

    // 토큰 유효성 검증을 위한 객체 생성
    const verifyToken = new VerifyToken(AuthToken);

    // 토큰 유효성 검증
    const isTokenValidate = verifyToken.validateToken();
    if (!isTokenValidate) {
        return res
        .status(400)
        .json({ message: "로그인 후 이용 가능한 기능입니다.(유효성 검사 실패)" });
    }

    // 토큰 Decode -> 토큰의 payload에 닮긴 user 정보 추출
    const user = jwt.verify(AuthToken, secretKey);

    res.locals.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "기타 오류",
    });
  }
};