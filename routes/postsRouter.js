const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const shortId = require("shortid");
const AWS = require("aws-sdk");
const auth = require("../middlewares/auth");
const {
    Posts,
    Users,
    Comments,
    PostsLikes,
    PostsScraps,
    sequelize,
} = require("../models");
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

//게시글 수정
router.put("/post/:id", auth, async (req, res) => {
    try {
        const { nickname } = res.locals.user;
        const { user_id } = res.locals.id;
        const { title, content, category, image } = req.body;
        const { id } = req.params;
        const post_id = Number(id);

        const targetPost = await Posts.findOne({ where: { post_id } });
        if (!targetPost) {
            return res
                .status(400)
                .json({ message: "유효하지 않은 게시글입니다." });
        }

        if (targetPost.user_id !== user_id) {
            return res.status(400).json({ message: "권한이 없습니다." });
        }

        await Posts.update(
            {
                title,
                content,
                category,
                image: image,
            },
            {
                where: { post_id },
            }
        ).then((data) => {
            return res.status(200).json({
                message: "게시글 수정이 완료되었습니다.",
            });
        });
    } catch (error) {
        return res.status(400).json({ message: "게시글 수정에 실패했습니다." });
    }
});

//게시글 삭제
router.delete("/post/:id", auth, async (req, res) => {
    try {
        const { nickname } = res.locals.user;
        const { user_id } = res.locals.id;
        const { title, content, category, image } = req.body;
        const { id } = req.params;
        const post_id = Number(id);

        const targetPost = await Posts.findOne({ where: { post_id } });
        if (!targetPost) {
            return res
                .status(400)
                .json({ message: "유효하지 않은 게시글입니다." });
        }

        if (targetPost.user_id !== user_id) {
            return res.status(400).json({ message: "권한이 없습니다." });
        }

        await Posts.destroy({
            where: { post_id },
        }).then((data) => {
            return res.status(200).json({
                message: "게시글 삭제가 완료되었습니다.",
            });
        });
    } catch (error) {
        return res.status(400).json({ message: "게시글 삭제에 실패했습니다." });
    }
});

//게시글 상세 조회
router.get("/post/:id", async (req, res) => {
    try {
        // params로 postId 받기
        const { id } = req.params;
        const post_id = Number(id);
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
                "scrap_num",
                "like_num",
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

//게시글 도움됐어요
router.post("/like/:id", auth, async (req, res) => {
    try {
        const user_id = res.locals.id;
        const { id } = req.params;
        const post_id = Number(id);
        likes = await PostsLikes.findAll({
            attributes: ["post_id", "user_id"],
            where: { post_id, user_id: user_id.user_id },
            raw: true,
        });

        if (likes.length !== 0) {
            await PostsLikes.destroy({
                where: {
                    user_id: user_id.user_id,
                    post_id,
                },
            }).then((data) => {
                return res.status(200).json({
                    message: "좋아요가 취소되었습니다.",
                });
            });
        } else {
            await PostsLikes.create({
                user_id: user_id.user_id,
                post_id,
            }).then((data) => {
                return res.status(200).json({
                    message: "좋아요가 완료되었습니다.",
                });
            });
        }

        like_num = await PostsLikes.findAll({
            attributes: ["post_id", "user_id"],
            where: { post_id },
            raw: true,
        });

        await Posts.update(
            {
                like_num: like_num.length,
            },
            {
                where: { post_id: post_id },
            }
        );
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ message: "좋아요에 실패했습니다." + error });
    }
});

//게시글 스크랩
router.post("/scrap/:id", auth, async (req, res) => {
    try {
        const user_id = res.locals.id;
        const { id } = req.params;
        const post_id = Number(id);
        scraps = await PostsScraps.findAll({
            attributes: ["post_id", "user_id"],
            where: { user_id: user_id.user_id },
            raw: true,
        });

        if (scraps.length !== 0) {
            await PostsScraps.destroy({
                where: {
                    user_id: user_id.user_id,
                    post_id,
                },
            }).then((data) => {
                return res.status(200).json({
                    message: "스크랩이 취소되었습니다.",
                });
            });
        } else {
            await PostsScraps.create({
                user_id: user_id.user_id,
                post_id,
            }).then((data) => {
                return res.status(200).json({
                    message: "스크랩이 완료되었습니다.",
                });
            });
        }
        scrap_num = await PostsScraps.findAll({
            attributes: ["post_id", "user_id"],
            where: { post_id },
            raw: true,
        });

        await Posts.update(
            {
                scrap_num: scrap_num.length,
            },
            {
                where: { post_id: post_id },
            }
        );
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ message: "스크랩에 실패했습니다." + error });
    }
});
module.exports = router;
