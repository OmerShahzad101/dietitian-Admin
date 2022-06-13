const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/admin/coachmembership.controller');

router.route("/create").post(controller.create);
router.route("/list").get(controller.list);
router.route("/edit").put(controller.edit);
router.route("/get/:coachMembershipId").get(controller.get);
router.route("/delete/:coachMembershipId").delete(controller.delete);

module.exports = router