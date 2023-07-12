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
    findAllLikeByuserIdpostId = async({
        post_id, 
        user_id
    }) => {
        return await PostsLikes.findAll({
            attributes: ["post_id", "user_id"],
            where: { post_id, user_id: user_id.user_id },
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

    findAllLikeByPostId = async({ post_id }) => {
        return await PostsLikes.findAll({
            attributes: ["post_id", "user_id"],
            where: { post_id },
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
    deleteLikebyPostId = async({
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

    createLike = async({
        comment_id,
        user_id
    }) => {
        await PostsLikes.create({
            user_id: user_id.user_id,
            comment_id,
        })
    }

    createLikebyPostId = async({
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