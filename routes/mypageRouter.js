const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { Posts, Users, Comments, PostsLikes, PostsScraps, sequelize } = require("../models");
const { Op } = require("sequelize");


const MypageController = require("../controllers/mypageController")
const mypageController = new MypageController();

router.get("/mypage", auth, mypageController.getAllMypage);

router.get("/mypage/:page", auth, mypageController.getMypage);

router.get("/mystat", auth, mypageController.getMystat)

//내가 작성한 댓글
router.get("/mycomment", auth, mypageController.getMyComment);

//내가 채택한 댓글
router.get("/chosencomment", auth, mypageController.getChosenComment);

//나의 채택된 댓글
router.get("/mychosencomment", auth, mypageController.getMyChosenComment);

module.exports = router;
