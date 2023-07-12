const { Posts,sequelize } = require("../models");
class PostRepository {
    constructor() {}
    
    checkPost = async({post_id}) => {
        const targetPost = await Posts.findOne({ where: { post_id } });
        return targetPost
    }
    
}
module.exports = PostRepository;