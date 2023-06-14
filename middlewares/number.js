module.exports = async (req, res, next) => {
  try {
    const verification = req.cookies.verification;
    // # 403 Cookie가 존재하지 않을 경우
    if (!verification) {
      return res
        .status(403)
        .json({ message: "문자 인증을 진행하여 주십시오." });
    }

    next();
  } catch (error) {
    console.log("error : ", error);
    res.clearCookie("verification");
    return res.status(403).json({
      message: "요청이 올바르지 않습니다.",
    });
  }
};