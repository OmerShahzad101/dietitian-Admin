const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/admin.controller')
const { cpUpload, cpUploadProfile } = require('../../../utils/upload')

router.route('/login').post(controller.login)
router.route('/create').post(cpUploadProfile, controller.create)
router.route('/edit').put(cpUploadProfile, controller.edit)
router.route('/delete/:adminId').delete(controller.delete)
router.route('/get/:adminId').get(controller.get)
router.route('/list').get(controller.list)
router.route('/edit-password').put(cpUpload, controller.editPassword)
router.route('/forgot-password').post(controller.forgotPassword)
router.route('/reset-password').post(controller.resetPassword)
router.route('/private-admin').post(controller.privateAdmin)

module.exports = router