const express = require("express");
const controller = require("../../../controllers/front/searchCoach.controller");
const router = express.Router();

router.route("/get").get(controller.get);

module.exports = router;
