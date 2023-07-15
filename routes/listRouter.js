const express = require("express");
const router = express.Router();
const ListController = require("../controllers/listController")
const listController = new ListController();

router.get("/list/:filter/:category/:page", listController.getList);

module.exports = router;
