const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { Posts, Users, sequelize } = require("../models");
const { Op } = require("sequelize");

router.get("/mypage", auth, async (req, res) => {
    try {
        const user_id = res.locals.id
        console.log(user_id.user_id)
        // 게시글 목록 조회
        const mypage = await Posts.findAll({
            attributes: [
                "post_id",
                "user_id",
                [sequelize.col("nickname"), "nickname"],
                "title",
                "content",
                "image",
                "category",
                "scrap_num",
                "like_num",
                "created_at",
                "updated_at",
            ],
            where: {user_id: user_id.user_id},
            include: [
                {
                    model: Users,
                    attributes: [],
                },
            ],
            order: [["created_at", "DESC"]],
            raw: true,
        });

        // 작성된 게시글이 없을 경우
        if (mypage.length === 0) {
            return res
                .status(400)
                .json({ message: "작성된 게시글이 없습니다." });
        }
        // 게시글 목록 조회
        return res.status(200).json({ mypage });
    } catch (e) {
        // 예외 처리
        return res.status(400).json({ message: "목록 조회에 실패했습니다." + e });
    }
});
module.exports = router;
