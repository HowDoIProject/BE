const PostRepository = require("../repositories/postRepository")
const PostLikeRepository = require("../repositories/postLikeRepository")
const PostScrapRepository = require("../repositories/postScrapRepository")
const jwt = require("jsonwebtoken");

class ListService {
    constructor() {
        this.PostRepository = new PostRepository();
        this.PostLikeRepository = new PostLikeRepository();
        this.PostScrapRepository = new PostScrapRepository();
    }
    getListNoCategory = async ({ page, access }) => {
        // 게시글 목록 조회
        const list = await this.PostRepository.findAllPost({ page })
        const result = [];
        const promises = list.map(async (item) => {
            let like_check = false;
            let scrap_check = false;
            if (access) {
                const ACCESS_KEY = "howdoi_";

                const [accessType, accessToken] = access.split(" ");
                const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                const { user_id } = decodedAccess.user_id;

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
            if (a.created_at < b.created_at) return 1;
            if (a.created_at > b.created_at) return -1;
            return 0;
        })
        const total_count = await this.PostRepository.postCount()
        const total_page = Math.ceil(total_count / 10);
        const last_page = total_page == page ? true : false;
        const Result_Json = JSON.stringify(result_sort);

        const temp = JSON.parse(`${Result_Json}`);

        return {
            mypage: temp,
            page: Number(page),
            last_page: last_page,
            total_page: total_page,
        }
    }

    getListNoFilter = async ({ category, page, access }) => {
        if (category === "1") {
            category = "생활비";
        } else if (category === "2") {
            category = "자취끼니";
        } else if (category === "3") {
            category = "집안일";
        }
        const pages = await this.PostRepository.findByCategory({ category })

        const list = await this.PostRepository.findLimitPostByCategory({ category, page })

        const result = [];
        const promises = list.map(async (item) => {
            let like_check = false;
            let scrap_check = false;
            if (access) {
                const ACCESS_KEY = "howdoi_";

                const [accessType, accessToken] = access.split(" ");
                const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                const { user_id } = decodedAccess.user_id;

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
            if (a.created_at < b.created_at) return 1;
            if (a.created_at > b.created_at) return -1;
            return 0;
        })
        const total_page = Math.ceil(pages.length / 10);
        const last_page = total_page == page ? true : false;
        const Result_Json = JSON.stringify(result_sort);

        const temp = JSON.parse(`${Result_Json}`);
        return {
            mypage: temp,
            page: Number(page),
            last_page: last_page,
            total_page: total_page,
        }
    }

    getListByFilter = async ({filter,page,access}) => {
        if (filter === "1") {
            filter = '강아지';
        } else if (filter === "2") {
            filter = '엄빠';
        }

        const pages = await this.PostRepository.findAllByfilter({filter})

        const list = await this.PostRepository.findByfilter({filter, page})

        const result = [];
        const promises = list.map(async (item) => {
            let like_check = false;
            let scrap_check = false;
            if (access) {
                const ACCESS_KEY = "howdoi_";

                const [accessType, accessToken] = access.split(" ");
                const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                const { user_id } = decodedAccess.user_id;

                const like_search = await this.PostLikeRepository.findByuserId({ user_id, item })
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
        let result_sort = result.sort((a, b) => {
            if (a.created_at < b.created_at) return 1;
            if (a.created_at > b.created_at) return -1;
            return 0;
        })
        const total_page = Math.ceil(pages.length / 10);
        const last_page = total_page == page ? true : false;
        const Result_Json = JSON.stringify(result_sort);

        const temp = JSON.parse(`${Result_Json}`);

        return {
            mypage: temp,
            page: Number(page),
            last_page: last_page,
            total_page: total_page,
        }
    }

    getList = async({filter,category,page,access}) => {
        if (filter === "1") {
            filter = '강아지';
        } else if (filter === "2") {
            filter = '엄빠';
        }

        if (category === "1") {
            category = "생활비";
        } else if (category === "2") {
            category = "자취끼니";
        } else if (category === "3") {
            category = "집안일";
        }

        const pages = await this.PostRepository.findAllByCategoryFilter({ category, filter })

        const list = await this.PostRepository.findLimitByCategoryFilter({category, filter,page})

        const result = [];
        const promises = list.map(async (item) => {
            let like_check = false;
            let scrap_check = false;
            if (access) {
                const ACCESS_KEY = "howdoi_";

                const [accessType, accessToken] = access.split(" ");
                const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                const { user_id } = decodedAccess.user_id;

                const like_search = await this.PostLikeRepository.findByuserId({ user_id, item })
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
        let result_sort = result.sort((a,b) => {
            if(a.created_at < b.created_at) return 1;
            if(a.created_at > b.created_at) return -1;
            return 0;
        })
        const total_page = Math.ceil(pages.length / 10);
        const last_page = total_page == page ? true : false;
        const Result_Json = JSON.stringify(result_sort);

        const temp = JSON.parse(`${Result_Json}`);

        return {
            mypage: temp,
            page: Number(page),
            last_page: last_page,
            total_page: total_page,
        }
    }
}

module.exports = ListService;