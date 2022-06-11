const ObjectId = require("mongoose").Types.ObjectId;
const User = require("../../models/users.model");
const MemberShip = require("../../models/membership.model");
const CoachSchedule = require("../../models/coachSchedule.model")
const  UsersMemberships = require("../../models/usersmemberships.model")
const { userDefaultImage } = require("../../../config/vars");
const fs = require("fs");
const { addImage } = require("../../utils/upload");
const validateCreateUser = require("../../../validation/creatUser");
const mongoose = require('mongoose');

// Api to create a new user
exports.create = async (req, res, next) =>  {
  try {
    User.findOne({ email: req.body.email }).then(async (coach) => {
      const { errors, isValid } = validateCreateUser(req.body);
      // Check validation
      if (!isValid) {
      return res.send({
        success: false,
        message: "Please Fill all Required fields correctly",
        coach,
      });
    }
      if (coach && coach.type === 3) {
        return res.send({
          success: false,
          message: "email is already exist",
          coach,
        });
      } 
      let payload = req.body
      if (req.files && req.files.profileImage) {
          const image = req.files.profileImage[0]
          // const imgData = fs.readFileSync(image.path)
          // payload.profileImage = await addImage(imgData)
          payload.profileImage = `/${image.filename}`
      }
      const newCoach = new User(payload)
      const savedCoach = await newCoach.save()
      let membershipId = payload.membershipId;
      let membershipTable = await MemberShip.findOne({ _id: membershipId });
      let responseObject = { ...savedCoach._doc };
      responseObject.membershipData = {
        title: membershipTable.title,
        _id: membershipTable._id,
      };
      // const user = await newUser.save();
      return res.send({
        success: true,
        message: "Coach is Added successfully",
        savedCoach : responseObject
      });
    
    })
  } catch(errors){
    if (errors.code === 11000 || errors.code === 11001)
      checkDuplicate(errors, res, "User");
    else return next(errors);
  }
}
  
exports.list = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    const filters = {type:3};
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
    const coaches = await User.aggregate([
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
          address: 1,
          createdAt: 1,
          status: 1,
          description: 1,
          emailVerified: 1,
          facebookLink: 1,
          twitterLink: 1,
          gPlusLink: 1,
          vineLink: 1,
          membershipId: 1,
          profileImage: 1, //{ $ifNull: ['$profileImage', userDefaultImage] }
          membershipData: {
            _id: 1,
            title: 1,
          },
        },
      },
    ]);
    return res.send({
      success: true,
      message: "Coaches fetched successfully",
      data: {
        coaches,
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
    const { coachId } = req.params;
    if (coachId) {
      const coach = await User.deleteOne({ _id: coachId });
      if (coach && coach.deletedCount)
        return res.send({
          success: true,
          message: "Coach is deleted successfully",
          coachId,
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "Coach not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Coach Id is required" });
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
    console.log(payload)
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
      const coach = await User.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(newPayload._id), type: 3 },
        { $set: newPayload },
        { new: true }
      )
      let responseObject = { ...coach._doc };
      responseObject.membershipData = {
        title: "",
        _id: "",
      };
      return res.send({
        success: true,
        message: "coach updated successfully",
        coach:responseObject,
      });
    } 
    else if( payload.membershipId !== "" && payload.membershipId != undefined ){
      let id = payload._id;
      var membershipId = payload.membershipId;
      let userTable = await User.findOne({ _id: id});
      let oldmembershipId = userTable.membershipId;
      const coach = await User.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(payload._id), type: 3 },
        { $set: payload },
        { new: true }
      );
      if (oldmembershipId != membershipId) {
        let membershipData = await MemberShip.findOne({_id:membershipId});
        const newPayload ={};
        let type = 3;
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
      let responseObject = { ...coach._doc };
      responseObject.membershipData = {
        title: membershipTable.title,
        _id: membershipTable._id,
      };
      return res.send({
        success: true,
        message: "coach updated successfully",
        coach: responseObject,
      });
    }
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Coach");
    else return next(error);
  }
};

exports.createCoachSchedular = async (req, res, next) =>  {
  try {
        let payload = req.body
        let coachId = payload.coachId
        var size = Object.keys(payload.selections).length;
        if( size == 0 ){
          return res
          .status(400)
          .send({
            success: false,
            message: " please select slot to Add.",
          });
        } else {
          let userTable = await User.findOne({ _id: coachId });
          if(userTable){
            const { id, type, status, address,email, password, username , profileImage} = userTable;
            let newPayload = {};
            // newPayload.selections = Object.assign({}, payload.selections) ;
            newPayload.selections =  payload.selections;
            newPayload.id = id;
            newPayload.type = type
            newPayload.status = status;
            newPayload.address = address;
            newPayload.email = email;
            newPayload.password = password;
            newPayload.username = username;
            newPayload.profileImage = profileImage;
            const coachSchedular = await User.findByIdAndUpdate( 
              { _id: payload.coachId },
              { $set: newPayload },
              { new: true }
            );
            return res.send({
              success: true,
              message: "Session  is created successfully",
              coachSchedules: coachSchedular
            });
          } else {
            return res
            .status(400)
            .send({
              success: false,
              message: "coachId is not found.",
            });
          }
        }
  } catch(errors){
    if (errors.code === 11000 || errors.code === 11001)
      checkDuplicate(errors, res, "User");
    else return next(errors);
  }
}
  
exports.getCoachSchedular = async (req, res, next) => {
    try {
        const { coachId } = req.params

        const filters = {type:3, _id:coachId};

        let { page, limit } = req.query;
        page = page !== undefined && page !== "" ? parseInt(page) : 1;
        limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;
    
        const total = await User.countDocuments(filters);
        if (coachId) {
            const coachSchedules = await User.findOne({ _id: mongoose.Types.ObjectId(coachId) }, { __v: 0, createdAt: 0, updatedAt: 0 },).lean(true)
            if (coachSchedules) 
              return res.send({ success: true, message: 'coachSchedules retrieved successfully', coachSchedules })
            else return res.status(400).send({ success: false, message: 'coachSchedules not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'coachSchedules Id is required' })
    } catch (error) {
        return next(error)
    }
}

exports.editCoachSchedular = async (req, res, next) =>  {
  try {
        let payload = req.body
        let coachId = payload.coachId
        var size = Object.keys(payload.selections).length;
        if( size == 0 ){
          return res
          .status(400)
          .send({
            success: false,
            message: "OOps! please select slot to Add.",
          });
        } else {
          let userTable = await User.findOne({ _id: coachId });
          if(userTable){
            const { id, type, status, address,email, password, username , profileImage} = userTable;
            let newPayload = {};
            // newPayload.selections = Object.assign({}, payload.selections) ;
            newPayload.selections =  payload.selections;
            newPayload.id = id;
            newPayload.type = type
            newPayload.status = status;
            newPayload.address = address;
            newPayload.email = email;
            newPayload.password = password;
            newPayload.username = username;
            newPayload.profileImage = profileImage;
            const coachSchedular = await User.findByIdAndUpdate( 
              { _id: payload.coachId },
              { $set: newPayload },
              { new: true }
            );
            return res.send({
              success: true,
              message: "Session  is created successfully",
              coachSchedules: coachSchedular
            });
          } else {
            return res
            .status(400)
            .send({
              success: false,
              message: "OOps! sorry coachId is not found.",
            });
          }
        }
  } catch(errors){
    if (errors.code === 11000 || errors.code === 11001)
      checkDuplicate(errors, res, "User");
    else return next(errors);
  }
}


  