const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

const PostsController = require("../controllers/postsController");
const postsController = new PostsController();

// 이미지 업로드용 라우터
try {
    // 폴더 저장 경로가 존재하지 않는 경우 폴더 만들어주기
    fs.accessSync("uploads");
} catch (err) {
    console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다");
    fs.mkdirSync("uploads");
}

AWS.config.update({
    accesskeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: "ap-northeast-2",
});

const uploads = multer({
    dest: "uploads/",
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: "elasticbeanstalk-ap-northeast-2-235120449577",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read-write",
        key: (req, file, cb) => {
            cb(
                null,
                `original/${Date.now()}${path.basename(file.originalname)}`
            );
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
    "/uploads",
    uploads.single("image"),
    postsController.upload,
    (req, res) => {
        console.log(req.file);
        res.json({ url: req.file.location });
    }
);

router.post("/post", postsController.write);

module.exports = router;
