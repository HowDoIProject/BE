const PostRepository = require("../repositories/postRepository")
const PostLikeRepository = require("../repositories/postLikeRepository")
const PostScrapRepository = require("../repositories/postScrapRepository")
const jwt = require("jsonwebtoken");
class ScrapsService {
    constructor() {
        this.PostRepository = new PostRepository();
        this.PostLikeRepository = new PostLikeRepository();
        this.PostScrapRepository = new PostScrapRepository();
    }

    getListAll = async({user_id, access, page}) => {
        // 게시글 목록 조회
        const list = await this.PostRepository.findAllPostscrapByUserId({user_id, page})
        const result = [];
        const promises = list.map(async (item) => {
            let like_check = false;
            let scrap_check = false;
            if(access){
                const ACCESS_KEY = "howdoi_";

                const [accessType, accessToken] = access.split(" ");
                const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                const { user_id } = decodedAccess.user_id
            
                const like_search = await this.PostLikeRepository.findByuserId({ user_id, item })
                if(like_search){
                    like_check = true;
                }else{
                    like_check = false;
                }
                const scrap_search = await this.PostScrapRepository.findByUserId({user_id, item})
                if(scrap_search){
                    scrap_check = true;
                }else{
                    scrap_check = false;
                }
            }
            const scroll_result = {
                post_id: item.post_id,
                user_id: item.user_id,
                nickname: item["PostsScraps.User.nickname"],
                user_type: item["PostsScraps.User.user_type"],
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

        const total_count = await this.PostRepository.postCount()
        const total_page = Math.ceil(total_count / 10);
        const last_page = total_page == page ? true : false;
        const Result_Json = JSON.stringify(result);

        const temp = JSON.parse(`${Result_Json}`);
        return {
            mypage: temp,
            page: Number(page),
            last_page: last_page,
            total_page: total_page,
        }
    }

    getListByCategory = async({category, user_id, access, page}) => {
        if (category === "1") {
            category = "생활비";
        } else if (category === "2") {
            category = "자취끼니";
        } else if (category === "3") {
            category = "집안일";
        }

        const list = await this.PostRepository.findAllPostscrapByCategory({user_id, category, page})

        const result = [];
        const promises = list.map(async (item) => {
            let like_check = false;
            let scrap_check = false;
            if(access){
                const ACCESS_KEY = "howdoi_";

                const [accessType, accessToken] = access.split(" ");
                const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                const { user_id } = decodedAccess.user_id
            
                const like_search = await this.PostLikeRepository.findByuserId({ user_id, item })
                if(like_search){
                    like_check = true;
                }else{
                    like_check = false;
                }
                const scrap_search = await this.PostScrapRepository.findByUserId({user_id, item})
                if(scrap_search){
                    scrap_check = true;
                }else{
                    scrap_check = false;
                }
            }
            const scroll_result = {
                post_id: item.post_id,
                user_id: item.user_id,
                nickname: item["PostsScraps.User.nickname"],
                user_type: item["PostsScraps.User.user_type"],
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

        const total_count = await this.PostRepository.postCount()
        const total_page = Math.ceil(total_count / 10);
        const last_page = total_page == page ? true : false;
        const Result_Json = JSON.stringify(result);

        const temp = JSON.parse(`${Result_Json}`);

        return {
            mypage: temp,
            page: Number(page),
            last_page: last_page,
            total_page: total_page,
        }
    }

    getListByFilter = async({filter, user_id, access, page}) => {
        //작은 따옴표로 해야함
        if (filter === "1") {
            filter = '강아지';
        } else if (filter === "2") {
            filter = '엄빠';
        }
        const list = await this.PostRepository.findAllPostscrapByUserId({user_id, page})

        const result = [];
        const promises = list.map(async (item) => {
            let like_check = false;
            let scrap_check = false;
            if(access){
                const ACCESS_KEY = "howdoi_";

                const [accessType, accessToken] = access.split(" ");
                const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                const { user_id } = decodedAccess.user_id
            
                const like_search = await this.PostLikeRepository.findByuserId({ user_id, item })
                if(like_search){
                    like_check = true;
                }else{
                    like_check = false;
                }
                const scrap_search = await this.PostScrapRepository.findByUserId({user_id, item})
                if(scrap_search){
                    scrap_check = true;
                }else{
                    scrap_check = false;
                }
            }
            const scroll_result = {
                post_id: item.post_id,
                user_id: item.user_id,
                nickname: item["PostsScraps.User.nickname"],
                user_type: item["PostsScraps.User.user_type"],
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

        const total_count = await this.PostRepository.postCount()
        const total_page = Math.ceil(total_count / 10);
        const last_page = total_page == page ? true : false;
        const Result_Json = JSON.stringify(result);

        const temp = JSON.parse(`${Result_Json}`);
        return {
            mypage: temp,
            page: Number(page),
            last_page: last_page,
            total_page: total_page,
        }
    }

    getList = async({category, filter, user_id, access, page}) => {
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

        const list = await this.PostRepository.findAllPostscrapByCategory({user_id, category, page})

        const result = [];
        const promises = list.map(async (item) => {
            let like_check = false;
            let scrap_check = false;
            if(access){
                const ACCESS_KEY = "howdoi_";

                const [accessType, accessToken] = access.split(" ");
                const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                const { user_id } = decodedAccess.user_id
            
                const like_search = await this.PostLikeRepository.findByuserId({ user_id, item })
                if(like_search){
                    like_check = true;
                }else{
                    like_check = false;
                }
                const scrap_search = await this.PostScrapRepository.findByUserId({user_id, item})
                if(scrap_search){
                    scrap_check = true;
                }else{
                    scrap_check = false;
                }
            }
            const scroll_result = {
                post_id: item.post_id,
                user_id: item.user_id,
                nickname: item["PostsScraps.User.nickname"],
                user_type: item["PostsScraps.User.user_type"],
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

        const total_count = await this.PostRepository.postCount()
        const total_page = Math.ceil(total_count / 10);
        const last_page = total_page == page ? true : false;
        const Result_Json = JSON.stringify(result);

        const temp = JSON.parse(`${Result_Json}`);
        return {
            mypage: temp,
            page: Number(page),
            last_page: last_page,
            total_page: total_page,
        }
    }
    deleteScrapList = async({user_id}) => {
        // 게시글 목록 조회
        const list = await this.PostRepository.findAllPostscrapOrderByPostId({user_id})
        list.forEach(async(item) => {
            await this.PostScrapRepository.deleteScrap(item)
        });
    }

    deleteScrapListByCategory = async({category, user_id}) => {
        if (category === "1") {
            category = "생활비";
        } else if (category === "2") {
            category = "자취끼니";
        } else if (category === "3") {
            category = "집안일";
        }

        const list = await this.PostRepository.findscrapByCategory({user_id, category})
        console.log(list)
        
        list.forEach(async(item) => {
            console.log(item["PostsScraps.user_id"])
            await this.PostScrapRepository.deleteScrap(item)
        });
    }

    deleteScrapByFilter = async() => {
        //작은 따옴표로 해야함
        if (filter === "1") {
            filter = '강아지';
        } else if (filter === "2") {
            filter = '엄빠';
        }
        const list = await this.PostRepository.findAllPostscrapOrderByPostId({user_id})

        list.forEach(async(item) => {
            await this.PostScrapRepository.deleteScrap(item)
        });
    }

    deleteScrapByCategoryFilter = async({category,filter, user_id}) => {
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

        const list = await this.PostRepository.findscrapByCategory({user_id, category})

        list.forEach(async(item) => {
            await this.PostScrapRepository.deleteScrap(item)
        });
    }
}

module.exports = ScrapsService;