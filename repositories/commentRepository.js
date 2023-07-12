const { Users, Comments, PostsLikes, sequelize } = require("../models");
const { Op } = require("sequelize");
class CommentRepository {
    constructor() { }

    postComment = async ({
        post_id,
        user_id,
        comment,
        image,
    }) => {
        Comments.create({
            post_id,
            user_id,
            comment,
            image,
        })
    }

    checkComment = async ({ comment_id }) => {
        const targetComment = await Comments.findOne({ where: { comment_id } });
        return targetComment;
    }

    deleteComment = async ({ post_id, comment_id }) => {
        await Comments.destroy({
            where: { post_id, comment_id },
        })
    }

    updateComment = async ({
        comment,
        image,
        comment_id
    }) => {
        await Comments.update(
            {
                comment: comment,
                image: image,
            },
            {
                where: { comment_id: comment_id },
            }
        )
    }

    findAllCommentById = async({
        post_id, 
    }) => {
        return await Comments.findAll({
            attributes: [
                "comment_id",
                "post_id",
                "user_id",
                [sequelize.col("nickname"), "nickname"],
                "comment",
                "image",
                "chosen",
                "created_at",
                "updated_at",
            ],
            where: { post_id, chosen: 1 },
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

    chooseComment = async({
        post_id, 
        comment_id
    }) => {
        await Comments.update(
            {
                chosen: 1,
            },
            {
                where: { post_id, comment_id },
            }
        )
    }

    updateLike = async({ like_num, comment_id }) => {
        await Comments.update(
            {
                like_num: like_num.length,
            },
            {
                where: { comment_id: comment_id },
            }
        );
    }
}
module.exports = CommentRepository;