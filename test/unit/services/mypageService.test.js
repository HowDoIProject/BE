const MypageService = require("../../../services/mypageService")
const { MycommentResultSchema, userIdInsertSchema, ChosenCommentResultSchema, MyChosenCommentResultSchema } = require("../../fixtures/commentFixture")

const mockCommentRepository = () => ({
    findAllCommentByUserId: jest.fn(),
    getChosenComment: jest.fn(),
    getMyChosenComment: jest.fn(),
})

describe("getMyComment test",() => {
    beforeEach(() => {
        // restore the spy created with spyOn
        jest.resetAllMocks();
    });
    test("getMyComment test" ,async() => {
        let mypageservice = new MypageService();
        mypageservice.CommentRepository = Object.assign(
            {},
            mockCommentRepository
        );

        mypageservice.CommentRepository.findAllCommentByUserId = jest.fn(
            () => MycommentResultSchema
        );
        const comment = await mypageservice.getMyComment(
            userIdInsertSchema
        );

        expect(
            mypageservice.CommentRepository.findAllCommentByUserId
        ).toHaveBeenCalledWith(userIdInsertSchema)
        expect(
            mypageservice.CommentRepository.findAllCommentByUserId
        ).toHaveBeenCalledTimes(1);
        expect(comment).toStrictEqual(MycommentResultSchema);

    })
})

describe("getChosenComment test",() => {
    beforeEach(() => {
        // restore the spy created with spyOn
        jest.resetAllMocks();
    });
    test("getChosenComment test" ,async() => {
        let mypageservice = new MypageService();
        mypageservice.CommentRepository = Object.assign(
            {},
            mockCommentRepository
        );

        mypageservice.CommentRepository.getChosenComment = jest.fn(
            () => ChosenCommentResultSchema
        );
        const comment = await mypageservice.getChosenComment(
            userIdInsertSchema
        );

        expect(
            mypageservice.CommentRepository.getChosenComment
        ).toHaveBeenCalledWith(userIdInsertSchema)
        expect(
            mypageservice.CommentRepository.getChosenComment
        ).toHaveBeenCalledTimes(1);
        expect(comment).toStrictEqual(ChosenCommentResultSchema);

    })
})

describe("getMyChosenComment test",() => {
    beforeEach(() => {
        // restore the spy created with spyOn
        jest.resetAllMocks();
    });
    test("getMyChosenComment test" ,async() => {
        let mypageservice = new MypageService();
        mypageservice.CommentRepository = Object.assign(
            {},
            mockCommentRepository
        );

        mypageservice.CommentRepository.getMyChosenComment = jest.fn(
            () => MyChosenCommentResultSchema
        );
        const comment = await mypageservice.getMyChosenComment(
            userIdInsertSchema
        );

        expect(
            mypageservice.CommentRepository.getMyChosenComment
        ).toHaveBeenCalledWith(userIdInsertSchema)
        expect(
            mypageservice.CommentRepository.getMyChosenComment
        ).toHaveBeenCalledTimes(1);
        expect(comment).toStrictEqual(MyChosenCommentResultSchema);

    })
})