const express = require("express");
const postsRouter = require("./postsRouter");
const commentsRouter = require("./commentsRouter");
const authRouter = require("./authRouter");

const router = express();

router.use("/api", [postsRouter, commentsRouter, authRouter]);

module.exports = router;
