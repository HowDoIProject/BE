const { Posts,
    Users,
    Comments,
    PostsLikes,
    PostsScraps,
    sequelize, } = require("../models");
const { Op } = require("sequelize");
class PostRepository {
    constructor() { }

    checkPost = async ({ post_id }) => {
        const targetPost = await Posts.findOne({ where: { post_id } });
        return targetPost
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

    updateLike = async({ like_num, post_id }) => {
        await Posts.update(
            {
                like_num: like_num.length,
            },
            {
                where: { post_id: post_id },
            }
        );
    }

    updateScrap = async({ scrap_num, post_id }) => {
        await Posts.update(
            {
                scrap_num: scrap_num.length,
            },
            {
                where: { post_id: post_id },
            }
        );
    }

}
module.exports = PostRepository;