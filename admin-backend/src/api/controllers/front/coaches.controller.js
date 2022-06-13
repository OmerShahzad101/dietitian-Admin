const ObjectId = require("mongoose").Types.ObjectId;
const User = require("../../models/users.model");
const { userDefaultImage } = require("../../../config/vars");
const fs = require("fs");
const { addImage } = require("../../utils/upload");
const validateCreateUser = require("../../../validation/creatUser");
const Favourites = require("../../models/favourites.model");
const jwt = require("jwt-simple");

// Api to create a new coac
exports.create = async (req, res, next) => {
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
      let payload = req.body;
      if (req.files && req.files.profileImage) {
        const image = req.files.profileImage[0];
        // const imgData = fs.readFileSync(image.path)
        // payload.profileImage = await addImage(imgData)
        payload.profileImage = `/${image.filename}`;
      }
      const newCoach = new User(payload);
      const savedCoach = await newCoach.save();

      // const user = await newUser.save();
      return res.send({
        success: true,
        message: "Coach is Added successfully",
        newCoach: savedCoach,
      });
    });
  } catch (errors) {
    if (errors.code === 11000 || errors.code === 11001)
      checkDuplicate(errors, res, "User");
    else return next(errors);
  }
};
// API to get coaches list
exports.list = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    const clientId = req.user;
    const filters = { type: 3 };
    // if (req.query.name)filters.username = { $regex: new RegExp(req.query.name), $options: "si" };
    // if (req.query.email)filters.email = { $regex: new RegExp(req.query.email), $options: "si" };
    // if (req.query.firstname) filters.firstname = req.query.firstname;
    // if (req.query.address) filters.address = req.query.address;

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    const total = await User.countDocuments(filters);

    // if (page > Math.ceil(total / limit) && total > 0)
    //   page = Math.ceil(total / limit);

    const coaches = await User.aggregate([
      { $match: filters },
      { $sort: { createdAt: -1 } },
      { $skip: limit * (page - 1) },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          username: 1,
          firstname: 1,
          lastname: 1,
          country: 1,
          state: 1,
          city: 1,
          email: 1,
          address: 1,
          createdAt: 1,
          status: 1,
          about: 1,
          price: 1,
          emailVerified: 1,
          specialization: 1,
          facebookLink: 1,
          twitterLink: 1,
          gPlusLink: 1,
          vineLink: 1,
          fileName: 1,
          profileImage: 1, //{ $ifNull: ['$profileImage', userDefaultImage] }
        },
      },
    ]);
    var favCoaches = [];
    var nonFav = [];
    var CoachesData = {};
    var allCoaches = [];
    if (req.user) {
      const favouritesData = await Favourites.findOne({ clientId });
      if (favouritesData) {
        const favouriteCoach = favouritesData.clientFavourite;
        coaches.map(async (item, index) => {
          favouriteCoach.map(async (ite, idx) => {
            if (item._id.toString() === ite._id.toString()) {
              CoachesData = { ...item, isFavourite: true };
              favCoaches.push(CoachesData);
            } else {
              CoachesData = { ...item, isFavourite: false };
              nonFav.push(CoachesData);
            }
          });
        });
        allCoaches = [...favCoaches, ...nonFav];
      }
    }
    return res.send({
      success: true,
      message: "Coaches fetched Successfully",
      data: {
        coaches: allCoaches && allCoaches.length > 0 ? allCoaches : coaches,
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
// API to edit coach
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const services = req.body.services
    if (req.files && req.files.profileImage) {
      const image = req.files.profileImage[0];
      // const imgData = fs.readFileSync(image.path)
      // payload.profileImage = await addImage(imgData)
      payload.profileImage = `/${image.filename}`;
    }

    if(services && services.length >0){
      payload.services = JSON.parse(services)
      let servicesArray = JSON.parse(services).map(item => item.value);
      payload.services_id = servicesArray
    }

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
      message: "Profile Updated!",
      coach,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Coach");
    else return next(error);
  }
};

//API to get coach data
exports.get = async (req, res, next) => {
  try {
    const { coachId } = req.params;
    const clientId = req.user;
    if (coachId) {
      const coach = await User.findOne(
        { _id: coachId },
        { __v: 0, createdAt: 0, updatedAt: 0, password: 0 }
      ).lean(true);

      var fav = [];
      var coachData = {};
      var favCoach = {};
      if (req.user) {
        const favouritesData = await Favourites.findOne({ clientId });
        if (favouritesData) {
          const favouriteCoach = favouritesData.clientFavourite;
          favouriteCoach.map(async (ite, idx) => {
            if (coach._id.toString() === ite._id.toString()) {
              coachData = { ...coach, isFavourite: true };
              fav.push(coachData);
            } else {
              coachData = { ...coach, isFavourite: false };
              fav.push(coachData);
            }
          });

          favCoach = fav;
        }
      }
      if (coach)
        return res.json({
          success: true,
          message: "coach retrieved successfully",
          coach: favCoach[0] && favCoach.length > 0 ? favCoach[0] : coach,
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "coach not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "coach Id is required" });
  } catch (error) {
    return next(error);
  }
};

exports.uploadImage = async (req, res) => {
  try {
    let file = "";
    let fileName = "";
    let id = req.params.coachId;
    if (req.file) {
      fileName = req.file.filename;
    }

    if (fileName) {
      try {
        const doc = await User.updateOne(
          { _id: id },
          { fileName },
          { upsert: true }
        ).exec();
        if (!doc) {
          return res.status(400).send({
            success: false,
            message: "User Not Found!",
          });
        }
        return res.status(200).send({
          success: true,
          message: "image uploaded",
          file: fileName,
        });
      } catch (err) {
        return res.status(404).send({
          success: false,
          message: err.message,
        });
      }
    } else {
      return res
        .status(400)
        .send({ success: false, message: "No image was provided to upload!" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getImage = async (req, res, next) => {
  try {
    const userId = req.user;
    if (userId) {
      const user = await User.findOne({ _id: userId }, "fileName").lean(true);

      if (user)
        return res.json({
          success: true,
          message: "User retrieved successfully",
          user,
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "User not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Id is required" });
  } catch (error) {
    return next(error);
  }
};
