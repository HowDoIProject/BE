const CommentController = require("../../../controllers/commentsController")
const {postCommentInsertSchema} = require("../../fixtures/commentFixture")
const mockCommentService = () => ({
    postComment: jest.fn(),
    checkComment: jest.fn(),
    deleteComment: jest.fn(),
    updateComment: jest.fn(),
    checkChooseComment: jest.fn(),
    ConfirmComment: jest.fn(),
    chooseComment: jest.fn(),
    likeComment: jest.fn(),
})

describe("댓글 작성 test", () => {
    let commentcontroller = new CommentController();
    commentcontroller.CommentService = mockCommentService();

    let mockResponse = {
        status: jest.fn(),
        json: jest.fn(),
        locals: {
            id: {
                user_id: 2,
            },
        },
    };
    let mockRequest = {
        body: {
            comment: "test",
            image: "test img"
        },
        params: {
            id: '1'
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    test("성공시 댓글 작성 성공 반환", async() => {
        commentcontroller.CommentService.postComment = jest.fn(() => {
            return ;
        })
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });
        await commentcontroller.postComment(
            mockRequest,
            mockResponse,
        )

        expect(commentcontroller.CommentService.postComment).toHaveBeenCalledTimes(1);
        expect(commentcontroller.CommentService.postComment).toHaveBeenCalledWith({
            post_id: postCommentInsertSchema.post_id,
            user_id: mockResponse.locals.id.user_id,
            comment: postCommentInsertSchema.comment,
            image: postCommentInsertSchema.image
        })

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "댓글 작성이 완료되었습니다."
        });
    })
    test("예상치 못한 에러 발생 ", async() => {
        const postCommentErrorMessage = {message : "댓글 작성에 실패했습니다."}
        commentcontroller.CommentService.postComment = jest.fn(() => {
            throw new Error (postCommentErrorMessage)
        })
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });

        await commentcontroller.postComment(
            mockRequest,
            mockResponse,
        )

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith(postCommentErrorMessage);
    })

    test("comment 값이 비어있을 때 에러 반환", async() => {
        mockRequest = {
            body: {
                image: "test img"
            },
            params: {
                id: '1'
            }
        };
        commentcontroller.CommentService.postComment = jest.fn(() => {
            return ;
        })
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });
        await commentcontroller.postComment(
            mockRequest,
            mockResponse,
        )

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "다시 한 번 확인해주세요"
        });
    })
})

describe("댓글 수정 test", () => {
    let commentcontroller = new CommentController();
    commentcontroller.CommentService = mockCommentService();

    let mockResponse = {
        status: jest.fn(),
        json: jest.fn(),
        locals: {
            id: {
                user_id: 2,
            },
        },
    };
    let mockRequest = {
        body: {
            comment: "test",
            image: "test img"
        },
        params: {
            p_id: '1',
            c_id: '2',
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    test("성공시 댓글 수정 성공 반환", async() => {
        commentcontroller.CommentService.checkComment = jest.fn()
        commentcontroller.CommentService.updateComment = jest.fn(() => {
            return ;
        })
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });
        await commentcontroller.updateComment(
            mockRequest,
            mockResponse,
        )
        expect(commentcontroller.CommentService.checkComment).toHaveBeenCalledTimes(1);
        expect(commentcontroller.CommentService.checkComment).toHaveBeenCalledWith({
            post_id: Number(mockRequest.params.p_id),
            comment_id: Number(mockRequest.params.c_id),
            user_id: mockResponse.locals.id.user_id
        })

        expect(commentcontroller.CommentService.updateComment).toHaveBeenCalledTimes(1);
        expect(commentcontroller.CommentService.updateComment).toHaveBeenCalledWith({
            comment_id: Number(mockRequest.params.c_id),
            comment: postCommentInsertSchema.comment,
            image: postCommentInsertSchema.image
        })

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "댓글 수정이 완료되었습니다."
        });
    })
    test("예상치 못한 에러 발생 ", async() => {
        const updateCommentErrorMessage = {message : "댓글 수정에 실패했습니다."}
        commentcontroller.CommentService.updateComment = jest.fn(() => {
            throw new Error (updateCommentErrorMessage)
        })
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });

        await commentcontroller.updateComment(
            mockRequest,
            mockResponse,
        )

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith(updateCommentErrorMessage);
    })

    test("게시글댓글 존재여부, 권환확인 후 에러 발생 시 에러 반환", async() => {
        commentcontroller.CommentService.checkComment = jest.fn(() => {
            return "유효하지 않은 게시글입니다." ;
        })
        commentcontroller.CommentService.updateComment = jest.fn(() => {
            return ;
        })
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });
        await commentcontroller.updateComment(
            mockRequest,
            mockResponse,
        )

        expect(commentcontroller.CommentService.checkComment).toHaveBeenCalledTimes(1);
        expect(commentcontroller.CommentService.checkComment).toHaveBeenCalledWith({
            post_id: Number(mockRequest.params.p_id),
            comment_id: Number(mockRequest.params.c_id),
            user_id: mockResponse.locals.id.user_id
        })

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "유효하지 않은 게시글입니다."
        });
    })
})

