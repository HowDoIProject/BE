const ListService = require("../services/listService")
class ListController {
    constructor() {
        this.ListService = new ListService();
    }
    getList = async (req, res) => {
        try {
            const { page } = req.params;
            let { filter, category } = req.params;
            const { refresh, access } = req.headers;
    
            if (filter === "0" && category === "0") {

                const list = await this.ListService.getListNoCategory({page,access})
                console.log(list)
                return res.status(200).json(list);

            } else if (filter === "0" && category !== "0") {

                const list = await this.ListService.getListNoFilter({category,page,access})
                return res.status(200).json(list);

            } else if (filter !== "0" && category === "0") {

                const list = await this.ListService.getListByFilter({filter,page,access})
                return res.status(200).json(list);

            } else {
                
                const list = await this.ListService.getList({filter,category,page,access})
                return res.status(200).json(list);
            }

        } catch (e) {
            // 예외 처리
            return res
                .status(400)
                .json({ message: "목록 조회에 실패했습니다." + e });
        }
    }
}

module.exports = ListController;