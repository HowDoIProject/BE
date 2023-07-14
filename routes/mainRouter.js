const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const { Posts, Users, Categories, PostsLikes, PostsScraps, sequelize } = require("../models");
const { Op } = require("sequelize");

const MainController = require("../controllers/mainController")
const mainController = new MainController();

//게시글 전체 조회
router.get("/post", mainController.getAllPost);

//top5 게시글 조회
router.get("/topfive", mainController.getTopPost);

//인기글 목록 조회
router.get("/topfive/:page", mainController.popularPost);

//검색기능
router.post("/search/:keyword/:page", mainController.serchPost);

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
        const target_user = await Users.findAll({
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
            limit: 3,
            raw: true,
        });

        //비슷한 유저가 없을때
        if (target_user.length === 0){
            
            //관심있는 카테고리와 일치하는 게시글을 보여준다.
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
                raw: true,

            })
        } else {
            const result = [];
            const promises_1 = target_user.map(async (item) => {
                const posts = await PostsLikes.findAll({
                    attributes: [
                        "post_id"
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
                                        [Op.gte]: new Date(year, month-1, day),
                                    },
                                },
                                {
                                    user_id: item.user_id
                                }
                            ],
                    },
                    raw: true
                })

                const promises_2 = posts.map(async (item) => {
                    const targetPosts = await Posts.findAll({
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
                        where: {post_id: item.post_id},
                        include: [
                            {
                                model: Users,
                                attributes: [],
                            },
                        ],
                        limit: 5,
                        raw: true
                    })
                    
                    result.push(targetPosts)
                })
            })
            
            return res.status(200).json({ result });
        }
    } catch (e) {
        // 예외 처리
        console.log(e);
        return res.status(400).json({ message: "목록 조회에 실패했습니다." });
    }
});

module.exports = router;
