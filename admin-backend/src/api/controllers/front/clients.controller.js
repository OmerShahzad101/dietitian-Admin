const ObjectId = require("mongoose").Types.ObjectId;
const User = require("../../models/users.model");
const { userDefaultImage } = require("../../../config/vars");
const fs = require("fs");
const { addImage } = require("../../utils/upload");
const validateCreateUser = require("../../../validation/creatUser");
const Booking = require("../../models/booking.model.js");

// Api to create a new client
exports.create = async (req, res, next) => {
  try {
    User.findOne({ email: req.body.email }).then(async (client) => {
      const { errors, isValid } = validateCreateUser(req.body);
      // Check validation
      if (!isValid) {
        return res.send({
          success: false,
          message: "Please Fill all Required fields correctly",
          client,
        });
      }
      if (client && client.type === 1) {
        return res.send({
          success: false,
          message: "Email is already exist",
          client,
        });
      }
      let payload = req.body;
      if (req.files && req.files.profileImage) {
        const image = req.files.profileImage[0];
        // const imgData = fs.readFileSync(image.path)
        // payload.profileImage = await addImage(imgData)
        payload.profileImage = `/${image.filename}`;
      }
      const newClient = new User(payload);
      const savedClient = await newClient.save();

      // const user = await newUser.save();
      return res.send({
        success: true,
        message: "client is Added successfully",
        newClient: savedClient,
      });
    });
  } catch (errors) {
    if (errors.code === 11000 || errors.code === 11001)
      checkDuplicate(errors, res, "User");
    else return next(errors);
  }
};
// API to get client list
exports.list = async (req, res, next) => {
  try {
    let { page, limit } = req.query;

    const filters = { type: 3 };
    if (req.query.name)
      filters.username = { $regex: new RegExp(req.query.name), $options: "si" };
    if (req.query.email)
      filters.email = { $regex: new RegExp(req.query.email), $options: "si" };
    if (req.query.address) filters.address = req.query.address;

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    const total = await User.countDocuments(filters);

    // if (page > Math.ceil(total / limit) && total > 0)
    //   page = Math.ceil(total / limit);

    const clients = await User.aggregate([
      { $match: filters },
      { $sort: { createdAt: -1 } },
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
          profileImage: 1, //{ $ifNull: ['$profileImage', userDefaultImage] }
        },
      },
    ]);

    return res.send({
      success: true,
      message: "clients fetched successfully",
      data: {
        clients,
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
// API to delete user
exports.delete = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    if (clientId) {
      const client = await User.deleteOne({ _id: clientId });
      if (client && client.deletedCount)
        return res.send({
          success: true,
          message: "client is deleted successfully",
          clientId,
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "client not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "client Id is required" });
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
// API to edit client
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.files && req.files.profileImage) {
      const image = req.files.profileImage[0];
      payload.profileImage = `/${image.filename}`;
    }

    const client = await User.findByIdAndUpdate(
      { _id: payload._id },
      { $set: payload },
      { new: true }
    );

    if (!client) {
      return res.send({
        success: true,
        message: "No record found!",
      });
    }
    return res.send({
      success: true,
      message: "Profile Updated!",
      client,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "client");
    else return next(error);
  }
};
//API to get client data
exports.get = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    if (clientId) {
      const client = await User.findOne(
        { _id: clientId },
        { __v: 0, createdAt: 0, updatedAt: 0, password: 0 }
      ).lean(true).populate("accociatedCoach", "firstname lastname  ")


      if (client)
        return res.json({
          success: true,
          message: "client retrieved successfully",
          client,
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "client not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "client Id is required" });
  } catch (error) {
    return next(error);
  }
};

