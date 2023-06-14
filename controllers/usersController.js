const UserService = require("../services/usersService");

class UserController {
    userService = new UserService();

    login = async (req, res) => {
        try {
            const { user_number, password } = req.body;

            // 입력값 유효성 검사
            if (!user_number || !password) {
                return res.status(406).json({
                    message: "전화번호와 비밀번호는 필수 입력값입니다.",
                });
            }
            // 유저 로그인 및 토큰 생성
            const token = await this.userService.login(user_number, password);

            // JWT 토큰을 header로 전달 (body로 전달하는 값은 백엔드 내부 확인용)
            res.set("Authorization", `Bearer ${token}`, { secure: true });

            // JWT 토큰을 cookie로 전달 (body로 전달하는 값은 백엔드 내부 확인용)
            res.cookie("Authorization", `Bearer ${token}`, { secure: true });

            return res.status(200).json({ Authorization: `Bearer ${token}` });
        } catch (err) {
            console.error(err);
            return res.status(406).json({
                message: "로그인 실패",
            });
        }
    };
}

module.exports = UserController;
