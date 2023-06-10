const express = require("express");
const { Server } = require("http");

const cors = require("cors");

const app = express();
const http = Server(app);

app.use(cors({
    origin: "*",
    methods: "GET, HEAD, POST, PUT, DELETE"
}));

app.use(express.json());

app.get('/', async(req, res) => {
    return res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
    console.log(3000, "번 포트에서 대기중");
});