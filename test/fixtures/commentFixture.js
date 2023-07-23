exports.MycommentResultSchema = [
    {
        "comment_id": 1,
        "user_id": 2,
        "user_type": "강아지",
        "comment": "test",
        "image": "test",
        "chosen": null,
        "category": "자취끼니",
        "post_id": 1,
        "title": "test",
        "like_num": 3,
        "scrap_num": 2,
        "comment_num": 5,
        "created_at": "2023-07-22T01:05:27.000Z",
        "updated_at": "2023-07-22T01:05:27.000Z"
    },
    {
        "comment_id": 2,
        "user_id": 2,
        "user_type": "강아지",
        "comment": "test",
        "image": "test",
        "chosen": null,
        "category": "생활비",
        "post_id": 2,
        "title": "test",
        "like_num": 2,
        "scrap_num": 1,
        "comment_num": 1,
        "created_at": "2023-07-22T01:01:50.000Z",
        "updated_at": "2023-07-22T01:01:50.000Z"
    },
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

exports.postCommentInsertSchema = {
    post_id: 1,
    user_id: 2,
    comment: "test",
    image: "test img"
}

exports.checkCommentInsertSchema = {
    post_id: 1,
    comment_id: 2,
    user_id: 2,
}

exports.checkPostResultSchema = {
    post_id: 1,
    user_id: 3,
    title: 'test',
    content: 'test',
    image: 'test img',
    category: '자취끼니',
    scrap_num: 2,
    like_num: 3,
    comment_num: 2,
    created_at: "2023-07-19T14:51:49.000Z",
    updated_at: "2023-07-19T14:51:49.000Z"
}

exports.checkCommentResultSchema = {
    comment_id: 2,
    user_id: 2,
    post_id: 1,
    comment: 'test',
    image: 'test img',
    chosen: null,
    like_num: 3,
    created_at: "2023-07-21T00:00:13.000Z",
    updated_at: "2023-07-21T00:00:13.000Z"
}

exports.updateCommentInsertSchema = {
    comment : "update test comment",
    image: "test img",
    comment_id: 2
}

exports.ChooseCommentResultSchema = [{
    comment_id: 2,
    post_id: 1,
    user_id: 2,
    nickname: "test12345",
    comment: "test",
    image: "test image",
    chosen: null,
    created_at: "2023-07-21T00:00:13.000Z",
    updated_at: "2023-07-21T00:00:13.000Z"
}]
