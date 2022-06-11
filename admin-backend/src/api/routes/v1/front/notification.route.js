const express = require("express");

const controller = require("../../../controllers/front/notification.controller");
const router = express.Router();

router.route("/list").get(controller.list);
router.route("/create").post(controller.create);
router.route("/update/:id").put(controller.update);
router.route("/delete/:id").delete(controller.delete);

module.exports = router;
