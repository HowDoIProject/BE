const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const shortId = require("shortid");
const AWS = require("aws-sdk");
const auth = require("../middlewares/auth");
const { Posts, Users, Comments, sequelize } = require("../models");
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

//댓글 작성
router.post("/post/:id/comment", auth, async (req, res) => {
    try {
        const { user_id } = res.locals.id;
        const { comment, image } = req.body;
        const { id } = req.params;
        const post_id = Number(id);

        if (!comment) {
            return res.status(400).json({ message: "다시 한 번 확인해주세요" });
        } else {
            await Comments.create({
                post_id,
                user_id,
                comment,
                image,
            }).then((data) => {
                return res.status(200).json({
                    message: "댓글 작성이 완료되었습니다.",
                });
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "댓글 작성에 실패했습니다." });
    }
});

//댓글 삭제
router.delete("/post/:p_id/comment/:c_id", auth, async (req, res) => {
    try {
        const { user_id } = res.locals.id;
        const { p_id, c_id } = req.params;
        const post_id = Number(p_id);
        const comment_id = Number(c_id);

        const targetPost = await Posts.findOne({ where: { post_id } });
        if (!targetPost) {
            return res
                .status(400)
                .json({ message: "유효하지 않은 게시글입니다." });
        }

        const targetComment = await Comments.findOne({ where: { comment_id } });
        if (!targetComment) {
            return res
                .status(400)
                .json({ message: "유효하지 않은 댓글입니다." });
        }

        if (targetComment.user_id !== user_id) {
            return res.status(400).json({ errorMessage: "권한이 없습니다." });
        }

        await Comments.destroy({
            where: { post_id },
        }).then((data) => {
            return res.status(200).json({
                message: "댓글 삭제가 완료되었습니다.",
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "댓글 삭제에 실패했습니다." });
    }
});

router.put("/post/:p_id/comment/:c_id", auth, async (req, res) => {
    try {
        const { user_id } = res.locals.id;
        const { comment, image } = req.body;
        const { p_id, c_id } = req.params;
        const post_id = Number(p_id);
        const comment_id = Number(c_id);


        const targetPost = await Posts.findOne({ where: { post_id } });
        if (!targetPost) {
            return res
                .status(400)
                .json({ message: "유효하지 않은 게시글입니다." });
        }

        const targetComment = await Comments.findOne({ where: { comment_id } });
        if (!targetComment) {
            return res
                .status(400)
                .json({ message: "유효하지 않은 댓글입니다." });
        }

        if (targetComment.user_id !== user_id) {
            return res.status(400).json({ message: "권한이 없습니다." });
        }

        if (!comment) {
            return res.status(400).json({ message: "다시 한 번 확인해주세요" });
        } else {
            await Comments.update(
                {
                    comment: comment,
                    image: image,
                },
                {
                    where: { comment_id: comment_id },
                }
            ).then((data) => {
                return res.status(200).json({
                    message: "댓글 수정이 완료되었습니다.",
                });
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "댓글 수정에 실패했습니다." });
    }
});
module.exports = router;
