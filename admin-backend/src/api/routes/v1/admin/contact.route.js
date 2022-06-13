const express = require('express');
const controller = require('../../../controllers/admin/contact.controller');
const router = express.Router();
const { cpUpload } = require('../../../utils/upload')

router.route('/list').get(controller.list);
router.route('/create').post(controller.create);
router.route('/edit').put(cpUpload, controller.edit);
router.route('/get-count').get(controller.getCount);

module.exports = router;