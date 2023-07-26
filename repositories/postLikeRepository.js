const { PostsLikes } = require("../models");
const { Op } = require("sequelize");
class PostLikeRepository {
    constructor() { }

    findAllLikeByuserId = async ({
        comment_id,
        user_id
    }) => {
        return await PostsLikes.findAll({
            attributes: ["comment_id", "user_id"],
            where: { comment_id, user_id: user_id.user_id },
            raw: true,
        });
    }
    findAllLikeByuserIdpostId = async ({
        post_id,
        user_id
    }) => {
        return await PostsLikes.findAll({
            attributes: ["post_id", "user_id"],
            where: { post_id, user_id: user_id.user_id },
            raw: true,
        });
    }

    findAllLikeById = async ({ comment_id }) => {
        return await PostsLikes.findAll({
            attributes: ["comment_id", "user_id"],
            where: { comment_id },
            raw: true,
        });
    }

    findAllLikeByPostId = async ({ post_id }) => {
        return await PostsLikes.findAll({
            attributes: ["post_id", "user_id"],
            where: { post_id },
            raw: true,
        });
    }
    findByuserId = async ({ user_id, item }) => {
        return await PostsLikes.findOne({
            attributes: ["post_id", "user_id"],
            where: { user_id: user_id, post_id: item.post_id },
            raw: true,
        })
    }
    findBycommentId = async ({user_id,item}) => {
        return await PostsLikes.findOne({
            attributes: ["comment_id", "user_id"],
            where: { user_id: user_id, comment_id: item.comment_id },
            raw: true,
        })
    }
    findAllByDate = async({d,year,month,day,item}) => {
        return await PostsLikes.findAll({
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
    }
    deleteLike = async ({
        comment_id,
        user_id
    }) => {
        await PostsLikes.destroy({
            where: {
                user_id: user_id.user_id,
                comment_id,
            },
        })
    }
    deleteLikebyPostId = async ({
        post_id,
        user_id
    }) => {
        await PostsLikes.destroy({
            where: {
                user_id: user_id.user_id,
                post_id,
            },
        })
    }

    createLike = async ({
        comment_id,
        user_id
    }) => {
        await PostsLikes.create({
            user_id: user_id.user_id,
            comment_id,
        })
    }

    createLikebyPostId = async ({
        post_id,
        user_id
    }) => {
        await PostsLikes.create({
            user_id: user_id.user_id,
            post_id,
        })
    }



}

module.exports = PostLikeRepository;