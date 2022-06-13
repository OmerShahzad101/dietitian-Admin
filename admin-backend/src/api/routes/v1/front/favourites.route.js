const express = require("express");
const router = express.Router();
const controller = require("../../../controllers/front/favourites.controller");
router.route("/create").post(controller.create);
router.route("/get/:clientId").get(controller.get);
module.exports = router;
