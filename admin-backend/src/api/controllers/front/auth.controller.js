const jwt = require("jsonwebtoken");
const passport = require("passport");
//const baseURL = "http://localhost:3000/";
const baseURL = "https://healthiwealthi.arhamsoft.org/";

const { response } = require("express");
const User = require("../../models/users.model");
const { SendEmail } = require("../../utils/email_Send");
const { OAuth2Client } = require("google-auth-library");
const localStrategy = require("passport-local").Strategy;
const { frontUrl, pwEncruptionKey } = require("../../../config/vars");
const {
  accountVerificationEmailTemplate,
  resetPasswordEmailTemplate,
} = require("./emailTemplate/emailTemplate");

const Googleclient = new OAuth2Client(
  "420050673949-7b8fg8pjjlhnuqa32k6l2dl424k22res.apps.googleusercontent.com"
);
const saltRounds = 10;

/**
 * Register user
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    let { username, type, email, password, accociatedCoach } = req.body;

    if (username && email && password && type) {
      email = email.toLowerCase();

      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(200)
          .send({ status: false, message: "User already exists" });
      }

      let payload = {
        username,
        type,
        email,
        password,
        accociatedCoach,
      };
      console.log("payload", payload);

      user = await User.create(payload);

      var accessToken = await user.token();
      user = user.transform();
      let data = {
        ...user,
        accessToken,
      };

      // __ __  Through Email Varification  __ __ //

      sendAccountVerificationEmail(data);

      return res.status(200).send({
        status: true,
        message: "User registered successfully",
        data: data,
      });
    } else
      return res
        .status(200)
        .send({ status: false, message: "Required fields are missing" });
  } catch (error) {
    next(error);
  }
};

/**
 * Returns jwt token if valid address and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    let { email, password, type, accociatedCoach } = req.body;

    email = email.toLowerCase();
    const accociatedCoachId = await User.findOneAndUpdate(
      { email },
      { accociatedCoach }
    ).lean();
    const user = await User.findOne({ email }).lean();

    if (!user)
      return res
        .status(200)
        .send({ success: false, message: "Incorrect email or password" });

    passport.use(
      new localStrategy(
        { usernameField: "email" },
        (username, password, done) => {
          User.findOne(
            { email: username },
            "name email phone type address roleId isEmailVerified image password",
            (err, user) => {
              if (err) return done(err);
              else if (!user)
                // unregistered email
                return done(null, false, {
                  success: false,
                  message: "Incorrect email or password",
                });
              else if (!user.verifyPassword(password))
                // wrong password
                return done(null, false, {
                  success: false,
                  message: "Incorrect email or password",
                });
              else return done(null, user);
            }
          );
          // .populate({ path: "roleId", select: 'title' })
        }
      )
    );

    // call for passport authentication
    passport.authenticate("local", async (err, user, info) => {
      if (err)
        return res.status(400).send({
          err,
          success: false,
          message: "Oops! Something went wrong while authenticating",
        });
      // registered user
      else if (user) {
        if (!user.isEmailVerified)
          return res.status(200).send({
            success: false,
            message: "Your account is inactive, kindly Check your email",
            user,
          });
        else {
          var accessToken = await user.token();
          let data = {
            ...user._doc,
            accessToken,
          };
          await User.updateOne(
            { _id: user._id },
            { $set: { accessToken } },
            { upsert: true }
          );
          return res.status(200).send({
            success: true,
            message: "Logged in successfully",
            data,
          });
        }
      }
      // unknown user or wrong password
      else
        return res
          .status(402)
          .send({ success: false, message: "Incorrect email or password" });
    })(req, res);
  } catch (error) {
    return next(error);
  }
};
/**
 * Redirect to the Varify page with valid Message
 * @public
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    let userId = "";
    await jwt.verify(token, pwEncruptionKey, async (err, authorizedData) => {
      if (err) {
        flag = false;
        const message = "session_expired_front_error";
        return res.send({ success: false, userDisabled: true, message, err });
      } else {
        userId = authorizedData.sub;
      }
    });

    if (userId) {
      const userObj = await User.findOne({ _id: userId }).exec();
      if (userObj && userObj.isEmailVerified === false) {
        const user = await User.updateOne(
          { _id: userId },
          { $set: { isEmailVerified: true } }
        ).exec();
        if (!user) {
          return res.redirect(
            `${baseURL}email-verified?message="Invalid token specified"`
          );
        }

        return res.redirect(`${baseURL}email-verified`);
      }

      return res.redirect(
        `${baseURL}email-verified?message="Email Already Verified!"`
      );
    }

    return res.redirect(
      `${baseURL}email-verified?message="Invalid token specified"`
    );
  } catch (e) {
    return res.redirect(
      `${baseURL}email-verified?message="Invalid token specified"`
    );
  }
};
/**
 * Return JSON response with email
 * @public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(200).json({
        success: false,
        message: "Email is required to reset password!",
      });
    }

    const userWithEmail = await User.findOne({
      email: email.toLowerCase(),
    }).exec();
    if (!userWithEmail) {
      return res.status(200).json({
        success: false,
        message: `Sorry, the address ${email} is not known to Healthi Wealthi.`,
      });
    }

    var accessToken = await userWithEmail.token();
    let data = {
      ...userWithEmail._doc,
      accessToken,
    };

    sendPasswordResetEmail(data);

    // Let the uer know about the email sent
    return res.status(200).json({
      success: true,
      message: `Instructions for resetting your password have been sent to ${email} !`,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
/**
 * Reset Password
 * @public
 */
