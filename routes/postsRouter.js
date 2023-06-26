const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const shortId = require("shortid");
const AWS = require("aws-sdk");
const auth = require("../middlewares/auth");
const { Posts, Users, Categories, sequelize } = require("../models");

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
}).single("image");

router.post("/uploads", auth, upload, async (req, res, next) => {
    res.json({ url: req.file.location });
});

router.post("/post", auth, async (req, res) => {
    const { nickname } = res.locals.user;
    const { user_id } = res.locals.id;
    const { title, content, category, image } = req.body;
    // const image = req.file;
    // console.log(image)
    // const imageFileName = image.file.location;

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
});

router.get("/post", async (req, res) => {
    try {
        // 게시글 목록 조회
        const posts = await Posts.findAll({
            attributes: [
                "post_id",
                "user_id",
                [sequelize.col("nickname"), "nickname"],
                "title",
                "content",
                "image",
                "category",
                "scrap_num",
                "like_num",
                "created_at",
                "updated_at",
            ],
            include: [
                {
                    model: Users,
                    attributes: [],
                },
            ],
            group: ["Posts.post_id"],
            order: [["created_at", "DESC"]],
            raw: true,
        });

        // 작성된 게시글이 없을 경우
        if (posts.length === 0) {
            return res
                .status(400)
                .json({ message: "작성된 게시글이 없습니다." });
        }
        // 게시글 목록 조회
        return res.status(200).json({ posts });
    } catch (e) {
        // 예외 처리
        console.log(e);
        return res.status(400).json({ message: "목록 조회에 실패했습니다." });
    }
});

module.exports = router;
