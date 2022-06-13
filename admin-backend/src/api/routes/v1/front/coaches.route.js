const express = require("express");
const router = express.Router();
const controller = require("../../../controllers/front/coaches.controller");
const { cpUpload, cpUploadProfile } = require("../../../utils/upload");
const multer = require("multer");
const uploadsDir = "./src/uploads/";
const imagesDir = `${uploadsDir}images`;
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, imagesDir);
  },
  filename(req, file, cb) {
    const fileExtension = file.mimetype.split("/")[1];
    cb(null, `1${Date.now()}.${fileExtension}`);
  },
});
const upload = multer({ storage, dest: imagesDir });

router.route("/list").get(controller.list);
router.route("/create").post(controller.create);
router.route("/get/:coachId").get(controller.get);
router.route("/get-count").get(controller.getCount);
router.route("/delete/:coachId").delete(controller.delete);
router.route("/edit").put(cpUploadProfile, controller.edit);
router.route("/uploadImage/:coachId").post(upload.single("avatar"), controller.uploadImage);
router.route("/getImage").get(controller.getImage);

module.exports = router;
