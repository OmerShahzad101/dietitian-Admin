const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/services.controller')
const { cpUploadLogo } = require('../../../utils/upload')


router.route('/create').post(cpUploadLogo, controller.create)
router.route('/edit').put(cpUploadLogo, controller.edit)
router.route('/delete/:serviceId').delete(controller.delete)
router.route('/get/:serviceId').get(controller.get)
router.route('/list').get(controller.list)

module.exports = router