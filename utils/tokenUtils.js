const jwt = require("jsonwebtoken");

// 시크릿 키 정의
const secretKey = "howdoi_";

class TokenUtil {
    constructor(nickname, user_type, category) {
        this.nickname = nickname;
        this.user_type = user_type;
        this.category = category;
    }

    // Token 생성 메서드
    createToken() {
        const token = jwt.sign(
            {
                nickname: this.nickname,
                user_type: this.user_type,
                category: this.category,
            },
            secretKey,
            {
                expiresIn: "7d",
            }
        );
        return token;
    }
}

class VerifyToken {
    constructor(token) {
        this.token = token;
    }

    // Access Token 검증 함수
    validateToken() {
        try {
            const payload = jwt.verify(this.token, secretKey);
            return payload;
        } catch (error) {
            return false;
        }
    }
}

module.exports = {
    TokenUtil,
    VerifyToken,
};
