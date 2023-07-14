const MainService = require("../services/mainService")
class MainController {
    constructor() {
        this.MainService = new MainService();
    }
    //게시글 전체조회
    getAllPost = async (req, res) => {
        try {
            // 게시글 목록 조회
            const posts = await this.MainService.getAllPost();
            console.log(posts)
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
    }
    //top5 게시글조회
    getTopPost = async (req, res) => {
        try {
            // 게시글 목록 조회
            const d = new Date();

            const year = d.getFullYear();
            const month = d.getMonth();
            const day = d.getDate();
            console.log(year, month, day)
            const topfive = await this.MainService.getTopPost({ year, month, day, d });

            // 작성된 게시글이 없을 경우
            if (topfive.length === 0) {
                return res
                    .status(400)
                    .json({ message: "작성된 게시글이 없습니다." });
            }
            // 게시글 목록 조회
            return res.status(200).json({ topfive });
        } catch (e) {
            // 예외 처리
            console.log(e);
            return res.status(400).json({ message: "목록 조회에 실패했습니다." });
        }
    }
    //인기글 목록조회
    popularPost = async (req, res) => {
        try {
            const { page } = req.params;
            const { refresh, access } = req.headers;
            const d = new Date();

            const year = d.getFullYear();
            const month = d.getMonth();
            const day = d.getDate();

            // 게시글 목록 조회
            const pages = await this.MainService.getTopPost({ year, month, day, d })
            const pageNum = pages.length
            //인기글 조회
            const topfive = await this.MainService.getPopularPost({ year, month, day, d, page, pageNum, access })

            return res.status(200).json(topfive);
        } catch (e) {
            // 예외 처리
            console.log(e);
            return res.status(400).json({ message: "목록 조회에 실패했습니다." });
        }
    }
    //검색
    serchPost = async (req, res, next) => {
        const keyword = req.params.keyword;
        const { page } = req.params;
        const { refresh, access } = req.headers;
        try {
            const post_search = await this.MainService.serchPost({ keyword, page, access })
            return res.status(200).json(post_search);
        } catch (e) {
            // 예외 처리
            console.log(e);
            return res.status(400).json({ message: "검색에 실패했습니다." });
        }
    }
    //추천게시물 조회
    recommendPost = async (req, res) => {
        try {
            const { user_id } = res.locals.id;
            const { user_type } = res.locals.type;
            //추천게시글 찾기
            const result = await this.MainService.recommentPost({ user_id,user_type })

            return res.status(200).json({ result });
        } catch (e) {
            // 예외 처리
            console.log(e);
            return res.status(400).json({ message: "목록 조회에 실패했습니다." });
        }
    }

}
module.exports = MainController;