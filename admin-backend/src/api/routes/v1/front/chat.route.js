const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/front/chat.controller')


router.route('/get').get(controller.get)
router.route('/create').post(controller.create)
router.route('/list').get(controller.list)
router.route('/sendMessage').post(controller.sendMessage)

module.exports = router