const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/admin/membermembership.controller');

router.route("/create").post(controller.create);
router.route("/list").get(controller.list);
router.route("/edit").put(controller.edit);
router.route("/get/:membershipId").get(controller.get);
router.route("/delete/:membershipId").delete(controller.delete);

module.exports = router