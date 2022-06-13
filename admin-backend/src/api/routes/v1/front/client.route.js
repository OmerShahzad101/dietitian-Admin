const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/front/clients.controller')
const { cpUpload, cpUploadProfile } = require('../../../utils/upload')


router.route('/list').get(controller.list)
router.route('/delete/:clientId').delete(controller.delete)
router.route('/get-count').get(controller.getCount);
router.route('/edit').put(cpUploadProfile, controller.edit)
router.route('/get/:clientId').get(controller.get)

module.exports = router