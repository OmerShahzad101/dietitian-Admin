const ObjectId = require("mongoose").Types.ObjectId;
const { userDefaultImage } = require("../../../config/vars");
const fs = require("fs");
const { addImage } = require("../../utils/upload");
const validateCreateUser = require("../../../validation/creatUser");
const MemberShip = require("../../models/membership.model");
const User = require("../../models/users.model");
const  UsersMemberships = require("../../models/usersmemberships.model")
const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");


exports.create = async (req, res, next) => {
  try {
    User.findOne({ email: req.body.email }).then(async (user) => {
      const { errors, isValid } = validateCreateUser(req.body);
      // Check validation
      if (!isValid) {
        return res.send({
          success: false,
          message: "Please Fill all Required fields correctly",
          user,
        });
      }
      if (user && user.type === 1) {
        return res.send({
          success: false,
          message: "email is already exist",
          user,
        });
      } else {
        let payload = req.body;
        if (req.files && req.files.profileImage) {
          const image = req.files.profileImage[0];
          // const imgData = fs.readFileSync(image.path)
          // payload.profileImage = await addImage(imgData)
          payload.profileImage = `/${image.filename}`;
        }
        let { membershipId } = payload;
        let membershipTable = await MemberShip.findOne({ _id: membershipId });
        const newUser = new User(payload);
        const savedUser = await newUser.save();
        let responseObject = { ...savedUser._doc };
        responseObject.membershipData = {
          title: membershipTable.title,
          _id: membershipTable._id,
        };

        return res.send({
          success: true,
          message: "Admin user created successfully",
          savedUser: responseObject,
        });
      }
    });
  } catch (errors) {
    if (errors.code === 11000 || errors.code === 11001)
      checkDuplicate(errors, res, "User");
    else return next(errors);
  }
};

exports.list = async (req, res, next) => {
  try {
    let { page, limit } = req.query;

    const filters = { type: 1 };
    if (req.query.name)
      filters.username = { $regex: new RegExp(req.query.name), $options: "si" };
    if (req.query.email)
      filters.email = { $regex: new RegExp(req.query.email), $options: "si" };
    if (req.query.address) 
      filters.address = req.query.address;
    if (req.query.statusValue == '1') 
      filters.status = true;
    if (req.query.statusValue == '0') 
      filters.status = false;
    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    const total = await User.countDocuments(filters);

    // if (page > Math.ceil(total / limit) && total > 0)
    //   page = Math.ceil(total / limit);

    const users = await User.aggregate([
      { $match: filters },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "memberships",
          localField: "membershipId",
          foreignField: "_id",
          as: "membershipData",
        },
      },
      {
        $unwind: {
          path: "$membershipData",
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
          membershipId: 1,
          profileImage: 1,
          membershipData: {
            _id: 1,
            title: 1,
          },
        },
      },
    ]);
    return res.send({
      success: true,
      message: "Members are fetched successfully",
      data: {
        users,
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

exports.delete = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (userId) {
      const user = await User.deleteOne({ _id: userId });
      if (user && user.deletedCount)
        return res.send({
          success: true,
          message: "Member is  deleted successfully",
          userId,
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "Member not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Member Id is required" });
  } catch (error) {
    return next(error);
  }
};

exports.getCount = async (req, res, next) => {
  try {
    const total = await User.countDocuments({});
    return res.send({ success: true, total });
  } catch (error) {
    return next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.files && req.files.profileImage) {
      const image = req.files.profileImage[0]
      // const imgData = fs.readFileSync(image.path)
      // payload.profileImage = await addImage(imgData)
      payload.profileImage = `/${image.filename}`
    } 
    if ( payload.membershipId == "" || payload.membershipId == undefined ){
      let newPayload = {};
      newPayload._id = payload._id;
      newPayload.username = payload.username;
      newPayload.email   = payload.email;
      newPayload.phone = payload.phone;
      newPayload.address = payload.address;
      newPayload.status = payload.status;
      newPayload.profileImage = payload.profileImage;
      const user = await User.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(newPayload._id), type: 1 },
        { $set: newPayload },
        { new: true }
      )
      let responseObject = { ...user._doc };
      responseObject.membershipData = {
        title: "",
        _id: "",
      };
      return res.send({
        success: true,
        message: "User updated successfully",
        user:responseObject,
      });
    } 
    else if( payload.membershipId !== "" && payload.membershipId != undefined ){
      let id = payload._id;
      var membershipId = payload.membershipId;
      let userTable = await User.findOne({ _id: id});
      let oldmembershipId = userTable.membershipId;
      const user = await User.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(payload._id), type: 1 },
        { $set: payload },
        { new: true }
      );
      if (oldmembershipId != membershipId) {
        let membershipData = await MemberShip.findOne({_id:membershipId});
        const newPayload ={};
        let type = 1;
        newPayload.userId = payload._id;
        newPayload.type = type;
        const query = { userId: payload._id, status: true };
        const updatingUsermembershipStatus= await UsersMemberships.findOneAndUpdate(query, { $set: { status: false }}, )
        newPayload.membershipId = membershipId,
        newPayload.membershipData = membershipData
        const userMemberships = new UsersMemberships(newPayload);
        await userMemberships.save();
      }
      let membershipTable = await MemberShip.findOne({ _id: membershipId });
      let responseObject = { ...user._doc };
      responseObject.membershipData = {
        title: membershipTable.title,
        _id: membershipTable._id,
      };
      return res.send({
        success: true,
        message: "User updated successfully",
        user: responseObject,
      });
    }
  
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Member");
    else return next(error);
  }
};

