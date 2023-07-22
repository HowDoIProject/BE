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

    findByUserId = async({user_id,item}) => {
        return await PostsScraps.findOne({
            attributes: ["post_id", "user_id"],
            where: { user_id: user_id, post_id: item.post_id },
            raw: true,
        })
    }

    deleteScrap = async({user_id, post_id}) => {
        console.log(user_id)
        await PostsScraps.destroy({
            where: {
                user_id: user_id,
                post_id,
            },
        })
    }

    deleteAllScrap = async(item) => {
        await PostsScraps.destroy({
            where: {
                user_id: item["PostsScraps.user_id"],
                post_id: item["PostsScraps.post_id"],
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