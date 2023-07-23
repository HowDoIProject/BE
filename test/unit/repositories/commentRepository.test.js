const CommentRepository = require("../../../repositories/commentRepository")
const {
    MycommentResultSchema,
    userIdInsertSchema,
    ChosenCommentResultSchema,
    MyChosenCommentResultSchema,
    postCommentInsertSchema,
    checkCommentResultSchema,
    checkCommentInsertSchema,
    updateCommentInsertSchema
} = require("../../fixtures/commentFixture")
const { Users, Comments, sequelize, Posts } = require("../../../models");
const sinon = require('sinon')

describe("내가쓴댓글 가져오기 test", () => {
    let commentRepository = new CommentRepository();
    let commentFindAllStub;
    beforeEach(() => {
        jest.resetAllMocks();
        commentFindAllStub = sinon.stub(Comments, "findAll")
    })
    afterEach(() => { // 스텁을 복원하여 원래의 동작으로 복구합니다.
        commentFindAllStub.restore();
    });

    test("findAllCommentByUserId test", async () => {
        //findAllCommentByUserId이 어떤 값을 반환해줄지 넣어주기
        commentFindAllStub.resolves(MycommentResultSchema)
        const comment = await commentRepository.findAllCommentByUserId(
            userIdInsertSchema
        )

        expect(commentFindAllStub.calledOnce).toBe(true);
        expect(commentFindAllStub.calledWith({
            attributes: [
                "comment_id",
                "user_id",
                [sequelize.col("User.user_type"), "user_type"],
                "comment",
                "image",
                "chosen",
                [sequelize.col("Post.category"), "category"],
                [sequelize.col("Post.post_id"), "post_id"],
                [sequelize.col("Post.title"), "title"],
                [sequelize.col("Post.like_num"), "like_num"],
                [sequelize.col("Post.scrap_num"), "scrap_num"],
                [sequelize.col("Post.comment_num"), "comment_num"],
                "created_at",
                "updated_at",
            ],
            where: { user_id: userIdInsertSchema.user_id },
            include: [
                {
                    model: Posts,
                    attributes: [],
                },
                {
                    model: Users,
                    attributes: [],
                    where: {
                        user_id: userIdInsertSchema.user_id,
                    },
                },
            ],
            order: [["created_at", "DESC"]],
            raw: true,
        }))

        expect(comment).toEqual(MycommentResultSchema);
    })
})

describe("내가 채택한 댓글 가져오기 test", () => {
    let commentRepository = new CommentRepository();
    let ChosenCommentFindAllStub;
    beforeEach(() => {
        jest.resetAllMocks();
        ChosenCommentFindAllStub = sinon.stub(Comments, "findAll")
    })
    afterEach(() => { // 스텁을 복원하여 원래의 동작으로 복구합니다.
        ChosenCommentFindAllStub.restore();
    });

    test("getChosenComment test", async () => {
        //getChosenComment이 어떤 값을 반환해줄지 넣어주기
        ChosenCommentFindAllStub.resolves(ChosenCommentResultSchema)
        const comment = await commentRepository.getChosenComment(
            userIdInsertSchema
        )

        expect(ChosenCommentFindAllStub.calledOnce).toBe(true);
        expect(ChosenCommentFindAllStub.calledWith({
            attributes: [
                "comment_id",
                "user_id",
                [sequelize.col("User.user_type"), "user_type"],
                "post_id",
                "comment",
                "image",
                "chosen",
                [sequelize.col("Post.category"), "category"],
                [sequelize.col("Post.title"), "title"],
                [sequelize.col("Post.like_num"), "like_num"],
                [sequelize.col("Post.scrap_num"), "scrap_num"],
                [sequelize.col("Post.comment_num"), "comment_num"],
                "created_at",
                "updated_at",
            ],
            where: { chosen: 1 },
            include: [
                {
                    model: Posts,
                    attributes: [],
                    where: {
                        user_id: userIdInsertSchema.user_id,
                    },
                },
                {
                    model: Users,
                    attributes: [],
                    where: {
                        user_id: userIdInsertSchema.user_id,
                    },
                },
            ],
            order: [["created_at", "DESC"]],
            raw: true,
        }))

        expect(comment).toEqual(ChosenCommentResultSchema);
    })
})

