const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/blog.controller')
const { uploadSingle } = require('../../../utils/upload')


router.route('/create').post(uploadSingle, controller.create)
router.route('/edit').put(uploadSingle, controller.edit)
router.route('/delete/:blogId').delete(controller.delete)
router.route('/get/:blogId').get(controller.get)
router.route('/list').get(controller.list)

module.exports = router