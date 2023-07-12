const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const shortId = require("shortid");
const AWS = require("aws-sdk");
const auth = require("../middlewares/auth");
const PostController = require("../controllers/postController")
const postcontroller = new PostController();

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

    limits: { fileSize: 8 * 1024 * 1024 }
}).single("image");

//사진 업로드
router.post("/uploads", upload, async (req, res, next) => {
    res.json({ url: req.file.location });
});

//게시글 작성
router.post("/post", auth, postcontroller.createpost);

//게시글 수정
router.put("/mypage/:id", auth, postcontroller.updatepost);

//게시글 삭제
router.delete("/mypage/:id", auth, postcontroller.deletepost);

//게시글 상세 조회
router.get("/post/:id", postcontroller.detailpost);

//게시글 도움됐어요
router.post("/like/:id", auth, postcontroller.likepost);

//게시글 스크랩
router.post("/scrap/:id", auth, postcontroller.scrappost);

module.exports = router;
