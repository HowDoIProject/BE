const express = require("express");
const { Server } = require("http");
const routes = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser")

const app = express();
const http = Server(app);

app.use(
    cors({
        origin: "*",
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use(express.json({ limit : "50mb" }));
app.use(express.urlencoded({ limit:"50mb", extended: false }));

app.use("/", routes);

app.get("/", async (req, res) => {
    return res.sendFile(__dirname + "/index.html");
});

http.listen(3001, () => {
    console.log(3001, "번 포트에서 대기중");
});