describe("나의 채택된 댓글 가져오기 test", () => {
    let commentRepository = new CommentRepository();
    let MyChosenCommentFindAllStub;
    beforeEach(() => {
        jest.resetAllMocks();
        MyChosenCommentFindAllStub = sinon.stub(Comments, "findAll")
    })
    afterEach(() => { // 스텁을 복원하여 원래의 동작으로 복구합니다.
        MyChosenCommentFindAllStub.restore();
    });

    test("getMyChosenComment test", async () => {
        //getMyChosenComment이 어떤 값을 반환해줄지 넣어주기
        MyChosenCommentFindAllStub.resolves(MyChosenCommentResultSchema)
        const comment = await commentRepository.getMyChosenComment(
            userIdInsertSchema
        )

        expect(MyChosenCommentFindAllStub.calledOnce).toBe(true);
        expect(MyChosenCommentFindAllStub.calledWith({
            attributes: [
                "comment_id",
                "user_id",
                "post_id",
                "comment",
                "image",
                "chosen",
                [sequelize.col("category"), "category"],
                "created_at",
                "updated_at",
            ],
            where: { chosen: 1, user_id: userIdInsertSchema.user_id },
            include: [
                {
                    model: Posts,
                    attributes: [],
                },
            ],
            order: [["created_at", "DESC"]],
            raw: true,
        }))

        expect(comment).toEqual(MyChosenCommentResultSchema);
    })
})

describe("댓글 작성하기 test", () => {
    let commentRepository = new CommentRepository();
    let PostCommentFindAllStub;
    beforeEach(() => {
        jest.resetAllMocks();
        PostCommentFindAllStub = sinon.stub(Comments, "create")
    })
    afterEach(() => { // 스텁을 복원하여 원래의 동작으로 복구합니다.
        PostCommentFindAllStub.restore();
    });

    test("postComment test", async () => {
        //postComment이 어떤 값을 반환해줄지 넣어주기
        PostCommentFindAllStub.resolves()
        await commentRepository.postComment(
            postCommentInsertSchema
        )

        expect(PostCommentFindAllStub.calledOnce).toBe(true);
        expect(PostCommentFindAllStub.calledWith(postCommentInsertSchema))
    })
})

describe("댓글 확인하기 test", () => {
    let commentRepository = new CommentRepository();
    let checkCommentFindAllStub;
    beforeEach(() => {
        jest.resetAllMocks();
        checkCommentFindAllStub = sinon.stub(Comments, "findOne")
    })
    afterEach(() => { // 스텁을 복원하여 원래의 동작으로 복구합니다.
        checkCommentFindAllStub.restore();
    });

    test("checkComment test", async () => {
        //checkComment이 어떤 값을 반환해줄지 넣어주기
        checkCommentFindAllStub.resolves(checkCommentResultSchema)
        await commentRepository.checkComment({
            comment_id: checkCommentInsertSchema.comment_id
        })

        expect(checkCommentFindAllStub.calledOnce).toBe(true);
        expect(checkCommentFindAllStub.calledWith({ where: { comment_id: checkCommentInsertSchema.comment_id } }))
    })
})

describe("댓글 수정하기 test", () => {
    let commentRepository = new CommentRepository();
    let updateCommentFindAllStub;
    beforeEach(() => {
        jest.resetAllMocks();
        updateCommentFindAllStub = sinon.stub(Comments, "update")
    })
    afterEach(() => { // 스텁을 복원하여 원래의 동작으로 복구합니다.
        updateCommentFindAllStub.restore();
    });

    test("updateComment test", async () => {
        //updateComment이 어떤 값을 반환해줄지 넣어주기
        updateCommentFindAllStub.resolves()
        await commentRepository.updateComment(updateCommentInsertSchema)

        expect(updateCommentFindAllStub.calledOnce).toBe(true);
        expect(updateCommentFindAllStub.calledWith(
            {
                comment: updateCommentInsertSchema.comment,
                image: updateCommentInsertSchema.image,
            },
            {
                where: { comment_id: updateCommentInsertSchema.comment_id },
            }
        ))
    })
})

