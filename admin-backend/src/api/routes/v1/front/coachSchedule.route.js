const express = require("express");
const router = express.Router();

const controller = require("../../../controllers/front/coachSchedule.controller");

router.route("/set").post(controller.set);
router.route("/get/:userId").get(controller.get);

module.exports = router;
