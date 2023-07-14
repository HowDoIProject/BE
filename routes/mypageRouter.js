const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { Posts, Users, Comments, PostsLikes, PostsScraps, sequelize } = require("../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken")

router.get("/mypage", auth, async (req, res) => {
    try {
        const user_id = res.locals.id;
        // 게시글 목록 조회
        const mypage = await Posts.findAll({
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
            where: { user_id: user_id.user_id },
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
        return res
            .status(400)
            .json({ message: "목록 조회에 실패했습니다." + e });
    }
});

router.get("/mypage/:page", auth, async (req, res, next) => {
    const { page } = req.params;
    const user_id = res.locals.id;
    const { refresh, access } = req.headers;

    const mypage = await Posts.findAll({
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
        where: { user_id: user_id.user_id },
        include: [
            {
                model: Users,
                attributes: [],
            },
        ],
        order: [["created_at", "DESC"]],
        offset: (page - 1) * 10,
        limit: 10,
        raw: true,
    });

    const result = [];
    const promises = mypage.map(async (item) => {
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

router.get("/mystat", auth, async (req, res) => {
    try{
        const {user_id} = res.locals.id
        const mypost = await Posts.findAll({
            where: { user_id }
        });
        const mycomment = await Comments.findAll({
            where: { user_id }
        });
        const mylikes = await Comments.sum('like_num', { where: { user_id } })

        return res.status(200).json({
            mypost: mypost.length,
            mycomment: mycomment.length,
            mylikes: mylikes
        });
 
    }catch(error){
        // 예외 처리
        return res
            .status(400)
            .json({ message: "조회에 실패했습니다." + error });
    }
})

//내가 작성한 댓글
router.get("/mycomment", auth, async (req, res) => {
    try {
        const user_id = res.locals.id;
        // 게시글 목록 조회
        const mycomment = await Comments.findAll({
            attributes: [
                "comment_id",
                "user_id",
                "comment",
                "image",
                "chosen",
                [sequelize.col("category"), "category"],
                "created_at",
                "updated_at",
            ],
            where: { user_id: user_id.user_id },
            include: [
                {
                    model: Posts,
                    attributes: [],
                },
            ],
            order: [["created_at", "DESC"]],
            raw: true,
        });

        // 작성된 게시글이 없을 경우
        if (mycomment.length === 0) {
            return res.status(400).json({ message: "작성된 댓글이 없습니다." });
        }
        // 게시글 목록 조회
        return res.status(200).json({ mycomment });
    } catch (e) {
        // 예외 처리
        return res
            .status(400)
            .json({ message: "목록 조회에 실패했습니다." + e });
    }
});

//내가 채택한 댓글
router.get("/chosencomment", auth, async (req, res) => {
    try {
        const user_id = res.locals.id;
        // 게시글 목록 조회
        const chosencomment = await Comments.findAll({
            attributes: [
                "comment_id",
                "user_id",
                "post_id",
                "comment",
                "image",
                "chosen",
                [sequelize.col("category"), "category"],
                "created_at",
                "updated_at",
            ],
            where: { chosen: 1 },
            include: [
                {
                    model: Posts,
                    attributes: [],
                    where: {
                        user_id: user_id.user_id,
                    },
                },
            ],
            order: [["created_at", "DESC"]],
            raw: true,
        });
        console.log(chosencomment)
        // 작성된 게시글이 없을 경우
        if (chosencomment.length === 0) {
            return res.status(400).json({ message: "작성된 댓글이 없습니다." });
        }
        // 게시글 목록 조회
        return res.status(200).json({ chosencomment });
    } catch (e) {
        // 예외 처리
        return res
            .status(400)
            .json({ message: "목록 조회에 실패했습니다." + e });
    }
});

//나의 채택된 댓글
router.get("/mychosencomment", auth, async (req, res) => {
    try {
        const user_id = res.locals.id;
        // 게시글 목록 조회
        const mychosencomment = await Comments.findAll({
            attributes: [
                "comment_id",
                "user_id",
                "post_id",
                "comment",
                "image",
                "chosen",
                [sequelize.col("category"), "category"],
                "created_at",
                "updated_at",
            ],
            where: { chosen: 1, user_id:user_id.user_id },
            include: [
                {
                    model: Posts,
                    attributes: [],
                },
            ],
            order: [["created_at", "DESC"]],
            raw: true,
        });
        // 작성된 댓글이 없을 경우
        if (mychosencomment.length === 0) {
            return res.status(400).json({ message: "작성된 댓글이 없습니다." });
        }
        // 댓글 목록 조회
        return res.status(200).json({ mychosencomment });
    } catch (e) {
        // 예외 처리
        return res
            .status(400)
            .json({ message: "목록 조회에 실패했습니다." + e });
    }
});

module.exports = router;
