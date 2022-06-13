const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/catagory.controller')

router.route('/create').post(controller.create)
router.route('/edit').put(controller.edit)
router.route('/delete/:cmsId').delete(controller.delete)
router.route('/get/:cmsId').get(controller.get)
router.route('/list').get(controller.list)

module.exports = router