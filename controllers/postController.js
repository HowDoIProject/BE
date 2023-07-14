const PostService = require("../services/postService")
class PostController {
    constructor() {
        this.PostService = new PostService();
    }
    //게시글작성
    createpost = async (req, res) => {
        const { nickname } = res.locals.user;
        const { user_id } = res.locals.id;
        const { title, content, category, image } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "다시 한 번 확인해주세요" });
        } else {
            await this.PostService.createPost({
                user_id,
                nickname,
                title,
                content,
                image,
                category,
            }).then((data) => {
                return res.status(200).json({
                    message: "게시글이 올라갔습니다",
                });
            });
        }
    }

    //게시글 수정
    updatepost = async (req, res) => {
        try {
            const { user_id } = res.locals.id;
            const { title, content, category, image } = req.body;
            const { id } = req.params;
            const post_id = Number(id);

            //권한체크
            const message = await this.PostService.checkPost({ post_id, user_id })
            if (message) {
                return res.status(400).json({ message: message });
            }
            //게시글 수정
            await this.PostService.updatePost({
                title,
                content,
                category,
                image,
                post_id,
            }).then((data) => {
                return res.status(200).json({
                    message: "게시글 수정이 완료되었습니다.",
                });
            });
        } catch (error) {
            return res.status(400).json({ message: "게시글 수정에 실패했습니다." });
        }
    }

    //게시글 삭제
    deletepost = async (req, res) => {
        try {
            const { user_id } = res.locals.id;
            const { id } = req.params;
            const post_id = Number(id);

            //권한체크
            const message = await this.PostService.checkPost({ post_id, user_id })
            if (message) {
                return res.status(400).json({ message: message });
            }

            await this.PostService.deletePost({
                post_id
            }).then((data) => {
                return res.status(200).json({
                    message: "게시글 삭제가 완료되었습니다.",
                });
            });
        } catch (error) {
            return res.status(400).json({ message: "게시글 삭제에 실패했습니다." });
        }
    }

    //게시글 상세조회
    detailpost = async (req, res) => {
        try {
            // params로 postId 받기
            const { id } = req.params;
            const post_id = Number(id);
            const { refresh, access } = req.headers;

            // 게시글, 댓글 상세 조회
            const { post, comments } = await this.PostService.detailPost({ post_id })
            // 게시글이 없을 경우
            if (!post) {
                return res
                    .status(400)
                    .json({ message: "존재하지 않는 게시글입니다." });
            }
            const result = await this.PostService.detailComment({ access, comments })

            await this.PostService.updateCommentCount({ post_id })

            // 게시글 상세 조회
            // (comments X)
            if (!comments) {
                return res.status(200).json({ post });
            }
            // (comments O)
            else {
                return res.status(200).json({ post, comment: result });
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: "게시글 조회에 실패했습니다." + error });
        }
    }

    //게시글 도움되었어요
    likepost = async (req, res) => {
        try {
            const user_id = res.locals.id;
            const { id } = req.params;
            const post_id = Number(id);

            //좋아요 등록, 취소
            const message = await this.PostService.likePost({ user_id, post_id })
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

    //게시글 스크랩
    scrappost = async (req, res) => {
        try {
            const user_id = res.locals.id;
            const { id } = req.params;
            const post_id = Number(id);

            const message = await this.PostService.ScrapPost({ user_id, post_id })
            console.log(message)
            return res.status(200).json({
                message: message,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(400)
                .json({ message: "스크랩에 실패했습니다." + error });
        }
    }
}

module.exports = PostController;