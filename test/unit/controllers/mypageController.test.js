const MypageController = require("../../../controllers/mypageController")
const { MycommentResultSchema } = require("../../fixtures/commentFixture")
const mockMypageService = () => ({
    getAllMypage: jest.fn(),
    getMypage: jest.fn(),
    getMyStat: jest.fn(),
    getMyComment: jest.fn(),
    getChosenComment: jest.fn(),
    getMyChosenComment: jest.fn(),
})

describe("get My Comment Test", () => {
    let mypagecontroller = new MypageController();
    mypagecontroller.MypageService = mockMypageService();

    let mockResponse = {
        status: jest.fn(),
        json: jest.fn(),
        locals: {
            id: {
                user_Id: { user_id: 2 },
            },
        },
    };
    let mockRequest = {
        body: {},
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    test("성공시 내가 쓴 댓글 반환", async () => {
        mypagecontroller.MypageService.getMyComment = jest.fn(() => {
            return MycommentResultSchema
        })
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });

        await mypagecontroller.getMyComment(
            mockRequest,
            mockResponse,
        )

        expect(mypagecontroller.MypageService.getMyComment).toHaveBeenCalledTimes(1);
        expect(mypagecontroller.MypageService.getMyComment).toHaveBeenCalledWith({ user_id: mockResponse.locals.id });

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            mycomment: MycommentResultSchema
        });
    })

    test("예상치 못한 에러 발생 시 에러반환", async () => {
        const getCommentErrorMessage = {message : "목록 조회에 실패했습니다."};
        mypagecontroller.MypageService.getMyComment = jest.fn(() => {
            throw new Error(getCommentErrorMessage) 
        })
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });

        // Error가 발생합니다.
        await mypagecontroller.getMyComment(
            mockRequest,
            mockResponse,
        );

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith(getCommentErrorMessage);
    })

    test("작성된 댓글이 없을 경우 에러반환", async () => {
        const MycommentErrorResultSchema = [];
        mypagecontroller.MypageService.getMyComment = jest.fn(() => {
            return MycommentErrorResultSchema
        })
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });

        // Error가 발생합니다.
        await mypagecontroller.getMyComment(
            mockRequest,
            mockResponse,
        );

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "작성된 댓글이 없습니다." });

    })
})