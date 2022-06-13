const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/settings.controller')
const { cpUploadLogo } = require('../../../utils/upload')

router.route('/edit').put(controller.edit)
// router.route('/delete/:settingsId').delete(controller.delete)
router.route('/get').get(controller.get)
// router.route('/list').get(controller.list)

module.exports = router