describe("댓글 채택 test", () => {
    let commentcontroller = new CommentController();
    commentcontroller.CommentService = mockCommentService();

    let mockResponse = {
        status: jest.fn(),
        json: jest.fn(),
        locals: {
            id: {
                user_id: 2,
            },
        },
    };
    let mockRequest = {
        params: {
            p_id: '1',
            c_id: '2',
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    test("성공시 댓글 채택 성공 반환", async() => {
        commentcontroller.CommentService.checkChooseComment = jest.fn()
        commentcontroller.CommentService.ConfirmComment = jest.fn()
        commentcontroller.CommentService.chooseComment = jest.fn()

        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });
        await commentcontroller.chooseComment(
            mockRequest,
            mockResponse,
        )
        expect(commentcontroller.CommentService.checkChooseComment).toHaveBeenCalledTimes(1);
        expect(commentcontroller.CommentService.checkChooseComment).toHaveBeenCalledWith({
            post_id: Number(mockRequest.params.p_id),
            comment_id: Number(mockRequest.params.c_id),
            user_id: mockResponse.locals.id.user_id
        })

        expect(commentcontroller.CommentService.ConfirmComment).toHaveBeenCalledTimes(1);
        expect(commentcontroller.CommentService.ConfirmComment).toHaveBeenCalledWith({
            post_id: Number(mockRequest.params.p_id)
        })

        expect(commentcontroller.CommentService.chooseComment).toHaveBeenCalledTimes(1);
        expect(commentcontroller.CommentService.chooseComment).toHaveBeenCalledWith({
            post_id: Number(mockRequest.params.p_id),
            comment_id: Number(mockRequest.params.c_id),
        })

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "채택이 완료되었습니다."
        });
    })
    test("예상치 못한 에러 발생 ", async() => {
        const chooseCommentErrorMessage = {message : "채택에 실패했습니다."}
        commentcontroller.CommentService.chooseComment = jest.fn(() => {
            throw new Error (chooseCommentErrorMessage)
        })
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });

        await commentcontroller.chooseComment(
            mockRequest,
            mockResponse,
        )

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith(chooseCommentErrorMessage);
    })

    test("게시글댓글 존재여부, 권환확인 후 에러 발생 시 에러 반환", async() => {
        commentcontroller.CommentService.checkChooseComment = jest.fn(() => {
            return "유효하지 않은 게시글입니다."
        })
        commentcontroller.CommentService.ConfirmComment = jest.fn()
        commentcontroller.CommentService.chooseComment = jest.fn()

        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });
        await commentcontroller.chooseComment(
            mockRequest,
            mockResponse,
        )

        expect(commentcontroller.CommentService.checkChooseComment).toHaveBeenCalledTimes(1);
        expect(commentcontroller.CommentService.checkChooseComment).toHaveBeenCalledWith({
            post_id: Number(mockRequest.params.p_id),
            comment_id: Number(mockRequest.params.c_id),
            user_id: mockResponse.locals.id.user_id
        })

        expect(commentcontroller.CommentService.ConfirmComment).toHaveBeenCalledTimes(0);
        expect(commentcontroller.CommentService.chooseComment).toHaveBeenCalledTimes(0);

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "유효하지 않은 게시글입니다."
        });
    })

    test("이미 채택한 댓글이 있을 때 에러 반환", async() => {
        commentcontroller.CommentService.checkChooseComment = jest.fn()
        commentcontroller.CommentService.ConfirmComment = jest.fn(() => {
            return "이미 채택된 답변이 존재합니다."
        })
        commentcontroller.CommentService.chooseComment = jest.fn()

        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });
        await commentcontroller.chooseComment(
            mockRequest,
            mockResponse,
        )

        expect(commentcontroller.CommentService.ConfirmComment).toHaveBeenCalledTimes(1);
        expect(commentcontroller.CommentService.ConfirmComment).toHaveBeenCalledWith({
            post_id: Number(mockRequest.params.p_id)
        })

        expect(commentcontroller.CommentService.checkChooseComment).toHaveBeenCalledTimes(1);
        expect(commentcontroller.CommentService.checkChooseComment).toHaveBeenCalledWith({
            post_id: Number(mockRequest.params.p_id),
            comment_id: Number(mockRequest.params.c_id),
            user_id: mockResponse.locals.id.user_id
        })
        expect(commentcontroller.CommentService.chooseComment).toHaveBeenCalledTimes(0);

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "이미 채택된 답변이 존재합니다."
        });
    })
})