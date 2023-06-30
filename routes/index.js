const express = require("express");
const postsRouter = require("./postsRouter");
const mainRouter = require("./mainRouter");
const mypageRouter = require("./mypageRouter");
const commentsRouter = require("./commentsRouter");
const authRouter = require("./authRouter");
const listRouter = require("./listRouter");

const router = express();

router.use("/api", [
    postsRouter,
    mainRouter,
    mypageRouter,
    commentsRouter,
    authRouter,
    listRouter,
]);

module.exports = router;
