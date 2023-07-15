const { Posts, Users, sequelize, PostsScraps } = require("../models");
const { Op } = require("sequelize");
class PostRepository {
    constructor() { }

    checkPost = async ({ post_id }) => {
        const targetPost = await Posts.findOne({ where: { post_id } });
        return targetPost
    }
    findAllPost = async({page}) => {
        return await Posts.findAll({
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
    }
    getAllPost = async () => {
        return await Posts.findAll({
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
    }

    getTopPost = async ({ year, month, day, d }) => {
        return await Posts.findAll({
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
    }
    getLimitPost = async ({ year, month, day, d, page }) => {
        return await Posts.findAll({
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
        })
    }
    getPostByKeyword = async ({ keyword, page }) => {
        return await Posts.findAll({
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
    }
    findAllByCatagory = async({one,two,three}) => {
        return await Posts.findAll({
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
    }
    findByCategory = async({ category }) => {
        return await Posts.findAll({
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
    }
    findLimitPostByCategory = async({ category, page }) => {
        return await Posts.findAll({
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
    }
    findAllBypostId = async({item}) => {
        return await Posts.findAll({
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
    }
    findAllByfilter = async({filter}) => {
        return await Posts.findAll({
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
                    where: {
                        user_type: filter,
                    },
                },
            ],
            order: [["created_at", "DESC"]],
            raw: true,
        });
    }
    findByfilter = async({filter, page}) => {
        return await Posts.findAll({
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
    }
    findAllByCategoryFilter = async({ category, filter }) => {
        return await Posts.findAll({
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
    }
    findLimitByCategoryFilter = async({category, filter,page}) => {
        return await Posts.findAll({
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
    }
    findAllPostscrapByUserId = async({user_id, page}) => {
        return await Posts.findAll({
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
    }
    findAllPostscrapByCategory = async({user_id, category, page}) => {
        return await Posts.findAll({
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
    }
    findAllPostscrapOrderByPostId = async({user_id}) => {
        return await Posts.findAll({
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
    }
    findscrapByCategory = async({user_id, category}) => {
        return await Posts.findAll({
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
    }
    getAllMypage = async({user_id}) => {
        return await Posts.findAll({
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
    }
    getMypage = async({user_id, page}) => {
        return await Posts.findAll({
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
    }
    findAllPosts = async({user_id}) => {
        return await Posts.findAll({
            where: { user_id }
        });
    }
    createPost = async ({
        user_id,
        nickname,
        title,
        content,
        image,
        category,
    }) => {
        await Posts.create({
            user_id,
            nickname,
            title,
            content,
            image,
            category,
        })
    }

    updatePost = async ({
        title,
        content,
        category,
        image,
        post_id,
    }) => {
        await Posts.update(
            {
                title,
                content,
                category,
                image: image,
            },
            {
                where: { post_id },
            }
        )
    }

    deletePost = async ({ post_id }) => {
        await Posts.destroy({
            where: { post_id },
        })
    }
    deleteScrap = async({item}) => {
        await Posts.destroy({
            where: { post_id: item.post_id },
        })
    }

    detailPost = async ({ post_id }) => {
        return await Posts.findOne({
            attributes: [
                "post_id",
                "user_id",
                [sequelize.col("nickname"), "nickname"],
                [sequelize.col("user_type"), "user_type"],
                "title",
                "content",
                "category",
                "image",
                "scrap_num",
                "like_num",
                "comment_num",
                "created_at",
                "updated_at",
            ],
            where: { post_id },
            include: [
                {
                    model: Users,
                    attributes: [],
                },
            ],
            group: ["Posts.post_id"],
            raw: true,
        });
    }

    updateCommentCount = async ({ comment_num, post_id }) => {
        await Posts.update(
            {
                comment_num: comment_num,
            },
            {
                where: { post_id: post_id },
            }
        )
    }

    updateLike = async ({ like_num, post_id }) => {
        await Posts.update(
            {
                like_num: like_num.length,
            },
            {
                where: { post_id: post_id },
            }
        );
    }

    updateScrap = async ({ scrap_num, post_id }) => {
        await Posts.update(
            {
                scrap_num: scrap_num.length,
            },
            {
                where: { post_id: post_id },
            }
        );
    }
    postCount = async() => {
        return await Posts.count();
    }

}
module.exports = PostRepository;