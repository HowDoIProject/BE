const ScrapsService = require("../services/scrapsService")
class ScrapsController {
    constructor() {
        this.ScrapsService = new ScrapsService();
    }
    getScrap = async (req, res) => {
        try {
            const user_id = res.locals.id;
            const { page } = req.params;
            let { filter, category } = req.params;
            const { refresh, access } = req.headers;
    
            if (filter === "0" && category === "0") {
                const result = await this.ScrapsService.getListAll({user_id, access, page})
                return res.status(200).json(result);

            } else if (filter === "0" && category !== "0") {
                
                const result = await this.ScrapsService.getListByCategory({category, user_id, access, page})
                return res.status(200).json(result);

            } else if (filter !== "0" && category === "0") {
                
                const result = await this.ScrapsService.getListByFilter({filter, user_id, access, page})
                return res.status(200).json(result);

            } else {
                
                const result = await this.ScrapsService.getList({category, filter, user_id, access, page})
                return res.status(200).json(result);
            }
        } catch (e) {
            // 예외 처리
            return res
                .status(400)
                .json({ message: "목록 조회에 실패했습니다." + e });
        }
    }

    deleteScrap = async (req, res) => {
        try {
            const user_id = res.locals.id;
            const { page } = req.params;
            let { filter, category } = req.params;
    
            if (filter === "0" && category === "0") {

                await this.ScrapsService.deleteScrapList({user_id})
                return res
                .status(200)
                .json({ message: "게시글을 삭제하였습니다."});

            } else if (filter === "0" && category !== "0") {
                await this.ScrapsService.deleteScrapListByCategory({category, user_id})
                return res
                .status(200)
                .json({ message: "게시글을 삭제하였습니다."});
    
            } else if (filter !== "0" && category === "0") {
                await this.ScrapsService.deleteScrapByFilter({filter, user_id})
                return res
                .status(200)
                .json({ message: "게시글을 삭제하였습니다."});
            } else {
                await this.ScrapsService.deleteScrapByCategoryFilter({category,filter, user_id})
                return res
                .status(200)
                .json({ message: "게시글을 삭제하였습니다."});
            }

        } catch (e) {
            // 예외 처리
            return res
                .status(400)
                .json({ message: "목록 조회에 실패했습니다." + e });
        }
    }
}

module.exports = ScrapsController;