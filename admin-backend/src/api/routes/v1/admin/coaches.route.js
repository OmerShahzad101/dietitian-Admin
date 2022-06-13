const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/coaches.controller')
const { cpUpload, cpUploadProfile } = require('../../../utils/upload')

router.route("/create").post(cpUploadProfile,controller.create);
router.route('/list').get(controller.list)
router.route('/delete/:coachId').delete(controller.delete)
router.route('/get-count').get(controller.getCount);
router.route('/edit').put(cpUploadProfile, controller.edit)

module.exports = router