const { Users, Comments, sequelize, Posts } = require("../models");
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
    findAllComment = async() => {
        return await Comments.findAll({
            where: { user_id }
        });
    }
    sumAllComment = async({user_id}) => {
        return await Comments.sum('like_num', { where: { user_id } })
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
    findAllCommentByUserId = async({user_id}) => {
        return await Comments.findAll({
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
    }
    getChosenComment = async({user_id}) => {
        return await Comments.findAll({
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
    }
    getMyChosenComment = async({user_id}) => {
        return await Comments.findAll({
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

    detailComment = async({ post_id }) => {
        return await Comments.findAll({
            attributes: [
                "comment_id",
                "user_id",
                [sequelize.col("nickname"), "nickname"],
                [sequelize.col("user_type"), "user_type"],
                "comment",
                "image",
                "chosen",
                "like_num",
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
            raw: true,
        });
    }

    findChosenComment = async({ post_id }) => {
        return await Comments.findAll({
            where: { post_id, chosen: 1 },
            raw: true,
        });
    }

    countComment = async({ post_id }) => {
        return await Comments.count({ where: { post_id } })
    }
}
module.exports = CommentRepository;