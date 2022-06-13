const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/blog.controller')

router.route('/create').post(controller.create)
router.route('/edit').put(controller.edit)
router.route('/delete/:blogId').delete(controller.delete)
router.route('/get/:blogId').get(controller.get)
router.route('/list').get(controller.list)

module.exports = router