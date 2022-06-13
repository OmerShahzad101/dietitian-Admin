const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require('mongoose');
const MemberShip = require('../../models/membership.model');
const UsersMemberships = require('../../models/usersmemberships.model');
const User = require("../../models/users.model");

exports.create = async (req, res, next) => {
  try {
    let payload = req.body;
    let type = 3;
    payload.type = type;
    payload.period = payload.period *30;
    if (req.body.title)
      title= { $regex: new RegExp(req.body.title), $options: "si" };
    let payloadCoachMembership = await MemberShip.findOne({ title });
    if (payloadCoachMembership) {
    return res
      .status(400)
      .send({
        success: false,
        message: "Title already exists.",
      });
    }
    
    const coachMemberships = new MemberShip(payload);
    await coachMemberships.save();
    return res.send({
      success: true,
      message: "Memberships created successfully!",
      coachMemberships,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "coachMemberships");
    else return next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    const filters = { type: 3 };

    if (req.query.title)
      filters.title = { $regex: new RegExp(req.query.title), $options: "si" };
    if (req.query.statusValue == '1') 
      filters.status = true;
    if (req.query.statusValue == '0') 
      filters.status = false;  

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    const total = await MemberShip.countDocuments(filters);
    const CoachMembershipList = await MemberShip.aggregate([
      { $match: filters },
      { $sort: { createdAt: -1 } },
      { $skip: limit * (page - 1) },
      { $limit: limit },
    ]);
    return res.send({
      success: true,
      message: `Coach Memberships fetched successfully`,
      data: {
        CoachMembershipList,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "CoachMembershipList");
    else return next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { coachMembershipId } = req.params;
    if (coachMembershipId) {
      const coachMembership = await MemberShip.findOne(
        { _id: mongoose.Types.ObjectId(coachMembershipId) },
        { __v: 0, createdAt: 0, updatedAt: 0 }
      ).lean(true);

      if (coachMembership){
        coachMembership.period = coachMembership.period/30;
        return res.json({
          success: true,
          message: "Coach Membership retrieved successfully",
          coachMembership,
        });
      }
      else
        return res
          .status(400)
          .send({
            success: false,
            message: "Coach Membership not found for given Id",
          });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Coach Membership Id is required" });
  } catch (error) {
    return next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    payload.period = payload.period *30;
    const coachMembership = await MemberShip.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(payload._id) },
      { $set: payload },
      { new: true }
    );
    return res.send({
      success: true,
      message: "Coach Membership updated successfully",
      coachMembership,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "coachMembership");
    else return next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const {coachMembershipId} = req.params;
    if(coachMembershipId){
        const coachMembership = await MemberShip.deleteOne({ _id: coachMembershipId })
        if(coachMembership.deletedCount) 
            return res.send({ success: true, message: 'Coach Membership deleted successfully', coachMembershipId });
        else return res.status(400).send({ success: false, message: 'Coach Membership not found for given Id' })
    } else 
        return res.status(400).send({ success: false, message: 'Coach Membership Id is required' })

  } catch(error){
      if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, 'coachMembership')
  else
      return next(error)

  }
}

exports.coachmemberships =async (req, res, next) => {
  try {
    let {page, limit } = req.query;
    const filters = {type : 3};
    if (req.query.userId) { 
      filters.userId = ObjectId(req.query.userId);
    }
    if (req.query.membershipId) {
      filters.membershipId = ObjectId(req.query.membershipId);
    }
    if (req.query.statusValue == '1') 
      filters.status = true;
    if (req.query.statusValue == '0') 
      filters.status = false;

    page = page !== undefined && page !== '' ? parseInt(page) : 1
    limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10;
    const total = await UsersMemberships.countDocuments(filters);
    const coachMembershipList = await UsersMemberships.aggregate([

      {$match : filters},
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $skip: limit * (page - 1) },
      { $limit: limit },
      {
        $project: {
          _id: 1, status:1,  createdAt: 1,membershipData:1,
          userData: {
            _id: 1,
            username: 1,
            email:1,
            phone:1,
          },
        }
      }
    ])
    return res.send({
      success: true, message: `Coach Memberships Data fetched successfully`,
      data: {
        coachMembershipList,
        pagination: {
          page, limit, total,
          pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
        }
      }
    })
  } catch(error){
      if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, 'membershipList')
  else
      return next(error)

  }
}

exports.getCoachmemberships = async (req, res, next) => {
  try {
    const { coachMembershipId } = req.params
    if (coachMembershipId) {
      const coachMembership = await UsersMemberships.findOne({ _id: mongoose.Types.ObjectId(coachMembershipId) }, { __v: 0, createdAt: 0, updatedAt: 0 }).lean(true)
      const userId = coachMembership.userId;
      const userData =  await User.findOne({ _id: mongoose.Types.ObjectId(userId) }, { __v: 0, createdAt: 0, updatedAt: 0 }).lean(true) 
      coachMembership.userData = userData; 
      if (coachMembership)
        return res.json({ success: true, message: 'Coach Memberships Data retrieved successfully', coachMembership})
      else return res.status(400).send({ success: false, message: 'Coach Memberships Data not found for given Id' })
    } else
        return res.status(400).send({ success: false, message: 'Coach Memberships Data Id is required' })
  } catch (error) {
      return next(error)
  }
}

exports.editCoachmembership =  async (req, res, next) => {
  try {
      let payload = req.body;
      const query = { userId: payload.userId, status: true };
      const updatingUsermembershipStatus= await UsersMemberships.findOneAndUpdate(query, { $set: { status: false }}, )
      const coachMembership = await UsersMemberships.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(payload._id) }, { $set: payload }, { new: true })
      return res.send({ success: true, message: 'Coach Memberships Data updated successfully', coachMembership })
  } catch (error) {
      if (error.code === 11000 || error.code === 11001)
        checkDuplicate(error, res, 'coachMembership')
      else
        return next(error)
  }
}
