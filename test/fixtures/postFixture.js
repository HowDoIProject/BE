exports.PostResultSchema = [[
    {
        "post_id": 1,
        "user_id": 2,
        "nickname": "test12345",
        "user_type": "강아지",
        "ischosen": true,
        "title": "test",
        "content": "test",
        "category": "자취끼니",
        "image": "test",
        "like_num": 3,
        "like_check": true,
        "scrap_num": 4,
        "scrap_check": false,
        "created_at": "2023-07-22T00:54:21.000Z",
        "updated_at": "2023-07-22T00:54:21.000Z"
    }],
    [{
        "comment_id": 2,
        "user_id": 1,
        "nickname": "test1004",
        "user_type": "강아지",
        "comment": "test",
        "image": "test",
        "chosen": null,
        "category": "생활비",
        "like_num": 2,
        "like_check": false,
        "created_at": "2023-07-22T01:01:50.000Z",
        "updated_at": "2023-07-22T01:01:50.000Z"
    }],
]


exports.ChosenCommentResultSchema = [
    {
        "comment_id": 1,
        "user_id": 2,
        "user_type": "강아지",
        "post_id": 1,
        "comment": "test",
        "image": "",
        "chosen": 1,
        "category": "자취끼니",
        "title": "test",
        "like_num": 1,
        "scrap_num": 0,
        "comment_num": 2,
        "created_at": "2023-07-21T11:22:02.000Z",
        "updated_at": "2023-07-21T11:22:02.000Z"
    },
    {
        "comment_id": 2,
        "user_id": 2,
        "user_type": "강아지",
        "post_id": 2,
        "comment": "test",
        "image": "",
        "chosen": 1,
        "category": "자취끼니",
        "title": "test",
        "like_num": 0,
        "scrap_num": 0,
        "comment_num": 1,
        "created_at": "2023-07-21T10:06:44.000Z",
        "updated_at": "2023-07-21T10:06:44.000Z"
    }
]

exports.MyChosenCommentResultSchema = [
    {
        "comment_id": 1,
        "user_id": 2,
        "post_id": 1,
        "comment": "test",
        "image": "",
        "chosen": 1,
        "category": "자취끼니",
        "created_at": "2023-07-21T11:22:02.000Z",
        "updated_at": "2023-07-21T11:22:02.000Z"
    },
    {
        "comment_id": 2,
        "user_id": 2,
        "post_id": 2,
        "comment": "test",
        "image": "",
        "chosen": 1,
        "category": "자취끼니",
        "created_at": "2023-07-21T10:06:44.000Z",
        "updated_at": "2023-07-21T10:06:44.000Z"
    }
]

exports.userIdInsertSchema = {
    user_id: { user_id: 2 }
}