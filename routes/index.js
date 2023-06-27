const express = require("express");
const postsRouter = require("./postsRouter");
const mypageRouter = require("./mypageRouter");
const commentsRouter = require("./commentsRouter");
const authRouter = require("./authRouter");

const router = express();

router.use("/api", [postsRouter, mypageRouter, commentsRouter, authRouter]);

module.exports = router;