exports.setPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    let userId = "";

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }
    if (!confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please confirm password required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }
    if (password.length < 6 || password.length > 15) {
      return res.status(400).json({
        success: false,
        message:
          "Password can not be less than 6 and greater and 15 characters",
      });
    }

    await jwt.verify(token, pwEncruptionKey, async (err, authorizedData) => {
      if (err) {
        flag = false;
        const message = "session_expired_front_error";
        return res.send({ success: false, userDisabled: true, message, err });
      } else {
        userId = authorizedData.sub;
      }
    });

    if (userId) {
      const userObj = await User.findOne({ _id: userId }).exec();

      if (userObj) {
        if (userObj.verifyPassword(password)) {
          return res.status(200).send({
            success: false,
            message: "Your new password cannot be the same as old!",
          });
        }

        // Hash the new password and save it

        const hash = await userObj.getPasswordHash(password);

        try {
          const user = await User.updateOne(
            { _id: userId },
            { $set: { isEmailVerified: true, emailToken: "", password: hash } }
          ).exec();

          if (!user) {
            return res.status(200).json({
              success: false,
              message: "Change Password Link Expired!",
            });
          }

          return res
            .status(200)
            .json({ success: true, message: "Password Changed Successfully!" });
        } catch (err) {
          return res.status(400).send({
            success: false,
            message: err.message,
          });
        }
      } else {
        return res
          .status(200)
          .json({ success: false, message: "Change Password Link Expire !" });
      }
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Change Password Link Expire !" });
    }
  } catch (e) {
    return res
      .status(200)
      .json({ success: false, message: "Change Password Link Expire !" });
  }
};
/**
 * Change Password
 * @public
 */
exports.editPassword = async (req, res, next) => {
  try {
    let payload = req.body;
    let user = await User.find({ _id: payload._id });
    if (user[0].verifyPassword(payload.current)) {
      let newPayload = {
        password: await user[0].getPasswordHash(payload.new),
      };
      let updatedUser = await User.findByIdAndUpdate(
        { _id: payload._id },
        { $set: newPayload },
        { new: true }
      );
      return res.send({
        success: true,
        message: "Password updated successfully",
        updatedUser,
      });
    } else {
      return res.send({
        success: false,
        message: "Incorrent current password",
        user: user[0],
      });
    }
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "User");
    else return next(error);
  }
};

/**
 * Helper function to sent Varification Email
 * @param {*} userObj
 */
function sendAccountVerificationEmail(userObj) {
  const token = userObj.accessToken;
  const subject = "Please verify your account";
  const to = userObj.email;
  const url = `${frontUrl}auth/verify-email/${token}`;
  const emailBody = accountVerificationEmailTemplate.replace("{{url}}", url);
  SendEmail(to, subject, emailBody);
}

/**
 * Helper function to sent Password Reset Email
 * @param {*} userObj
 */
function sendPasswordResetEmail(userObj) {
  const { _id, email, accessToken } = userObj;
  const subject = "Forget Password!";
  const to = email;
  const url = `${baseURL}reset-password/${accessToken}`;
  const emailBody = resetPasswordEmailTemplate.replace("{{url}}", url);
  SendEmail(to, subject, emailBody);
}

exports.googleLogin = async (req, res) => {
  const { tokenId, googleAccessToken, code } = req.body;

  console.log(req.body);
  Googleclient.verifyIdToken({
    idToken: tokenId,
    audience:
      "420050673949-lvo0f0vntvpc14gahpgq3l8mbtus7k19.apps.googleusercontent.com",
  }).then((response) => {
    const { email_verified, name, email } = response.payload;
    if (email_verified)
      User.findOne({ email }).exec((err, user) => {
        if (err) {
          return res.status(400).json({
            error: "Something went wrong",
          });
        } else {
          if (user) {
            var accessToken = user.token();
            const { _id, name, email, type, googleAccessToken } = user;
            res.json({
              accessToken,
              user: { _id, name, email, type, googleAccessToken },
            });
          } else {
            let password = email + name;
            let username = name;
            let isEmailVerified = true;
            let newUser = new User({
              username,
              email,
              password,
              isEmailVerified,
              googleAccessToken,
            });
            newUser.save((err, data) => {
              if (err) {
                return res.status(400).json({
                  error: "Something went wrong",
                });
              }
              var accessToken = data.token();
              const { _id, username, email, type, googleAccessToken } = newUser;
              res.json({
                accessToken,
                user: { _id, username, email, type, googleAccessToken },
              });
            });
          }
        }
      });
  });
};

// Select Role for Google Login User
exports.role = async (req, res, next) => {
  try {
    let payload = req.body;
    const coach = await User.findByIdAndUpdate(
      { _id: payload._id },
      { $set: payload },
      { new: true }
    );

    if (!coach) {
      return res.send({
        success: true,
        message: "No record found!",
      });
    }
    return res.send({
      success: true,
      message: "Registered Successfully",
      coach,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Coach");
    else return next(error);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const googleAccessToken = req.body;
    console.log(req.body);
    var user = await User.findOne(googleAccessToken);
    console.log(user)

    var accessToken = user.token()
    if (!user) {
      return res.send({
        success: false,
        message: "No record found!",
      });
    }
    return res.send({
      success: true,
      message: " Successfully",
      user,
      accessToken
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Coach");
    else return next(error);
  }
};
