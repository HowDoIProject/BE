const PostRepository = require("../repositories/postRepository")
const PostLikeRepository = require("../repositories/postLikeRepository")
const PostScrapRepository = require("../repositories/postScrapRepository")
const CommentRepository = require("../repositories/commentRepository")
const jwt = require("jsonwebtoken")

class MypageService {
    constructor() {
        this.PostRepository = new PostRepository();
        this.PostLikeRepository = new PostLikeRepository();
        this.PostScrapRepository = new PostScrapRepository();
        this.CommentRepository = new CommentRepository();
    }

    getAllMypage = async({user_id}) => {
        return await this.PostRepository.getAllMypage({user_id})
    }

    getMypage = async({user_id, page, access}) => {
        const mypage = await this.PostRepository.getMypage({user_id, page})
    
        const result = [];
        const promises = mypage.map(async (item) => {
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
        }
    }

    getMyStat = async({user_id}) => {
        const mypost = await this.PostRepository.findAllPosts({user_id})
        const mycomment = await this.CommentRepository.findAllComment({user_id})
        const mylikes = await this.CommentRepository.sumAllComment({user_id})

        return {
            mypost: mypost.length,
            mycomment: mycomment.length,
            mylikes: mylikes
        }
    }

    getMyComment = async({user_id}) => {
        console.log({user_id})
        return await this.CommentRepository.findAllCommentByUserId({user_id})
    }

    getChosenComment = async({user_id}) => {
        return await this.CommentRepository.getChosenComment({user_id})
    }

    getMyChosenComment = async({user_id}) => {
        return await this.CommentRepository.getMyChosenComment({user_id})
    }
}
module.exports = MypageService;