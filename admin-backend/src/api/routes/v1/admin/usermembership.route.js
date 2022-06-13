const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/membermembership.controller')

router.route('/list').get(controller.usermemberships)
router.route("/get/:usermembershipId").get(controller.getusermemberships);
router.route('/edit').put(controller.editusermembership)
module.exports = router