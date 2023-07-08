const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { Posts, Users, Comments, PostsLikes, PostsScraps, sequelize } = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

router.get("/scrap/:filter/:category/:page", auth, async (req, res) => {
    try {
        const user_id = res.locals.id;
        const { page } = req.params;
        let { filter, category } = req.params;
        const { refresh, access } = req.headers;

        if (filter === "0" && category === "0") {
            // 게시글 목록 조회
            const list = await Posts.findAll({
                attributes: [
                    "post_id",
                    "user_id",
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
                        model: PostsScraps,
                        where: { user_id: user_id.user_id },
                        include: [
                            {
                                model: Users,
                            },
                        ],
                    },
                ],
                order: [["created_at", "DESC"]],
                offset: (page - 1) * 10,
                limit: 10,
                raw: true,
            });
            const result = [];
            const promises = list.map(async (item) => {
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
                    nickname: item["PostsScraps.User.nickname"],
                    user_type: item["PostsScraps.User.user_type"],
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
    
            const total_count = await Posts.count();
            const total_page = Math.ceil(total_count / 10);
            const last_page = total_page == page ? true : false;
            const Result_Json = JSON.stringify(result);

            const temp = JSON.parse(`${Result_Json}`);

            return res.status(200).json({
                mypage: temp,
                page: Number(page),
                last_page: last_page,
                total_page: total_page,
            });
        } else if (filter === "0" && category !== "0") {
            if (category === "1") {
                category = "생활비";
            } else if (category === "2") {
                category = "자취끼니";
            } else if (category === "3") {
                category = "집안일";
            }

            const list = await Posts.findAll({
                attributes: [
                    "post_id",
                    "user_id",
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
                        model: PostsScraps,
                        where: { user_id: user_id.user_id },
                        include: [
                            {
                                model: Users,
                            },
                        ],
                    },
                ],
                where: { category },
                order: [["created_at", "DESC"]],
                offset: (page - 1) * 10,
                limit: 10,
                raw: true,
            });

            const result = [];
            const promises = list.map(async (item) => {
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
                    nickname: item["PostsScraps.User.nickname"],
                    user_type: item["PostsScraps.User.user_type"],
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
    
            const total_count = await Posts.count();
            const total_page = Math.ceil(total_count / 10);
            const last_page = total_page == page ? true : false;
            const Result_Json = JSON.stringify(result);

            const temp = JSON.parse(`${Result_Json}`);

            return res.status(200).json({
                mypage: temp,
                page: Number(page),
                last_page: last_page,
                total_page: total_page,
            });
        } else if (filter !== "0" && category === "0") {
            //작은 따옴표로 해야함
            if (filter === "1") {
                filter = '강아지';
            } else if (filter === "2") {
                filter = '엄빠';
            }
            const list = await Posts.findAll({
                attributes: [
                    "post_id",
                    "user_id",
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
                        model: PostsScraps,
                        where: { user_id: user_id.user_id },
                        include: [
                            {
                                model: Users,
                            },
                        ],
                    },
                ],
                order: [["created_at", "DESC"]],
                offset: (page - 1) * 10,
                limit: 10,
                raw: true,
            });

            const result = [];
            const promises = list.map(async (item) => {
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
                    nickname: item["PostsScraps.User.nickname"],
                    user_type: item["PostsScraps.User.user_type"],
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
    
            const total_count = await Posts.count();
            const total_page = Math.ceil(total_count / 10);
            const last_page = total_page == page ? true : false;
            const Result_Json = JSON.stringify(result);

            const temp = JSON.parse(`${Result_Json}`);

            return res.status(200).json({
                mypage: temp,
                page: Number(page),
                last_page: last_page,
                total_page: total_page,
            });
        } else {
            if (filter === "1") {
                filter = '강아지';
            } else if (filter === "2") {
                filter = '엄빠';
            }

            if (category === "1") {
                category = "생활비";
            } else if (category === "2") {
                category = "자취끼니";
            } else if (category === "3") {
                category = "집안일";
            }

            const list = await Posts.findAll({
                attributes: [
                    "post_id",
                    "user_id",
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
                        model: PostsScraps,
                        where: { user_id: user_id.user_id },
                        include: [
                            {
                                model: Users,
                            },
                        ],
                    },
                ],
                where: { category },
                order: [["created_at", "DESC"]],
                offset: (page - 1) * 10,
                limit: 10,
                raw: true,
            });

            const result = [];
            const promises = list.map(async (item) => {
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
                    nickname: item["PostsScraps.User.nickname"],
                    user_type: item["PostsScraps.User.user_type"],
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
    
            const total_count = await Posts.count();
            const total_page = Math.ceil(total_count / 10);
            const last_page = total_page == page ? true : false;
            const Result_Json = JSON.stringify(result);

            const temp = JSON.parse(`${Result_Json}`);

            return res.status(200).json({
                mypage: temp,
                page: Number(page),
                last_page: last_page,
                total_page: total_page,
            });
        }
        // 게시글 목록 조회
    } catch (e) {
        // 예외 처리
        return res
            .status(400)
            .json({ message: "목록 조회에 실패했습니다." + e });
    }
});

router.delete("/scrap/:filter/:category", auth, async (req, res) => {
    try {
        const user_id = res.locals.id;
        const { page } = req.params;
        let { filter, category } = req.params;

        if (filter === "0" && category === "0") {
            // 게시글 목록 조회
            const list = await Posts.findAll({
                attributes: [
                    "post_id",
                    "user_id",
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
                        model: PostsScraps,
                        where: { user_id: user_id.user_id },
                        include: [
                            {
                                model: Users,
                            },
                        ],
                    },
                ],
                order: [["post_id", "DESC"]],
                raw: true,
            });
            list.forEach(async(item) => {
                await Posts.destroy({
                    where: { post_id: item.post_id },
                })
            });
            return res
            .status(200)
            .json({ message: "게시글을 삭제하였습니다."});
        } else if (filter === "0" && category !== "0") {
            if (category === "1") {
                category = "생활비";
            } else if (category === "2") {
                category = "자취끼니";
            } else if (category === "3") {
                category = "집안일";
            }

            const list = await Posts.findAll({
                attributes: [
                    "post_id",
                    "user_id",
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
                        model: PostsScraps,
                        where: { user_id: user_id.user_id },
                        include: [
                            {
                                model: Users,
                            },
                        ],
                    },
                ],
                where: { category },
                raw: true,
            });

            list.forEach(async(item) => {
                await Posts.destroy({
                    where: { post_id: item.post_id },
                })
            });
            return res
            .status(200)
            .json({ message: "게시글을 삭제하였습니다."});

        } else if (filter !== "0" && category === "0") {
            //작은 따옴표로 해야함
            if (filter === "1") {
                filter = '강아지';
            } else if (filter === "2") {
                filter = '엄빠';
            }
            const list = await Posts.findAll({
                attributes: [
                    "post_id",
                    "user_id",
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
                        model: PostsScraps,
                        where: { user_id: user_id.user_id },
                        include: [
                            {
                                model: Users,
                            },
                        ],
                    },
                ],
                order: [["created_at", "DESC"]],
                raw: true,
            });

            list.forEach(async(item) => {
                await Posts.destroy({
                    where: { post_id: item.post_id },
                })
            });
            return res
            .status(200)
            .json({ message: "게시글을 삭제하였습니다."});
        } else {
            if (filter === "1") {
                filter = '강아지';
            } else if (filter === "2") {
                filter = '엄빠';
            }

            if (category === "1") {
                category = "생활비";
            } else if (category === "2") {
                category = "자취끼니";
            } else if (category === "3") {
                category = "집안일";
            }

            const list = await Posts.findAll({
                attributes: [
                    "post_id",
                    "user_id",
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
                        model: PostsScraps,
                        where: { user_id: user_id.user_id },
                        include: [
                            {
                                model: Users,
                            },
                        ],
                    },
                ],
                where: { category },
                order: [["created_at", "DESC"]],
                raw: true,
            });

            list.forEach(async(item) => {
                await Posts.destroy({
                    where: { post_id: item.post_id },
                })
            });
            return res
            .status(200)
            .json({ message: "게시글을 삭제하였습니다."});
        }


        // 게시글 목록 조회
    } catch (e) {
        // 예외 처리
        return res
            .status(400)
            .json({ message: "목록 조회에 실패했습니다." + e });
    }
});

module.exports = router;
