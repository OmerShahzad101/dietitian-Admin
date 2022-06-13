const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/category.controller')
const { uploadSingle } = require('../../../utils/upload')


router.route('/create').post(uploadSingle, controller.create)
router.route('/edit').put(uploadSingle, controller.edit)
router.route('/delete/:categoryId').delete(controller.delete)
router.route('/get/:categoryId').get(controller.get)
router.route('/list').get(controller.list)

module.exports = router