const CommentRepository = require("../repositories/commentRepository.js")
const PostRepository = require("../repositories/postRepository.js")
const PostLikeRepository = require("../repositories/postLikeRepository.js")
class CommentService {
    constructor() {
        this.CommentRepository = new CommentRepository();
        this.PostRepository = new PostRepository();
        this.PostLikeRepository = new PostLikeRepository();
    }
    postComment = async ({
        post_id,
        user_id,
        comment,
        image,
    }) => {
        this.CommentRepository.postComment({
            post_id,
            user_id,
            comment,
            image,
        })
    }

    checkComment = async ({ post_id, comment_id, user_id }) => {
        const targetPost = await this.PostRepository.checkPost({ post_id })
        if (!targetPost) {
            return "유효하지 않은 게시글입니다."
        }

        const targetComment = await this.CommentRepository.checkComment({ comment_id })
        if (!targetComment) {
            return "유효하지 않은 댓글입니다."
        }

        if (targetComment.user_id !== user_id) {
            return "권한이 없습니다."
        }
        return;
    }

    checkChooseComment = async ({ post_id, comment_id, user_id }) => {
        const targetPost = await this.PostRepository.checkPost({ post_id })
        
        if (!targetPost) {
            return "유효하지 않은 게시글입니다."
        }

        const targetComment = await this.CommentRepository.checkComment({ comment_id })
        
        if (!targetComment) {
            return "유효하지 않은 댓글입니다."
        }

        if (targetPost.user_id !== user_id) {
            return "권한이 없습니다."
        }
        return;
    }

    deleteComment = async ({ post_id, comment_id }) => {
        await this.CommentRepository.deleteComment({ post_id, comment_id })
    }

    updateComment = async ({
        comment,
        image,
        comment_id
    }) => {
        await this.CommentRepository.updateComment({
            comment,
            image,
            comment_id
        })

    }

    ConfirmComment = async ({ post_id }) => {
        const chosen_comments = await this.CommentRepository.findAllCommentById({ post_id })
        if (chosen_comments.length !== 0) {
            return "이미 채택된 답변이 존재합니다."
        }
    }

    chooseComment = async ({
        post_id,
        comment_id
    }) => {
        await this.CommentRepository.chooseComment({
            post_id,
            comment_id
        })
    }

    likeComment = async ({
        comment_id,
        user_id
    }) => {
        const likes = await this.PostLikeRepository.findAllLikeByuserId({
            comment_id,
            user_id
        })

        if (likes.length !== 0) {
            await this.PostLikeRepository.deleteLike({
                comment_id,
                user_id
            })
            //좋아요수 업데이트
            const like_num = await this.PostLikeRepository.findAllLikeById({ comment_id })
            await this.CommentRepository.updateLike({ like_num, comment_id })
            return "좋아요가 취소되었습니다.";
        } else {
            await this.PostLikeRepository.createLike({
                comment_id,
                user_id
            })
            //좋아요수 업데이트
            const like_num = await this.PostLikeRepository.findAllLikeById({ comment_id })
            await this.CommentRepository.updateLike({ like_num, comment_id })
            return "좋아요가 완료되었습니다.";
        }
    }
}

module.exports = CommentService;