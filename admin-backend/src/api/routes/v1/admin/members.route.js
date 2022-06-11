const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/members.controller')
const { cpUpload, cpUploadProfile } = require('../../../utils/upload')

router.route("/create").post(cpUploadProfile,controller.create);
router.route('/list').get(controller.list)
router.route('/delete/:userId').delete(controller.delete)
router.route('/get-count').get(controller.getCount);
router.route('/edit').put(cpUploadProfile, controller.edit)
// router.route('/usermembs/gettttt').get(controller.get)

module.exports = router