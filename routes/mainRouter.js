const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const { Posts, Users, Categories, PostsLikes, PostsScraps, sequelize } = require("../models");
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
            group: ["Posts.post_id"],
            order: [["created_at", "DESC"]],
            raw: true,
        });
        console.log(posts)
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

//인기글 목록 조회
router.get("/topfive/:page", async (req, res) => {
    try {
        const { page } = req.params;
        const { refresh, access } = req.headers;

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
            offset: (page - 1) * 10,
            limit: 10,
            raw: true,
        });

        // 작성된 게시글이 없을 경우
        if (topfive.length === 0) {
            return res
                .status(400)
                .json({ message: "작성된 게시글이 없습니다." });
        }

        // 게시글 목록 조회
        const result = [];
        const promises = topfive.map(async (item) => {
            let like_check = false;
            let scrap_check = false;
            if(access){
                const ACCESS_KEY = "howdoi_";

                const [accessType, accessToken] = access.split(" ");
                const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                const { user_id } = decodedAccess.user_id
                
                const like_search = await PostsLikes.findOne({
                    attributes: ["post_id","user_id"],
                    where:{ user_id: user_id, post_id: item.post_id},
                    raw: true,
                })
                if(like_search){
                    like_check = true;
                }else{
                    like_check = false;
                }
                const scrap_search = await PostsScraps.findOne({
                    attributes: ["post_id","user_id"],
                    where:{ user_id: user_id, post_id: item.post_id},
                    raw: true,
                })
                if(scrap_search){
                    scrap_check = true;
                }else{
                    scrap_check = false;
                }
            }
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
                like_check: like_check,
                scrap_num: item.scrap_num,
                scrap_check: scrap_check,
                comment_num: item.comment_num,
                created_at: item.created_at,
                updated_at: item.updated_at,
            };
            result.push(scroll_result);
        });
        await Promise.all(promises);
        let result_sort = result.sort((a,b) => {
            if(a.like_num < b.like_num) return 1;
            if(a.like_num > b.like_num) return -1;
            return 0;
        })
        const total_page = 5;
        const last_page = total_page == page ? true : false;

        const Result_Json = JSON.stringify(result_sort);
        const temp = JSON.parse(`${Result_Json}`);
        return res.status(200).json({
            result: temp,
            page: Number(page),
            last_page: last_page,
            total_page: total_page,
        });
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
    const { refresh, access } = req.headers;

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
        const promises = post_search.map(async (item) => {
            let like_check = false;
            let scrap_check = false;
            if(access){
                const ACCESS_KEY = "howdoi_";

                const [accessType, accessToken] = access.split(" ");
                const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                const { user_id } = decodedAccess.user_id
            
                const like_search = await PostsLikes.findOne({
                    attributes: ["post_id","user_id"],
                    where:{ user_id: user_id, post_id: item.post_id},
                    raw: true,
                })
                if(like_search){
                    like_check = true;
                }else{
                    like_check = false;
                }
                const scrap_search = await PostsScraps.findOne({
                    attributes: ["post_id","user_id"],
                    where:{ user_id: user_id, post_id: item.post_id},
                    raw: true,
                })
                if(scrap_search){
                    scrap_check = true;
                }else{
                    scrap_check = false;
                }
            }
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
                like_check: like_check,
                scrap_num: item.scrap_num,
                scrap_check: scrap_check,
                comment_num: item.comment_num,
                created_at: item.created_at,
                updated_at: item.updated_at,
            };
            result.push(scroll_result);
        });
        await Promise.all(promises);

        const total_page = 5;
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
        const { gender } = await Users.findOne({
            attributes: ["gender"],
            where: { user_id },
            raw: true,
        });
        const { category } = await Users.findOne({
            attributes: ["category"],
            where: { user_id },
            raw: true,
        });
        const [one, two, three] = category.split(",")

        // 비슷한 회원 검색
        const target_user = await Users.findOne({
            where: { 
                user_type,
                age,
                gender,
                user_id: {
                    [Op.ne]: user_id
                },
                category: {
                    [Op.or]: [
                        {[Op.like]: "%" + one + "%"},
                        {[Op.like]: "%" + two + "%"},
                        {[Op.like]: "%" + three + "%"}
                    ]
                }
             },
            raw: true,
        });

        if (target_user.length === 0){
            
            const recommend = await Posts.findAll({
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
                where: {               
                    category: {
                        [Op.or]: [
                            {[Op.like]: "%" + one + "%"},
                            {[Op.like]: "%" + two + "%"},
                            {[Op.like]: "%" + three + "%"}
                        ]
                    }
                },
                include: [
                    {
                        model: Users,
                        attributes: [],
                    },
                ],
                order: [["like_num", "DESC"]],
                raw: true,

            })
        } else {
            const recommend = await Posts.findAll({
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
                where: {               
                    
                },
                include: [
                    {
                        model: Users,
                        attributes: [],
                    },
                ],
                order: [["like_num", "DESC"]],
                raw: true,

            })
        }

        return res.status(200).json({ topfive });
    } catch (e) {
        // 예외 처리
        console.log(e);
        return res.status(400).json({ message: "목록 조회에 실패했습니다." });
    }
});

module.exports = router;
