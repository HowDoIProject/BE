const multer = require("multer");
const multerS3 = require("multer-s3");
const shortId = require("shortid");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: "howdoi-project",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const fileId = shortId.generate();
            const type = file.mimetype.split("/")[1];
            const fileName = `${fileId}.${type}`;
            cb(null, fileName);
        },
        acl: "public-read-write",
    }),
});

const { Posts } = require("../models");

class PostsController {
    write = async (req, res) => {
        const { title, content, image, category } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "다시 한 번 확인해주세요" });
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
    };
}

module.exports = PostsController;
