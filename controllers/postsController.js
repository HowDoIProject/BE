const { Posts } = require("../models");
const { isAuthorized } = require("../middlewares/auth");

class PostsController {

    write = async (req, res) => {
        const verify = isAuthorized(req);
        if (verify) {
            const { title, content, image, category } = req.body;
            if (!title || !content) {
                return res
                    .status(400)
                    .json({ message: "다시 한 번 확인해주세요" });
            } else {
                await Posts.create({
                    user_id,
                    nickname,
                    title,
                    content,
                    image,
                    category,
                }).then((data) => {
                    return res.status(200).json({
                        message: "게시글이 올라갔습니다",
                    });
                });
            }
        } else {
            return res
                .status(500)
                .json({ message: "게시글 올리기에 실패하였습니다" });
        }
    };
}

module.exports = PostsController;
