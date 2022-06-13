const express = require("express");
const controller = require("./../../../controllers/front/review.controller");
const router = express.Router();

router.route("/create").post(controller.create);
router.route("/get/:userId").get(controller.get);
router.route("/edit").put(controller.edit);

module.exports = router;
