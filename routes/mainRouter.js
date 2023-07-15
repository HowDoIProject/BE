const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const MainController = require("../controllers/mainController")
const mainController = new MainController();

//게시글 전체 조회
router.get("/post", mainController.getAllPost);

//top5 게시글 조회
router.get("/topfive", mainController.getTopPost);

//인기글 목록 조회
router.get("/topfive/:page", mainController.popularPost);

//검색기능
router.post("/search/:keyword/:page", mainController.serchPost);

//추천 게시글 조회
router.get("/recommend", auth, mainController.recommendPost);

module.exports = router;
