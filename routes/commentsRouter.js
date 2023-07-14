const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const shortId = require("shortid");
const AWS = require("aws-sdk");
const auth = require("../middlewares/auth");

const CommentController = require("../controllers/commentsController.js");
const commentcontroller = new CommentController();

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
router.post("/post/:id/comment", auth, commentcontroller.postComment);

//댓글 삭제
router.delete("/post/:p_id/comment/:c_id", auth, commentcontroller.deleteComment);

//댓글 수정
router.put("/post/:p_id/comment/:c_id", auth, commentcontroller.updateComment);

//댓글 채택
router.post("/post/:p_id/comment/:c_id", auth, commentcontroller.chooseComment);

//댓글 도움됐어요
router.post("/commentlike/:id", auth, commentcontroller.likeComment);

module.exports = router;
