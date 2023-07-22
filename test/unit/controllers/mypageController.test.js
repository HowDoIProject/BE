const MypageController = require("../../../controllers/mypageController")
const { MycommentResultSchema, ChosenCommentResultSchema, MyChosenCommentResultSchema } = require("../../fixtures/commentFixture")
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

describe("get Chosen Comment Test", () => {
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

    test("성공시 내가 채택한 댓글 반환", async () => {
        mypagecontroller.MypageService.getChosenComment = jest.fn(() => {
            return ChosenCommentResultSchema
        })
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });

        await mypagecontroller.getChosenComment(
            mockRequest,
            mockResponse,
        )

        expect(mypagecontroller.MypageService.getChosenComment).toHaveBeenCalledTimes(1);
        expect(mypagecontroller.MypageService.getChosenComment).toHaveBeenCalledWith({ user_id: mockResponse.locals.id });

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            chosencomment: ChosenCommentResultSchema
        });
    })

    test("예상치 못한 에러 발생 시 에러반환", async () => {
        const chosenCommentErrorMessage = {message : "목록 조회에 실패했습니다."};
        mypagecontroller.MypageService.getChosenComment = jest.fn(() => {
            throw new Error(chosenCommentErrorMessage) 
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
        expect(mockResponse.json).toHaveBeenCalledWith(chosenCommentErrorMessage);
    })

    test("작성된 댓글이 없을 경우 에러반환", async () => {
        const MycommentErrorResultSchema = [];
        mypagecontroller.MypageService.getChosenComment = jest.fn(() => {
            return MycommentErrorResultSchema
        })
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });

        // Error가 발생합니다.
        await mypagecontroller.getChosenComment(
            mockRequest,
            mockResponse,
        );

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "작성된 댓글이 없습니다." });

    })
})

describe("get MyChosen Comment Test", () => {
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

    test("성공시 나의 채택된 댓글 반환", async () => {
        mypagecontroller.MypageService.getMyChosenComment = jest.fn(() => {
            return MyChosenCommentResultSchema
        })
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });

        await mypagecontroller.getMyChosenComment(
            mockRequest,
            mockResponse,
        )

        expect(mypagecontroller.MypageService.getMyChosenComment).toHaveBeenCalledTimes(1);
        expect(mypagecontroller.MypageService.getMyChosenComment).toHaveBeenCalledWith({ user_id: mockResponse.locals.id });

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            mychosencomment: MyChosenCommentResultSchema
        });
    })

    test("예상치 못한 에러 발생 시 에러반환", async () => {
        const MychosenCommentErrorMessage = {message : "목록 조회에 실패했습니다."};
        mypagecontroller.MypageService.getMyChosenComment = jest.fn(() => {
            throw new Error(MychosenCommentErrorMessage) 
        })
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });

        // Error가 발생합니다.
        await mypagecontroller.getMyChosenComment(
            mockRequest,
            mockResponse,
        );

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith(MychosenCommentErrorMessage);
    })

    test("작성된 댓글이 없을 경우 에러반환", async () => {
        const MycommentErrorResultSchema = [];
        mypagecontroller.MypageService.getMyChosenComment = jest.fn(() => {
            return MycommentErrorResultSchema
        })
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });

        // Error가 발생합니다.
        await mypagecontroller.getMyChosenComment(
            mockRequest,
            mockResponse,
        );

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "작성된 댓글이 없습니다." });

    })
})