const fs = require("fs");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Admin = require("../../models/users.model");
const Email = require("../../models/email.model");
const Permissions = require("../../models/permissions.model");
const { addImage } = require("../../utils/upload");
const { checkDuplicate } = require("../../../config/errors");
const { sendEmail } = require("../../utils/emails/emails");
const { adminUrl } = require("../../../config/vars");
const randomstring = require("randomstring");
const ObjectId = require("mongoose").Types.ObjectId;
const getHtml = require("./emailTemplate");
let templatePayload = getHtml();
const baseURL = "http://localhost:3000/";
const { SendEmail } = require("../../utils/email_Send");
const { resetPasswordEmailTemplate } = require("./emailTemplate/emailTemplate");

// API to login admin
exports.login = async (req, res, next) => {
  try {
    const filters = { type: 2 };
    let { email, password, type } = req.body;
    email = email.toLowerCase();
    const user = await Admin.findOne({ email }).lean();
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "Incorrect email or password" });
    passport.use(
      new localStrategy(
        { usernameField: "email" },
        (username, password, done) => {
          Admin.findOne(
            { email: username, type: 2 },
            "username email phone address roleId status image password permissionId",
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
          ).populate({ path: "permissionId" });
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
        if (!user.status)
          return res.status(403).send({
            success: false,
            message: "Your account is inactive, kindly contact admin",
            user,
          });
        else {
          var accessToken = await user.token();
          let data = {
            ...user._doc,
            accessToken,
          };
          await Admin.updateOne(
            { _id: user._id },
            { $set: { accessToken } },
            { upsert: true }
          );
          return res.status(200).send({
            success: true,
            message: "Admin logged in successfully",
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

// API to create admin
exports.create = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.files && req.files.profileImage) {
      const image = req.files.profileImage[0];
      // const imgData = fs.readFileSync(image.path)
      // payload.profileImage = await addImage(imgData)
      payload.profileImage = `/${image.filename}`;
    }
    let { email } = payload;
    let payloadAdmin = await Admin.findOne({ email });

    if (payloadAdmin) {
      return res.status(400).send({
        success: false,
        message: "A User with this email already exists.",
      });
    }
    let { permissionId } = payload;
    let permissionTable = await Permissions.findOne({ _id: permissionId });

    const admin = new Admin(payload);
    await admin.save();
    let responseObject = { ...admin._doc };
    responseObject.permissionData = {
      title: permissionTable.title,
      _id: permissionTable._id,
    };
    return res.send({
      success: true,
      message: "Admin user created successfully",
      admin: responseObject,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Admin");
    else return next(error);
  }
};

// API to edit admin
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.files && req.files.profileImage) {
      const image = req.files.profileImage[0];
      // const imgData = fs.readFileSync(image.path)
      // payload.profileImage = await addImage(imgData)
      payload.profileImage = `/${image.filename}`;
    }
    if (payload.permissionId == "" || payload.permissionId == undefined) {
      let newPayload = {};
      newPayload._id = payload._id;
      newPayload.username = payload.username;
      newPayload.email = payload.email;
      newPayload.phone = payload.phone;
      newPayload.address = payload.address;
      newPayload.status = payload.status;
      newPayload.profileImage = payload.profileImage;
      const admin = await Admin.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(newPayload._id), type: 2 },
        { $set: newPayload },
        { new: true }
      );
      let responseObject = { ...admin._doc };
      responseObject.permissionData = {
        title: "",
        _id: "",
      };
      return res.send({
        success: true,
        message: "Admin updated successfully",
        admin: responseObject,
      });
    } else if (
      payload.permissionId !== "" &&
      payload.permissionId != undefined
    ) {
      const admin = await Admin.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(payload._id), type: 2 },
        { $set: payload },
        { new: true }
      );
      let { permissionId } = payload;
      let permissionTable = await Permissions.findOne({ _id: permissionId });
      // console.log(`permissionId>>>`, permissionTable._id)
      let responseObject = { ...admin._doc };
      responseObject.permissionData = {
        title: permissionTable.title,
        _id: permissionTable._id,
      };
      return res.send({
        success: true,
        message: "Admin updated successfully",
        admin: responseObject,
      });
    }
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Admin");
    else return next(error);
  }
};

