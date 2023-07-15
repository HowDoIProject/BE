const PostRepository = require("../repositories/postRepository")
const CommentRepository = require("../repositories/commentRepository")
const PostLikeRepository = require("../repositories/postLikeRepository")
const PostScrapRepository = require("../repositories/postScrapRepository")

const jwt = require("jsonwebtoken")
class PostService {
    constructor() {
        this.PostRepository = new PostRepository();
        this.CommentRepository = new CommentRepository();
        this.PostLikeRepository = new PostLikeRepository();
        this.PostScrapRepository = new PostScrapRepository();
    }

    createPost = async ({
        user_id,
        nickname,
        title,
        content,
        image,
        category,
    }) => {
        await this.PostRepository.createPost({
            user_id,
            nickname,
            title,
            content,
            image,
            category,
        })
    }

    checkPost = async ({ post_id, user_id }) => {
        const targetPost = await this.PostRepository.checkPost({ post_id })
        if (!targetPost) {
            return "유효하지 않은 게시글입니다.";
        }

        if (targetPost.user_id !== user_id) {
            return "권한이 없습니다.";
        }
    }

    updatePost = async ({
        title,
        content,
        category,
        image,
        post_id,
    }) => {
        await this.PostRepository.updatePost({
            title,
            content,
            category,
            image,
            post_id,
        })
    }

    deletePost = async ({ post_id }) => {
        await this.PostRepository.deletePost({ post_id })
    }

    detailPost = async ({ access, post_id }) => {
        const check = await this.CommentRepository.findChosenComment({post_id})
        let ischosen = false;
        if(check.length !== 0) {
            ischosen = true;
        }
        const item = await this.PostRepository.detailPost({ post_id })
        const post = [];
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
                ischosen: ischosen,
                title: item.title,
                content: item.content,
                category: item.category,
                image: item.image,
                like_num: item.like_num,
                like_check: like_check,
                scrap_num: item.scrap_num,
                scrap_check: scrap_check,
                created_at: item.created_at,
                updated_at: item.updated_at,
            };
            post.push(scroll_result);

        const comments = await this.CommentRepository.detailComment({ post_id })
        return { post, comments }
    }
    detailComment = async ({ access,comments }) => {
        const raw_result = [];
        const promises = comments.map(async (item) => {
            let like_check = false;
            if (access) {
                const ACCESS_KEY = "howdoi_";

                const [accessType, accessToken] = access.split(" ");
                const decodedAccess = jwt.verify(accessToken, ACCESS_KEY);
                const { user_id } = decodedAccess.user_id

                const like_search = await this.PostLikeRepository.findBycommentId({user_id,item})
                if (like_search) {
                    like_check = true;
                } else {
                    like_check = false;
                }
            }
            const scroll_result = {
                comment_id: item.comment_id,
                user_id: item.user_id,
                nickname: item.nickname,
                user_type: item.user_type,
                comment: item.comment,
                image: item.image,
                chosen: item.chosen,
                like_num: item.like_num,
                like_check: like_check,
                created_at: item.created_at,
                updated_at: item.updated_at,
            };
            raw_result.push(scroll_result);
        });
        await Promise.all(promises);
        let result = raw_result.sort((a,b) => {
            if(a.created_at < b.created_at) return 1;
            if(a.created_at > b.created_at) return -1;
            return 0;
        })

        return result;
    }

    updateCommentCount = async ({ post_id }) => {
        const comment_num = await this.CommentRepository.countComment({ post_id })
        await this.PostRepository.updateCommentCount({ post_id, comment_num })
    }

    likePost = async ({ post_id, user_id }) => {
        const likes = await this.PostLikeRepository.findAllLikeByuserIdpostId({
            post_id,
            user_id
        })

        if (likes.length !== 0) {
            await this.PostLikeRepository.deleteLikebyPostId({
                post_id,
                user_id
            })
            //좋아요수 업데이트
            const like_num = await this.PostLikeRepository.findAllLikeByPostId({ post_id, })
            await this.PostRepository.updateLike({ like_num, post_id, })
            return "좋아요가 취소되었습니다.";
        } else {
            await this.PostLikeRepository.createLikebyPostId({
                post_id,
                user_id
            })
            //좋아요수 업데이트
            const like_num = await this.PostLikeRepository.findAllLikeByPostId({ post_id, })
            await this.PostRepository.updateLike({ like_num, post_id, })
            return "좋아요가 완료되었습니다.";
        }
    }

    ScrapPost = async ({ post_id, user_id }) => {
        const scraps = await this.PostScrapRepository.findAllLikeByuserId({
            post_id,
            user_id
        })

        if (scraps.length !== 0) {
            await this.PostScrapRepository.deleteScrap({
                post_id,
                user_id
            })
            //좋아요수 업데이트
            const scrap_num = await this.PostScrapRepository.findAllbyPostId({ post_id })
            await this.PostRepository.updateScrap({ scrap_num, post_id, })
            return "스크랩이 취소되었습니다.";
        } else {
            await this.PostScrapRepository.createScrap({
                post_id,
                user_id
            })
            //좋아요수 업데이트
            const scrap_num = await this.PostScrapRepository.findAllbyPostId({ post_id })
            await this.PostRepository.updateScrap({ scrap_num, post_id, })
            return "스크랩이 완료되었습니다.";
        }
    }
}

module.exports = PostService;