const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Users, Tokens } = require("../models");
const number = require("../middlewares/number");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const user = require("../controllers/authController"); //본인인증
const ACCESS_KEY = 'howdoi_'
const REFRESH_KEY = 'howdoi_1'

// const UsersController = require("../controllers/usersController") //로그인
// const usersController = new UsersController();

//회원가입
router.post("/signup", number, async (req, res) => {
    const {
        user_type,
        user_number,
        nickname,
        category,
        password,
        password_confirm,
    } = req.body;
    const verification = req.headers.verification;

    try {
        //문자인증한 이후 전화번호를 수정하여 가입 시도한 경우
        if (Number(verification) !== Number(user_number)) {
            return res
                .status(403)
                .json({ message: "인증된 번호로 가입하십시오." });
        }

        //모두 입력 했는지 확인
        if (
            !user_type ||
            !user_number ||
            !nickname ||
            !category ||
            !password ||
            !password_confirm
        ) {
            return res
                .status(403)
                .json({ message: "모든 필수 값을 입력해주십시오." });
        }

        //패스워드 형식 확인: 알파벳 + 숫자 6~25자
        const pwCheck = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,25}$/;

        if (!pwCheck.test(password)) {
            return res
                .status(403)
                .json({ message: "유효하지 않은 패스워드 입니다." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        //비밀번호 확인
        if (password !== password_confirm) {
            return res
                .status(403)
                .json({ message: "비밀번호가 일치하지 않습니다." });
        }

        //닉네임 중복확인
        const nickCheck = await Users.findOne({
            where: { nickname },
        });
        if (nickCheck) {
            return res.status(403).json({ message: "중복된 닉네임입니다" });
        }

        //가입 여부 확인 (전화번호로 검증)
        const numCheck = await Users.findOne({
            where: { user_number },
        });
        if (numCheck) {
            return res.status(403).json({ message: "이미 가입한 회원입니다." });
        }

        await Users.create({
            password: hashedPassword,
            user_type,
            user_number,
            nickname,
            category,
        });

        console.log("회원가입 완료");
        res.clearCookie("verification");

        return res.status(201).json({ message: "회원가입을 완료했습니다." });
    } catch (error) {
        res.clearCookie("verification");

        return res
            .status(400)
            .json({ message: "요청이 올바르지 않습니다." } + error);
    }
});

// 문자인증(SENS를 통한) 전송 API
router.post("/send", user.send);

// 문자인증(SENS를 통한) 검증 API
router.post("/verify", user.verify);

//로그인
router.post("/login", async (req, res) => {
    try {
      //이메일 패스워드 받아오기
      let { user_number, password } = req.body;

      //db 확인
      const hashedPassword = await Users.findOne({
        attributes: ["password"],
        where: { [Op.and]: [{ user_number }] },
        raw: true,
      });

      if (!bcrypt.compareSync(password,hashedPassword.password)) {
        return res.status(400).json({ message: "회원 정보가 일치하지 않습니다" });
      }
      console.log(bcrypt.compareSync(password,hashedPassword.password))
      
      const nickname = await Users.findOne({
        attributes: ["nickname"],
        where: { [Op.and]: [{ user_number }] },
        raw: true,
      });

      //토큰 발행
      const refreshToken = jwt.sign({}, REFRESH_KEY, { expiresIn: "1d" });
      const accessToken = jwt.sign({ nickname }, ACCESS_KEY, { expiresIn: "1h" });
      await Tokens.create({
        refreshToken,
        accessToken,
      });
      
      console.log(refreshToken)
      return res
        .status(200)
        .json({ message: "Token이 정상적으로 발급되었습니다.", access: `Bearer ${accessToken}`, refresh: `Bearer ${refreshToken}`});
    } catch (e) {
      //try
      return res.status(400).json({ message: "일치하지 않습니다" + e });
    } //catch
  }); //end


module.exports = router;
