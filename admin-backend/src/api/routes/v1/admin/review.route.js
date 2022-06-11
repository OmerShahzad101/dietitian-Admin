const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/admin/review.controller');

router.route('/list').get(controller.list);
router.route('/edit').put(controller.edit);
router.route('/delete/:reviewId').delete(controller.delete);

module.exports = router;