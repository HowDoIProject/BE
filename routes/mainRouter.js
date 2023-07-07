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
                "comment_num",
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
router.get("/topfive", async (req, res) => {
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
                "comment_num",
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

//검색기능
router.post("/search/:keyword/:page", async (req, res, next) => {
    const keyword = req.params.keyword;
    const { page } = req.params;

    const post_search = await Posts.findAll({
        attributes: [
            "post_id",
            "user_id",
            [sequelize.col("nickname"), "nickname"],
            [sequelize.col("user_type"), "user_type"],
            "title",
            "content",
            "image",
            "category",
            "scrap_num",
            "like_num",
            "comment_num",
            "created_at",
            "updated_at",
        ],
        include: [
            {
                model: Users,
                attributes: [],
            },
        ],
        where: {
            [Op.or]: [
                {
                    title: {
                        [Op.like]: "%" + keyword + "%",
                    },
                },
                {
                    content: {
                        [Op.like]: "%" + keyword + "%",
                    },
                },
            ],
        },
        order: [["created_at", "DESC"]],
        offset: (page - 1) * 10,
        limit: 10,
        raw: true,
    });
    const result = [];
    post_search.forEach((item) => {
        const scroll_result = {
            post_id: item.post_id,
            user_id: item.user_id,
            nickname: item.nickname,
            user_type: item.user_type,
            title: item.title,
            content: item.content,
            image: item.image,
            category: item.category,
            like_num: item.like_num,
            scrap_num: item.scrap_num,
            comment_num: item.comment_num,
            created_at: item.created_at,
            updated_at: item.updated_at,
        };
        result.push(scroll_result);
    });
    const total_count = await Posts.count();
    const total_page = Math.ceil(total_count / 10);
    const last_page = total_page == page ? true : false;

    const Result_Json = JSON.stringify(result);
    const temp = JSON.parse(`${Result_Json}`);
    return res.status(200).json({
        result: temp,
        page: Number(page),
        last_page: last_page,
        total_page: total_page,
    });
});

//추천 게시글 조회
router.get("/recommend", auth, async (req, res) => {
    try {
        const d = new Date();

        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();

        const { user_id } = res.locals.id;
        const { nickname } = res.locals.user;
        const { user_type } = res.locals.type;

        const { age } = await Users.findOne({
            attributes: ["age"],
            where: { user_id },
            raw: true,
        });

        // 비슷한 회원 검색
        const target_user = await Users.findAll({
            where: { 
                user_type,
                age,
                user_id: {
                    [Op.ne]: user_id
                }
             },
            raw: true,
        });
        console.log(target_user.length);

        if (target_user.length === 0){
            const recommend = await Posts.findAll({

            })
        }
        // 게시글 목록 조회
        const recommend = await Posts.findAll({
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
                "comment_num",
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

module.exports = router;
