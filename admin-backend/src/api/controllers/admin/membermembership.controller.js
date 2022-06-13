const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require('mongoose');
const MemberShip = require('../../models/membership.model');
const UsersMemberships = require('../../models/usersmemberships.model');
const User = require("../../models/users.model");
exports.create = async (req, res, next) => {
  try {
    let payload = req.body;
    let type = 1;
    payload.type = type;
    payload.period = payload.period *30;
    if (req.body.title)
      title= { $regex: new RegExp(req.body.title), $options: "si" };
    let payloadMembership = await MemberShip.findOne({ title });
    if (payloadMembership) {
    return res
      .status(400)
      .send({
        success: false,
        message: "Title already exists.",
      });
    }
    const memberMemberships = new MemberShip(payload);
    await memberMemberships.save();
    return res.send({
      success: true,
      message: "Memberships created successfully!",
      memberMemberships,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "memberMemberships");
    else return next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    const filters = { type:1};

    if (req.query.title)
      filters.title = { $regex: new RegExp(req.query.title), $options: "si" };
    if (req.query.statusValue == '1') 
      filters.status = true;
    if (req.query.statusValue == '0') 
      filters.status = false;  

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    const total = await MemberShip.countDocuments(filters);
    const membershipList = await MemberShip.aggregate([
      { $match: filters },
      { $sort: { createdAt: -1 } },
      { $skip: limit * (page - 1) },
      { $limit: limit },
    ]);
    return res.send({
      success: true,
      message: `Member Memberships fetched successfully`,
      data: {
        membershipList,
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
      checkDuplicate(error, res, "membershipList");
    else return next(error);
  }
};
exports.get = async (req, res, next) => {
  try {
    const { membershipId } = req.params;
    if (membershipId) {
      const Usermembership = await MemberShip.findOne(
        { _id: mongoose.Types.ObjectId(membershipId) },
        { __v: 0, createdAt: 0, updatedAt: 0 }
      ).lean(true);

      if (Usermembership){
        Usermembership.period = Usermembership.period/30;
        return res.json({
          success: true,
          message: "Member Membership retrieved successfully",
          Usermembership,
        });
      }
      else
        return res
          .status(400)
          .send({
            success: false,
            message: "Member Membership not found for given Id",
          });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Member Membership Id is required" });
  } catch (error) {
    return next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    payload.period = payload.period *30;
    const membership = await MemberShip.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(payload._id) },
      { $set: payload },
      { new: true }
    );
    return res.send({
      success: true,
      message: "Member Membership updated successfully",
      membership,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "membership");
    else return next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const {membershipId} = req.params;
    if(membershipId){
        const membership = await MemberShip.deleteOne({ _id: membershipId })
        if(membership.deletedCount) 
            return res.send({ success: true, message: 'Member Membership deleted successfully', membershipId });
        else return res.status(400).send({ success: false, message: 'Member Membership not found for given Id' })
    } else 
        return res.status(400).send({ success: false, message: 'Member Membership Id is required' })

  } catch(error){
      if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, 'membership')
  else
      return next(error)

  }
}

exports.usermemberships =async (req, res, next) => {
  try {
    let {page, limit } = req.query;
    const filters = {type:1};
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
    const usermembershipList = await UsersMemberships.aggregate([

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
      success: true, message: `Member Memberships Data fetched successfully`,
      data: {
        usermembershipList,
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

exports.getusermemberships = async (req, res, next) => {
  try {
    const { usermembershipId } = req.params
    if (usermembershipId) {
      const usermembership = await UsersMemberships.findOne({ _id: mongoose.Types.ObjectId(usermembershipId) }, { __v: 0, createdAt: 0, updatedAt: 0 }).lean(true)
      const userId = usermembership.userId;
      const userData =  await User.findOne({ _id: mongoose.Types.ObjectId(userId) }, { __v: 0, createdAt: 0, updatedAt: 0 }).lean(true) 
      usermembership.userData = userData; 
      if (usermembership)
        return res.json({ success: true, message: 'Member Memberships Data retrieved successfully', usermembership})
      else return res.status(400).send({ success: false, message: 'Member Memberships Data not found for given Id' })
    } else
        return res.status(400).send({ success: false, message: 'Member Memberships Data Id is required' })
  } catch (error) {
      return next(error)
  }
}

exports.editusermembership =  async (req, res, next) => {
  try {
      let payload = req.body;
      const query = { userId: payload.userId, status: true };
      const updatingUsermembershipStatus= await UsersMemberships.findOneAndUpdate(query, { $set: { status: false }}, )
      const usermembership = await UsersMemberships.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(payload._id) }, { $set: payload }, { new: true })
      return res.send({ success: true, message: 'Member Memberships Data updated successfully', usermembership })
  } catch (error) {
      if (error.code === 11000 || error.code === 11001)
        checkDuplicate(error, res, 'UsersMemberships')
      else
        return next(error)
  }
}
