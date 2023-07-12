const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
    Posts,
    Users,
    PostsLikes,
    PostsScraps,
    sequelize,
} = require("../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

router.get("/list/:filter/:category/:page", async (req, res) => {
    try {
        const { page } = req.params;
        let { filter, category } = req.params;
        const { refresh, access } = req.headers;

        if (filter === "0" && category === "0") {
            // 게시글 목록 조회
            const list = await Posts.findAll({
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
                order: [["created_at", "DESC"]],
                offset: (page - 1) * 10,
                limit: 10,
                raw: true,
            });

            const result = [];
            const promises = list.map(async (item) => {
                let like_check = false;
                let scrap_check = false;
                if (access) {
                    const ACCESS_KEY = "howdoi_";

                    const [accessType, accessToken] = access.split(" ");
                    const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                    const { user_id } = decodedAccess.user_id;

                    const like_search = await PostsLikes.findOne({
                        attributes: ["post_id", "user_id"],
                        where: { user_id: user_id, post_id: item.post_id },
                        raw: true,
                    });
                    if (like_search) {
                        like_check = true;
                    } else {
                        like_check = false;
                    }
                    const scrap_search = await PostsScraps.findOne({
                        attributes: ["post_id", "user_id"],
                        where: { user_id: user_id, post_id: item.post_id },
                        raw: true,
                    });
                    if (scrap_search) {
                        scrap_check = true;
                    } else {
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
                if(a.created_at < b.created_at) return 1;
                if(a.created_at > b.created_at) return -1;
                return 0;
            })
            const total_count = await Posts.count();
            const total_page = Math.ceil(total_count / 10);
            const last_page = total_page == page ? true : false;
            const Result_Json = JSON.stringify(result_sort);

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
            const pages = await Posts.findAll({
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
                where: { category },
                include: [
                    {
                        model: Users,
                        attributes: [],
                    },
                ],
                order: [["created_at", "DESC"]],
                raw: true,
            });

            const list = await Posts.findAll({
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
                where: { category },
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
            const promises = list.map(async (item) => {
                let like_check = false;
                let scrap_check = false;
                if (access) {
                    const ACCESS_KEY = "howdoi_";

                    const [accessType, accessToken] = access.split(" ");
                    const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                    const { user_id } = decodedAccess.user_id;

                    const like_search = await PostsLikes.findOne({
                        attributes: ["post_id", "user_id"],
                        where: { user_id: user_id, post_id: item.post_id },
                        raw: true,
                    });
                    if (like_search) {
                        like_check = true;
                    } else {
                        like_check = false;
                    }
                    const scrap_search = await PostsScraps.findOne({
                        attributes: ["post_id", "user_id"],
                        where: { user_id: user_id, post_id: item.post_id },
                        raw: true,
                    });
                    if (scrap_search) {
                        scrap_check = true;
                    } else {
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
                if(a.created_at < b.created_at) return 1;
                if(a.created_at > b.created_at) return -1;
                return 0;
            })
            const total_page = Math.ceil(pages.length / 10);
            const last_page = total_page == page ? true : false;
            const Result_Json = JSON.stringify(result_sort);

            const temp = JSON.parse(`${Result_Json}`);
            return res.status(200).json({
                mypage: temp,
                page: Number(page),
                last_page: last_page,
                total_page: total_page,
            });
        } else if (filter !== "0" && category === "0") {
            if (filter === "1") {
                filter = '강아지';
            } else if (filter === "2") {
                filter = '엄빠';
            }

            const pages = await Posts.findAll({
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
                where: {},
                include: [
                    {
                        model: Users,
                        attributes: [],
                        where: {
                            user_type: filter,
                        },
                    },
                ],
                order: [["created_at", "DESC"]],
                raw: true,
            });

            const list = await Posts.findAll({
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
                where: {},
                include: [
                    {
                        model: Users,
                        attributes: [],
                        where: {
                            user_type: filter,
                        },
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
                if (access) {
                    const ACCESS_KEY = "howdoi_";

                    const [accessType, accessToken] = access.split(" ");
                    const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                    const { user_id } = decodedAccess.user_id;

                    const like_search = await PostsLikes.findOne({
                        attributes: ["post_id", "user_id"],
                        where: { user_id: user_id, post_id: item.post_id },
                        raw: true,
                    });
                    if (like_search) {
                        like_check = true;
                    } else {
                        like_check = false;
                    }
                    const scrap_search = await PostsScraps.findOne({
                        attributes: ["post_id", "user_id"],
                        where: { user_id: user_id, post_id: item.post_id },
                        raw: true,
                    });
                    if (scrap_search) {
                        scrap_check = true;
                    } else {
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
                if(a.created_at < b.created_at) return 1;
                if(a.created_at > b.created_at) return -1;
                return 0;
            })
            const total_page = Math.ceil(pages.length / 10);
            const last_page = total_page == page ? true : false;
            const Result_Json = JSON.stringify(result_sort);

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

            const pages = await Posts.findAll({
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
                where: { category },
                include: [
                    {
                        model: Users,
                        attributes: [],
                        where: {
                            user_type: filter,
                        },
                    },
                ],
                order: [["created_at", "DESC"]],
                raw: true,
            });

            const list = await Posts.findAll({
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
                where: { category },
                include: [
                    {
                        model: Users,
                        attributes: [],
                        where: {
                            user_type: filter,
                        },
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
                if (access) {
                    const ACCESS_KEY = "howdoi_";

                    const [accessType, accessToken] = access.split(" ");
                    const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                    const { user_id } = decodedAccess.user_id;

                    const like_search = await PostsLikes.findOne({
                        attributes: ["post_id", "user_id"],
                        where: { user_id: user_id, post_id: item.post_id },
                        raw: true,
                    });
                    if (like_search) {
                        like_check = true;
                    } else {
                        like_check = false;
                    }
                    const scrap_search = await PostsScraps.findOne({
                        attributes: ["post_id", "user_id"],
                        where: { user_id: user_id, post_id: item.post_id },
                        raw: true,
                    });
                    if (scrap_search) {
                        scrap_check = true;
                    } else {
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
                if(a.created_at < b.created_at) return 1;
                if(a.created_at > b.created_at) return -1;
                return 0;
            })
            const total_page = Math.ceil(pages.length / 10);
            const last_page = total_page == page ? true : false;
            const Result_Json = JSON.stringify(result_sort);

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

module.exports = router;
