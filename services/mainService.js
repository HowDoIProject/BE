const PostRepository = require("../repositories/postRepository")
const PostLikeRepository = require("../repositories/postLikeRepository")
const PostScrapRepository = require("../repositories/postScrapRepository")
const jwt = require("jsonwebtoken");

class MainService {
    constructor() {
        this.PostRepository = new PostRepository();
        this.PostLikeRepository = new PostLikeRepository();
        this.PostScrapRepository = new PostScrapRepository();
    }
    getAllPost = async () => {
        return await this.PostRepository.getAllPost();
    }
    getTopPost = async ({ year, month, day, d }) => {
        return await this.PostRepository.getTopPost({ year, month, day, d })
    }
    getPopularPost = async ({ year, month, day, d, page, pageNum, access }) => {
        const topfive = await this.PostRepository.getLimitPost({ year, month, day, d, page })
        // 작성된 게시글이 없을 경우
        if (topfive.length === 0) {
            throw new Error("작성된 게시글이 없습니다.")
        }

        // 게시글 목록 조회
        const result = [];
        const promises = topfive.map(async (item) => {
            let like_check = false;
            let scrap_check = false;
            if (access) {
                const ACCESS_KEY = "howdoi_";

                const [accessType, accessToken] = access.split(" ");
                const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                const { user_id } = decodedAccess.user_id

                const like_search = await this.PostLikeRepository.findByuserId({ user_id, item })
                if (like_search) {
                    like_check = true;
                } else {
                    like_check = false;
                }
                const scrap_search = await this.PostScrapRepository.findByUserId({ user_id, item })
                if (scrap_search) {
                    scrap_check = true;
                } else {
                    scrap_check = false;
                }
            }
            const scroll_result = {
                post_id: item.post_id,
                user_id: item.user_id,
                nickname: item.nickname,
                user_type: item.user_type,
                title: item.title,
                content: item.content,
                image: item.image,
                category: item.category,
                like_num: item.like_num,
                like_check: like_check,
                scrap_num: item.scrap_num,
                scrap_check: scrap_check,
                comment_num: item.comment_num,
                created_at: item.created_at,
                updated_at: item.updated_at,
            };
            result.push(scroll_result);
        });
        await Promise.all(promises);
        let result_sort = result.sort((a, b) => {
            if (a.like_num < b.like_num) return 1;
            if (a.like_num > b.like_num) return -1;
            return 0;
        })
        const total_page = Math.ceil(pageNum / 10);
        const last_page = total_page == page ? true : false;

        const Result_Json = JSON.stringify(result_sort);
        const temp = JSON.parse(`${Result_Json}`);
        return {
            result: temp,
            page: Number(page),
            last_page: last_page,
            total_page: total_page,
        };

    }

    serchPost = async ({ keyword, page, access }) => {
        const post_search = await this.PostRepository.getPostByKeyword({ keyword, page })
        const result = [];
        const promises = post_search.map(async (item) => {
            let like_check = false;
            let scrap_check = false;
            if (access) {
                const ACCESS_KEY = "howdoi_";

                const [accessType, accessToken] = access.split(" ");
                const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                const { user_id } = decodedAccess.user_id

                const like_search = await this.PostLikeRepository.findByuserId({user_id,item})
                if (like_search) {
                    like_check = true;
                } else {
                    like_check = false;
                }
                const scrap_search = await this.PostScrapRepository.findByUserId({user_id,item})
                if (scrap_search) {
                    scrap_check = true;
                } else {
                    scrap_check = false;
                }
            }
            const scroll_result = {
                post_id: item.post_id,
                user_id: item.user_id,
                nickname: item.nickname,
                user_type: item.user_type,
                title: item.title,
                content: item.content,
                image: item.image,
                category: item.category,
                like_num: item.like_num,
                like_check: like_check,
                scrap_num: item.scrap_num,
                scrap_check: scrap_check,
                comment_num: item.comment_num,
                created_at: item.created_at,
                updated_at: item.updated_at,
            };
            result.push(scroll_result);
        });
        await Promise.all(promises);

        const total_page = 5;
        const last_page = total_page == page ? true : false;

        const Result_Json = JSON.stringify(result);
        const temp = JSON.parse(`${Result_Json}`);
        return {
            result: temp,
            page: Number(page),
            last_page: last_page,
            total_page: total_page,
        };
    }

}

module.exports = MainService;