const CommentService = require("../../../services/commentsService")
const { 
    postCommentInsertSchema, 
    checkCommentInsertSchema, 
    checkPostResultSchema, 
    checkCommentResultSchema, 
    updateCommentInsertSchema, 
    ChooseCommentResultSchema 
} = require("../../fixtures/commentFixture")

const mockCommentRepository = () => ({
    postComment: jest.fn(),
    checkComment: jest.fn(),
    updateComment: jest.fn(),
    findAllCommentById: jest.fn(),
    chooseComment: jest.fn()
})
const mockPostRepository = () => ({
    checkPost: jest.fn()
})

describe("postComment test", () => {
    beforeEach(() => {
        // restore the spy created with spyOn
        jest.resetAllMocks();
    });
    test("postComment test", async () => {
        let commentservice = new CommentService();
        commentservice.CommentRepository = Object.assign(
            {},
            mockCommentRepository
        );

        commentservice.CommentRepository.postComment = jest.fn()
        await commentservice.postComment(postCommentInsertSchema)

        expect(commentservice.CommentRepository.postComment).toHaveBeenCalledWith(postCommentInsertSchema)
        expect(commentservice.CommentRepository.postComment).toHaveBeenCalledTimes(1);
    })
})

describe("checkComment test", () => {
    beforeEach(() => {
        // restore the spy created with spyOn
        jest.resetAllMocks();
    });

    test('checkComment test', async () => {
        let commentservice = new CommentService();
        commentservice.PostRepository = Object.assign(
            {},
            mockPostRepository
        );
        commentservice.CommentRepository = Object.assign(
            {},
            mockCommentRepository
        );

        commentservice.PostRepository.checkPost = jest.fn(
            () => checkPostResultSchema
        )
        commentservice.CommentRepository.checkComment = jest.fn(
            () => checkCommentResultSchema
        )
        await commentservice.checkComment(checkCommentInsertSchema)

        expect(commentservice.PostRepository.checkPost).toHaveBeenCalledWith({
            post_id: checkCommentInsertSchema.post_id
        });
        expect(commentservice.PostRepository.checkPost).toHaveBeenCalledTimes(1);
        expect(commentservice.CommentRepository.checkComment).toHaveBeenCalledWith({
            comment_id: checkCommentInsertSchema.comment_id
        })
        expect(commentservice.CommentRepository.checkComment).toHaveBeenCalledTimes(1);

    })
    test('해당게시글이 없을 때 test', async () => {
        let commentservice = new CommentService();
        commentservice.PostRepository = Object.assign(
            {},
            mockPostRepository
        );
        commentservice.CommentRepository = Object.assign(
            {},
            mockCommentRepository
        );

        commentservice.PostRepository.checkPost = jest.fn()
        commentservice.CommentRepository.checkComment = jest.fn(
            () => checkCommentResultSchema
        )
        const message = await commentservice.checkComment(checkCommentInsertSchema)

        expect(commentservice.PostRepository.checkPost).toHaveBeenCalledWith({
            post_id: checkCommentInsertSchema.post_id
        });
        expect(commentservice.PostRepository.checkPost).toHaveBeenCalledTimes(1);
        expect(commentservice.CommentRepository.checkComment).toHaveBeenCalledTimes(0);
        expect(message).toStrictEqual("유효하지 않은 게시글입니다.")
    })

    test('해당 댓글이 없을 때 test', async () => {
        let commentservice = new CommentService();
        commentservice.PostRepository = Object.assign(
            {},
            mockPostRepository
        );
        commentservice.CommentRepository = Object.assign(
            {},
            mockCommentRepository
        );

        commentservice.PostRepository.checkPost = jest.fn(
            () => checkPostResultSchema
        )
        commentservice.CommentRepository.checkComment = jest.fn()

        const message = await commentservice.checkComment(checkCommentInsertSchema)

        expect(commentservice.PostRepository.checkPost).toHaveBeenCalledWith({
            post_id: checkCommentInsertSchema.post_id
        });
        expect(commentservice.PostRepository.checkPost).toHaveBeenCalledTimes(1);
        expect(commentservice.CommentRepository.checkComment).toHaveBeenCalledWith({
            comment_id: checkCommentInsertSchema.comment_id
        })
        expect(commentservice.CommentRepository.checkComment).toHaveBeenCalledTimes(1);
        expect(message).toStrictEqual("유효하지 않은 댓글입니다.")

    })
})

describe("updateComment test", () => {
    beforeEach(() => {
        // restore the spy created with spyOn
        jest.resetAllMocks();
    });
    test("updateComment Test", async () => {
        let commentservice = new CommentService();
        commentservice.CommentRepository = Object.assign(
            {},
            mockCommentRepository
        );

        commentservice.CommentRepository.updateComment = jest.fn()
        await commentservice.updateComment(updateCommentInsertSchema)

        expect(commentservice.CommentRepository.updateComment).toHaveBeenCalledWith(updateCommentInsertSchema);
        expect(commentservice.CommentRepository.updateComment).toHaveBeenCalledTimes(1);
    })
})

describe("ConfirmComment test", () => {
    beforeEach(() => {
        // restore the spy created with spyOn
        jest.resetAllMocks();
    });
    test("채택된 답변이 없을 때 test", async () => {
        let commentservice = new CommentService();
        commentservice.CommentRepository = Object.assign(
            {},
            mockCommentRepository
        );

        commentservice.CommentRepository.findAllCommentById = jest.fn(
            () => []
        )
        await commentservice.ConfirmComment({
            post_id: checkCommentInsertSchema.post_id
        })

        expect(commentservice.CommentRepository.findAllCommentById).toHaveBeenCalledWith({
            post_id: checkCommentInsertSchema.post_id
        })
        expect(commentservice.CommentRepository.findAllCommentById).toHaveBeenCalledTimes(1);
    })
    test("채택된 답변이 있을 때 test", async() => {
        let commentservice = new CommentService();
        commentservice.CommentRepository = Object.assign(
            {},
            mockCommentRepository
        );

        commentservice.CommentRepository.findAllCommentById = jest.fn(
            () => ChooseCommentResultSchema
        )
        const message = await commentservice.ConfirmComment({
            post_id: checkCommentInsertSchema.post_id
        })

        expect(commentservice.CommentRepository.findAllCommentById).toHaveBeenCalledWith({
            post_id: checkCommentInsertSchema.post_id
        })
        expect(commentservice.CommentRepository.findAllCommentById).toHaveBeenCalledTimes(1);
        expect(message).toStrictEqual("이미 채택된 답변이 존재합니다.")
    })
})

describe("chooseComment test",() => {
    beforeEach(() => {
        // restore the spy created with spyOn
        jest.resetAllMocks();
    });
    test("chooseComment test",async() => {
        let commentservice = new CommentService();
        commentservice.CommentRepository = Object.assign(
            {},
            mockCommentRepository
        );

        commentservice.CommentRepository.chooseComment = jest.fn()
        const message = await commentservice.chooseComment({
            post_id: checkCommentInsertSchema.post_id,
            comment_id: checkCommentInsertSchema.comment_id
        })

        expect(commentservice.CommentRepository.chooseComment).toHaveBeenCalledWith({
            post_id: checkCommentInsertSchema.post_id,
            comment_id: checkCommentInsertSchema.comment_id
        })
        expect(commentservice.CommentRepository.chooseComment).toHaveBeenCalledTimes(1);
    })
})