const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/permissions.controller')
const { cpUpload, cpUploadProfile } = require('../../../utils/upload')

router.route("/create").post(controller.create);
router.route("/edit").put(controller.edit);
router.route("/delete/:permId").delete(controller.delete);
router.route("/list").get(controller.list)
router.route('/get-count').get(controller.getCount);

module.exports = router
