const PostRepository = require("../repositories/postRepository")
const CommentRepository = require("../repositories/commentRepository")
const PostLikeRepository = require("../repositories/postLikeRepository")
const PostScrapRepository = require("../repositories/postScrapRepository")
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

    detailPost = async ({ post_id }) => {
        const post = await this.PostRepository.detailPost({ post_id })
        const comments = await this.CommentRepository.detailComment({ post_id })
        return { post, comments }
    }

    updateCommentCount = async ({ post_id }) => {
        const comment_num = await this.CommentRepository.countComment({ post_id })
        await this.PostRepository.updateCommentCount({post_id, comment_num})
    }

    likePost = async({post_id, user_id}) => {
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

    ScrapPost = async({post_id, user_id}) => {
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