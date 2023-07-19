const MypageService = require("../services/mypageService")
class MypageController {
    constructor() {
        this.MypageService = new MypageService();
    }

    getAllMypage = async (req, res) => {
        try {
            const user_id = res.locals.id;
            // 게시글 목록 조회
            const mypage = await this.MypageService.getAllMypage({user_id})
    
            // 작성된 게시글이 없을 경우
            if (mypage.length === 0) {
                return res
                    .status(400)
                    .json({ message: "작성된 게시글이 없습니다." });
            }
            return res.status(200).json({ mypage });
        } catch (e) {
            // 예외 처리
            return res
                .status(400)
                .json({ message: "목록 조회에 실패했습니다." + e });
        }
    }

    getMypage = async (req, res, next) => {
        const { page } = req.params;
        const user_id = res.locals.id;
        const { refresh, access } = req.headers;
    
        const mypage = await this.MypageService.getMypage({user_id, page, access})
        return res.status(200).json(mypage);
    
    }

    getMystat = async (req, res) => {
        try{
            const { user_id } = res.locals.id
            
            const result = await this.MypageService.getMyStat({user_id})
            return res.status(200).json(result);
        }catch(error){
            // 예외 처리
            return res
                .status(400)
                .json({ message: "조회에 실패했습니다." + e });
        }
    }

    getMyComment = async (req, res) => {
        try {
            const user_id = res.locals.id;
            // 게시글 목록 조회
            const mycomment = await this.MypageService.getMyComment({user_id})
    
            // 작성된 게시글이 없을 경우
            if (mycomment.length === 0) {
                return res.status(400).json({ message: "작성된 댓글이 없습니다." });
            }
            // 게시글 목록 조회
            return res.status(200).json({ mycomment });
        } catch (e) {
            // 예외 처리
            console.log(e)
            return res
                .status(400)
                .json({ message: "목록 조회에 실패했습니다." + e });
        }
    }

    getChosenComment = async (req, res) => {
        try {
            const user_id = res.locals.id;
            // 게시글 목록 조회
            const chosencomment = await this.MypageService.getChosenComment({user_id})

            // 작성된 게시글이 없을 경우
            if (chosencomment.length === 0) {
                return res.status(400).json({ message: "작성된 댓글이 없습니다." });
            }
            // 게시글 목록 조회
            return res.status(200).json({ chosencomment });
        } catch (e) {
            // 예외 처리
            return res
                .status(400)
                .json({ message: "목록 조회에 실패했습니다." + e });
        }
    }

    getMyChosenComment = async (req, res) => {
        try {
            const user_id = res.locals.id;
            // 게시글 목록 조회
            const mychosencomment = await this.MypageService.getMyChosenComment({user_id})
            // 작성된 댓글이 없을 경우
            if (mychosencomment.length === 0) {
                return res.status(400).json({ message: "작성된 댓글이 없습니다." });
            }
            // 댓글 목록 조회
            return res.status(200).json({ mychosencomment });
        } catch (e) {
            // 예외 처리
            return res
                .status(400)
                .json({ message: "목록 조회에 실패했습니다." + e });
        }
    }
}

module.exports = MypageController;
