const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/coaches.controller')
const { cpUpload, cpUploadProfile } = require('../../../utils/upload')

router.route("/create").post(controller.createCoachSchedular);
router.route('/get/:coachId').get(controller.getCoachSchedular)
router.route('/edit').put(controller.editCoachSchedular)

module.exports = router