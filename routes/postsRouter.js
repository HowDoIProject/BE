const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const shortId = require("shortid");
const AWS = require("aws-sdk");
const auth = require("../middlewares/auth");
const { Posts, Users, Comments,  sequelize } = require("../models");
const { Op } = require("sequelize");

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

//사진 업로드
router.post("/uploads", upload, async (req, res, next) => {
    res.json({ url: req.file.location });
});

//게시글 작성
router.post("/post", auth, async (req, res) => {
    const { nickname } = res.locals.user;
    const { user_id } = res.locals.id;
    const { title, content, category, image } = req.body;
    // const image = req.file;
    // console.log(image)
    // const imageFileName = image.file.location;

    // const category_one = parseInt(category / 100);
    // const category_two = parseInt((category - category_one*100) / 10)
    // const category_three = parseInt((category - category_one*100 - category_two *10))
    // let category_str = [];
    // if( category_one !== 0) {
    //     const category_str_1 = await Categories.findOne({
    //         attributes: [
    //             "category_name"
    //         ],
    //         where: { category : category_one},
    //         raw: true
    //     })
    //     category_str.push(category_str_1.category_name);
    // }
    // if( category_two !== 0) {
    //     const category_str_2 = await Categories.findOne({
    //         attributes: [
    //             "category_name"
    //         ],
    //         where: { category : category_two},
    //         raw: true
    //     })
    //     category_str.push(category_str_2.category_name);

    // }
    // if( category_three !== 0) {
    //     const category_str_3 = await Categories.findOne({
    //         attributes: [
    //             "category_name"
    //         ],
    //         where: { category : category_three},
    //         raw: true
    //     })
    //     category_str.push(category_str_3.category_name);
    // }
    // console.log(category_str)

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

//게시글 상세 조회
router.get("/post/:post_id", async (req, res) => {
    try {
        // params로 postId 받기
        const { post_id } = req.params;
        // 게시글 상세 조회
        const post = await Posts.findOne({
            attributes: [
                "post_id",
                "user_id",
                [sequelize.col("nickname"), "nickname"],
                "title",
                "content",
                "category",
                "image",
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
            group: ["Posts.post_id"],
            raw: true,
        });

        // 게시글에 해당하는 댓글
        const comments = await Comments.findAll({
            attributes: [
                "comment_id",
                "user_id",
                [sequelize.col("nickname"), "nickname"],
                "comment",
                "image",
                "created_at",
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

        // 게시글이 없을 경우
        if (!post) {
            return res
                .status(400)
                .json({ message: "존재하지 않는 게시글입니다." });
        }
        // 게시글 상세 조회
        // (comments X)
        if (!comments) {
            return res.status(200).json({ post });
        }
        // (comments O)
        else {
            return res.status(200).json({ post, comments });
        }
    } catch {
        return res.status(400).json({ message: "게시글 조회에 실패했습니다." });
    }
});
module.exports = router;
