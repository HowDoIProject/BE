const { TokenUtil } = require("../utils/tokenUtils");
const UserRepository = require("../repositories/usersRepository");
const bcrypt = require("bcrypt")

class UserService {
    userRepository = new UserRepository();

    login = async (user_number, password) => {
        // User 조회
        const user = await this.userRepository.getOneUser({ user_number });

        // User 아이디 및 비밀번호 유효성 검사
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw "전화번호 또는 비밀번호를 확인해주십시오."
        }

        // JWT 토큰 생성
        const tokenUtil = new TokenUtil(
            user.nickname,
            user.user_type,
            user.category
        );
        const token = tokenUtil.createToken();

        return token;
    };
}

module.exports = UserService;
