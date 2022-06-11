const express = require("express");
const router = express.Router();
const controller = require("../../../controllers/front/booking.controller");

router.route("/create").post(controller.create);
router.route("/get/:coachId").get(controller.get);
router.route("/getAppoinment/:clientId").get(controller.getAppoinment);
router.route("/status").put(controller.status);

module.exports = router;
