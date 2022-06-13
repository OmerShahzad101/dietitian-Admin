const express = require("express");

const controller = require("../../../controllers/front/auth.controller");
const router = express.Router();

router.route("/register").post(controller.register);
router.route("/login").post(controller.login);
router.route("/verify-email/:token").get(controller.verifyEmail);
router.route("/forgot-password").post(controller.forgotPassword);
router.route("/change-password/:token").post(controller.setPassword);
router.route("/update-password").put(controller.editPassword);

router.route("/googleLogin").post(controller.googleLogin);
router.route("/role").put(controller.role);
router.route("/verify").post(controller.verify);

/*Social Logins*/
//   app.use(passport.initialize());
//   app.use(passport.session());
//   require('../../../utils/socialLoginHelper')(passport);

//   app.get('/auth/google', passport.authenticate('google', { scope:
//       [
//         "profile",
//         "https://www.googleapis.com/auth/calendar"

//       ]
//     }),(req, res)=>{
//   });

module.exports = router;
