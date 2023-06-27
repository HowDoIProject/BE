const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { Posts, Users, Categories, sequelize } = require("../models");
const { Op } = require("sequelize");

//게시글 전체 조회
router.get("/post", async (req, res) => {
    try {
        // 게시글 목록 조회
        const posts = await Posts.findAll({
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
            include: [
                {
                    model: Users,
                    attributes: [],
                },
            ],
            group: ["Posts.post_id"],
            order: [["created_at", "DESC"]],
            raw: true,
        });

        // 작성된 게시글이 없을 경우
        if (posts.length === 0) {
            return res
                .status(400)
                .json({ message: "작성된 게시글이 없습니다." });
        }
        // 게시글 목록 조회
        return res.status(200).json({ posts });
    } catch (e) {
        // 예외 처리
        console.log(e);
        return res.status(400).json({ message: "목록 조회에 실패했습니다." });
    }
});

//top5 게시글 조회
router.get("/post/topfive", async (req, res) => {
    try {
        // 게시글 목록 조회
        const d = new Date();

        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const topfive = await Posts.findAll({
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
            where: {
                [Op.and]: [
                    {
                        created_at: {
                            [Op.lt]: d,
                        },
                    },
                    {
                        created_at: {
                            [Op.gte]: new Date(year, month, day - 6),
                        },
                    },
                ],
            },
            include: [
                {
                    model: Users,
                    attributes: [],
                },
            ],
            group: ["Posts.post_id"],
            order: [["like_num", "DESC"]],
            raw: true,
        });

        // 작성된 게시글이 없을 경우
        if (topfive.length === 0) {
            return res
                .status(400)
                .json({ message: "작성된 게시글이 없습니다." });
        }
        // 게시글 목록 조회
        return res.status(200).json({ topfive });
    } catch (e) {
        // 예외 처리
        console.log(e);
        return res.status(400).json({ message: "목록 조회에 실패했습니다." });
    }
});

//추천 게시글 조회
// router.get("/recommend", auth, async (req, res) => {
//     try {
//         const user_id = res.locals.id;
//         const nickname = res.locals.user;
//         const user_type = res.locals.type;
  
//         // 게시글 목록 조회
//         const recommend = await Posts.findAll({
//             attributes: [
//                 "post_id",
//                 "user_id",
//                 [sequelize.col("nickname"), "nickname"],
//                 "title",
//                 "content",
//                 "image",
//                 "category",
//                 "scrap_num",
//                 "like_num",
//                 "created_at",
//                 "updated_at",
//             ],
//             where: {
//                 [Op.and]: [
//                     {
//                         created_at: {
//                             [Op.lt]: d,
//                         },
//                     },
//                     {
//                         created_at: {
//                             [Op.gte]: new Date(year, month, day - 6),
//                         },
//                     },
//                 ],
//             },
//             include: [
//                 {
//                     model: Users,
//                     attributes: [],
//                 },
//             ],
//             group: ["Posts.post_id"],
//             order: [["like_num", "DESC"]],
//             raw: true,
//         });

//         // 작성된 게시글이 없을 경우
//         if (topfive.length === 0) {
//             return res
//                 .status(400)
//                 .json({ message: "작성된 게시글이 없습니다." });
//         }
//         // 게시글 목록 조회
//         return res.status(200).json({ topfive });
//     } catch (e) {
//         // 예외 처리
//         console.log(e);
//         return res.status(400).json({ message: "목록 조회에 실패했습니다." });
//     }
// });

module.exports = router;