// API to delete admin
exports.delete = async (req, res, next) => {
  try {
    const { adminId } = req.params;
    if (adminId) {
      const admin = await Admin.deleteOne({ _id: adminId });
      if (admin.deletedCount)
        return res.send({
          success: true,
          message: "Admin deleted successfully",
          adminId,
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "Admin not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Admin Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get an admin
exports.get = async (req, res, next) => {
  try {
    const { adminId } = req.params;
    if (adminId) {
      const admin = await Admin.findOne(
        { _id: mongoose.Types.ObjectId(adminId) },
        { __v: 0, createdAt: 0, updatedAt: 0, password: 0 }
      ).lean(true);

      if (admin)
        return res.json({
          success: true,
          message: "Admin retrieved successfully",
          admin,
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "Admin not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Admin Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get admin list
exports.list = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    const filters = { type: 2 };
    if (req.query.name)
      filters.username = { $regex: new RegExp(req.query.name), $options: "si" };
    if (req.query.email)
      filters.email = { $regex: new RegExp(req.query.email), $options: "si" };
    if (req.query.address) filters.address = req.query.address;
    if (req.query.statusValue == "1") filters.status = true;
    if (req.query.statusValue == "0") filters.status = false;
    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    // const total = await Admin.countDocuments({})
    const totalAdmin = await Admin.aggregate([
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          phone: 1,
          address: 1,
          createdAt: 1,
          status: 1,
          type: 1,
          profileImage: 1,
        },
      },
      { $match: filters },
      { $count: "total" },
    ]);

    const admins = await Admin.aggregate([
      { $match: filters },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "permissions",
          localField: "permissionId",
          foreignField: "_id",
          as: "permissionData",
        },
      },
      {
        $unwind: {
          path: "$permissionData",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $skip: limit * (page - 1) },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          phone: 1,
          address: 1,
          createdAt: 1,
          status: 1,
          type: 1,
          permissionId: 1,
          profileImage: 1,
          permissionData: {
            _id: 1,
            title: 1,
            dashboardView: 1,
            staffCreate: 1,
            staffView: 1,
            staffEdit: 1,
            staffDelete: 1,
            userCreate: 1,
            userView: 1,
            userEdit: 1,
            userDelete: 1,
            coachingCreate: 1,
            coachingView: 1,
            coachingEdit: 1,
            coachingDelete: 1,
            coachMemberShipCreate: 1,
            coachMemberShipView: 1,
            coachMemberShipEdit: 1,
            coachMemberShipDelete: 1,
            userMemberShipCreate: 1,
            userMemberShipView: 1,
            userMemberShipEdit: 1,
            userMemberShipDelete: 1,
            userMembershipRecordCreate: 1,
            userMembershipRecordView: 1,
            userMembershipRecordEdit: 1,
            coachMembershipRecordCreate: 1,
            coachMembershipRecordView: 1,
            coachMembershipRecordEdit: 1,
            blogCreate: 1,
            blogView: 1,
            blogEdit: 1,
            blogDelete: 1,
            categoryCreate: 1,
            categoryView: 1,
            categoryEdit: 1,
            categoryDelete: 1,
            servicesCreate: 1,
            servicesView: 1,
            servicesEdit: 1,
            servicesDelete: 1,
            contentCreate: 1,
            contentView: 1,
            contentEdit: 1,
            contentDelete: 1,
            reviewView: 1,
            reviewEdit: 1,
            reviewDelete: 1,
            emailTemplateView: 1,
            emailTemplateEdit: 1,
            emailTemplateDelete: 1,
            roleCreate: 1,
            roleView: 1,
            roleEdit: 1,
            roleDelete: 1,
            notificationsView: 1,
            paymentsView: 1,
            thirdPartyEdit: 1,
            contactUsQueriesView: 1,
            status: 1,
          },
        },
      },
    ]);
    let total = totalAdmin[0] ? totalAdmin[0].total : "";
    return res.send({
      success: true,
      message: "Admins are fetched successfully",
      data: {
        admins,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

// API to edit admin password
exports.editPassword = async (req, res, next) => {
  try {
    let payload = req.body;
    let admin = await Admin.find({ _id: mongoose.Types.ObjectId(payload._id) });
    if (admin[0].verifyPassword(payload.current)) {
      let newPayload = {
        password: await admin[0].getPasswordHash(payload.new),
      };
      let updatedAdmin = await Admin.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(payload._id) },
        { $set: newPayload },
        { new: true }
      );
      return res.send({
        success: true,
        message: "Password updated successfully",
        updatedAdmin,
      });
    } else {
      return res.send({
        success: false,
        message: "Incorrent current password",
        admin: admin[0],
      });
    }
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Admin");
    else return next(error);
  }
};

exports.privateAdmin = async (req, res, next) => {
  try {
    let payload = req.body;
    let filter = 2;
    let findAdmin = await Admin.findOne({ type: filter });
    if (!findAdmin) {
      let permissinsObject = {
        title: "Private Admin permission",
        //dashboard
        dashboardView: true,
        //coach memebership management
        coachMemberShipCreate: true,
        coachMemberShipView: true,
        coachMemberShipEdit: true,
        coachMemberShipDelete: true,
        //user memebership management
        userMemberShipCreate: true,
        userMemberShipView: true,
        userMemberShipEdit: true,
        userMemberShipDelete: true,
        //usermembership record
        userMembershipRecordCreate: true,
        userMembershipRecordView: true,
        userMembershipRecordEdit: true,
        //usermembership record
        coachMembershipRecordCreate: true,
        coachMembershipRecordView: true,
        memberMembershipRecordEdit: true,
        //staff
        staffCreate: true,
        staffView: true,
        staffEdit: true,
        staffDelete: true,
        //usermanagement
        userCreate: true,
        userView: true,
        userEdit: true,
        userDelete: true,
        //coaching
        coachingCreate: true,
        coachingView: true,
        coachingEdit: true,
        coachingDelete: true,
        //blog
        blogCreate: true,
        blogView: true,
        blogEdit: true,
        blogDelete: true,
        //category
        categoryCreate: true,
        categoryView: true,
        categoryEdit: true,
        categoryDelete: true,
        //services
        servicesCreate: true,
        servicesView: true,
        servicesEdit: true,
        servicesDelete: true,
        //content
        contentCreate: true,
        contentView: true,
        contentEdit: true,
        contentDelete: true,
        //reviewmanagement
        reviewView: true,
        reviewEdit: true,
        reviewDelete: true,
        //emailTemplateManagement
        emailTemplateView: true,
        emailTemplateEdit: true,
        emailTemplateDelete: true,
        // permissions
        permissionsCreate: true,
        permissionsView: true,
        permissionsEdit: true,
        permissionsDelete: true,
        //role
        roleCreate: true,
        roleView: true,
        roleEdit: true,
        roleDelete: true,
        //notifications
        notificationsView: true,
        //payments
        paymentsView: true,
        //thirdparty
        thirdPartyEdit: true,
        //contactus
        contactUsQueriesView: true,
        //settings
        settingsView: true,
        settingsEdit: true,
        //
        status: true,
      };
      const newPermission = new Permissions(permissinsObject);
      const savedPermission = await newPermission.save();
      let permissionId = await savedPermission._id;
      if (permissionId) {
        payload.permissionId = permissionId;
        const admin = new Admin(payload);
        await admin.save();
        return res.send({
          success: true,
          message: "Admin user created successfully",
          admin,
        });
      } else {
        return res.send({
          success: false,
          message: "Permissions Id is required",
        });
      }
    } else {
      return res.send({
        success: false,
        message: "Could not create Admin, admin already exist!",
      });
    }
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Admin");
    else return next(error);
  }
};

// API to edit admin password
exports.forgotPassword = async (req, res, next) => {
  try {
    console.log("cjbdv");
    const { email } = req.body;
    console.log("email", email);
    if (!email) {
      return res.status(200).json({
        success: false,
        message: "Email is required to reset password!",
      });
    }

    const userWithEmail = await Admin.findOne({
      email: email.toLowerCase(),
    }).exec();
    if (!userWithEmail) {
      return res.status(200).json({
        success: false,
        message: `Sorry, the address ${email} is not known to Healthi Wealthi.`,
      });
    }

    // var accessToken = await userWithEmail.token();
    let data = {
      ...userWithEmail._doc,
      // accessToken,
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

//reset Pawssword
exports.resetPassword = async (req, res) => {
  try {
    const { newpass, _id } = req.body;
    if (_id) {
      const userObj = await Admin.findOne({ _id }).exec();
      if (userObj) {
        const hash = await userObj.getPasswordHash(newpass);
        try {
          const user = await Admin.updateOne(
            { _id },
            { $set: { isEmailVerified: true, emailToken: "", password: hash } }
          ).exec();
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
        return res.status(400).send({
          success: false,
          message: "id not found",
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: "not found",
      });
    }
  } catch (e) {
    return res
      .status(400)
      .json({ success: false, message: "something went wrong" });
  }
};
/**
 * Helper function to sent Password Reset Email
 * @param {*} userObj
 */
function sendPasswordResetEmail(userObj) {
  const { _id, email, accessToken } = userObj;
  const subject = "Forget Password!";
  const to = email;
  const url = `${baseURL}reset-password/${_id}`;
  const emailBody = resetPasswordEmailTemplate.replace("{{url}}", url);
  SendEmail(to, subject, emailBody);
}
