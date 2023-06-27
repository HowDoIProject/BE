const express = require("express");
const postsRouter = require("./postsRouter");
const mainRouter = require("./mainRouter");
const mypageRouter = require("./mypageRouter");
const commentsRouter = require("./commentsRouter");
const authRouter = require("./authRouter");

const router = express();

router.use("/api", [
    postsRouter,
    mainRouter,
    mypageRouter,
    commentsRouter,
    authRouter,
]);

module.exports = router;
