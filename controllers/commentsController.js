const CommentService = require("../services/commentsService.js")
const { Posts, Users, Comments, PostsLikes, sequelize } = require("../models");
const { Op } = require("sequelize");
class CommentController {
    constructor() {
        this.CommentService = new CommentService();
    }
    //댓글 작성
    postComment = async (req, res) => {
        try {
            const { user_id } = res.locals.id;
            const { comment, image } = req.body;
            const { id } = req.params;
            const post_id = Number(id);

            if (!comment) {
                return res.status(400).json({ message: "다시 한 번 확인해주세요" });
            }
            await this.CommentService.postComment({
                post_id,
                user_id,
                comment,
                image,
            }).then((data) => {
                return res.status(200).json({
                    message: "댓글 작성이 완료되었습니다.",
                });
            });

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "댓글 작성에 실패했습니다." });
        }
    }

    //댓글 삭제
    deleteComment = async (req, res) => {
        try {
            const { user_id } = res.locals.id;
            const { p_id, c_id } = req.params;
            const post_id = Number(p_id);
            const comment_id = Number(c_id);

            //게시글, 댓글, 권한 확인
            const message = await this.CommentService.checkComment({ post_id, comment_id, user_id })
            if (message) {
                return res
                    .status(400)
                    .json({ message: message });
            }
            //댓글 삭제
            await this.CommentService.deleteComment({ post_id, comment_id })
                .then((data) => {
                    return res.status(200).json({
                        message: "댓글 삭제가 완료되었습니다.",
                    });
                });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "댓글 삭제에 실패했습니다." });
        }
    }
    //댓글 수정
    updateComment = async (req, res) => {
        try {
            const { user_id } = res.locals.id;
            const { comment, image } = req.body;
            const { p_id, c_id } = req.params;
            const post_id = Number(p_id);
            const comment_id = Number(c_id);

            //게시글, 댓글, 권한 확인
            const message = await this.CommentService.checkComment({ post_id, comment_id, user_id })
            if (message) {
                return res
                    .status(400)
                    .json({ message: message });
            }
            //댓글 수정
            await this.CommentService.updateComment({
                comment,
                image,
                comment_id
            }).then((data) => {
                return res.status(200).json({
                    message: "댓글 수정이 완료되었습니다.",
                });
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "댓글 수정에 실패했습니다." });
        }
    }
    //댓글 채택
    chooseComment = async (req, res) => {
        try {
            const { user_id } = res.locals.id;
            const { p_id, c_id } = req.params;
            const post_id = Number(p_id);
            const comment_id = Number(c_id);

            //게시글, 댓글, 권한 확인
            const message = await this.CommentService.checkChooseComment({ post_id, comment_id, user_id })
            if (message) {
                return res
                    .status(400)
                    .json({ message: message });
            }
            //채택여부확인
            const chosen_comments = await this.CommentService.ConfirmComment({ post_id })
            if (chosen_comments) {
                return res
                    .status(400)
                    .json({ message: chosen_comments });
            } else {
                await this.CommentService.chooseComment({
                    post_id,
                    comment_id
                }).then((data) => {
                    return res.status(200).json({
                        message: "채택이 완료되었습니다.",
                    });
                });
            }
        } catch (error) {
            console.log(error);
            return res
                .status(400)
                .json({ message: "채택에 실패했습니다." + error });
        }
    }
    //댓글 도움이되었어요
    likeComment = async (req, res) => {
        try {
            const user_id = res.locals.id;
            const { id } = req.params;
            const comment_id = Number(id);

            //좋아요 등록, 취소
            const message = await this.CommentService.likeComment({ comment_id, user_id })
            console.log(message)
            return res.status(200).json({
                message: message,
            });

        } catch (error) {
            console.log(error);
            return res
                .status(400)
                .json({ message: "좋아요에 실패했습니다." + error });
        }
    }
}

module.exports = CommentController;