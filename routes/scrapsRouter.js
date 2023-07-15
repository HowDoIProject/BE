const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const ScrapsController = require("../controllers/scrapsController")
const scrapsController = new ScrapsController();

router.get("/scrap/:filter/:category/:page", auth, scrapsController.getScrap);

router.delete("/scrap/:filter/:category", auth, scrapsController.deleteScrap);

module.exports = router;
