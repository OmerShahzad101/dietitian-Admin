const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/coachmembership.controller')

router.route('/list').get(controller.coachmemberships)
router.route("/get/:coachMembershipId").get(controller.getCoachmemberships);
router.route('/edit').put(controller.editCoachmembership)
module.exports = router