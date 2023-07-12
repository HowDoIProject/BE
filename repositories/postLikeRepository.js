const { PostsLikes} = require("../models");
class PostLikeRepository {
    constructor() {}

    findAllLikeByuserId = async({
        comment_id, 
        user_id
    }) => {
        return await PostsLikes.findAll({
            attributes: ["comment_id", "user_id"],
            where: { comment_id, user_id: user_id.user_id },
            raw: true,
        });
    }
    findAllLikeById = async({ comment_id }) => {
        return await PostsLikes.findAll({
            attributes: ["comment_id", "user_id"],
            where: { comment_id },
            raw: true,
        });
    }
    deleteLike = async({
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

    createLike = async({
        comment_id,
        user_id
    }) => {
        await PostsLikes.create({
            user_id: user_id.user_id,
            comment_id,
        })
    }

    
 
}

module.exports = PostLikeRepository;