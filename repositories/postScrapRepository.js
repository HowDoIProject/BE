const { PostsScraps } = require("../models");
class PostScrapRepository {
    constructor() {}

    findAllLikeByuserId = async({post_id, user_id}) => {
        return await PostsScraps.findAll({
            attributes: ["post_id", "user_id"],
            where: { post_id, user_id: user_id.user_id },
            raw: true,
        });
    }

    deleteScrap = async({user_id,post_id}) => {
        await PostsScraps.destroy({
            where: {
                user_id: user_id.user_id,
                post_id,
            },
        })
    }

    createScrap = async({user_id,post_id}) => {
        await PostsScraps.create({
            user_id: user_id.user_id,
            post_id,
        })
    }

    findAllbyPostId = async({ post_id }) => {
        return await PostsScraps.findAll({
            attributes: ["post_id", "user_id"],
            where: { post_id },
            raw: true,
        });
    }
}

module.exports = PostScrapRepository;