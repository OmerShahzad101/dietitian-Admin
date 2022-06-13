const Review = require("../../models/review.model");
const User = require("../../models/users.model");

//API to create FAVOURITE list
exports.create = async (req, res, next) => {
  try {
    const { reviewBy, reviewTo, score, comment, title } = req.body;

    if (!(reviewBy && reviewTo && score && comment && title)) {
      return res
        .status(400)
        .send({ success: false, message: "Please Enter all required fields" });
    }
    payload = {
      reviewBy,
      reviewTo,
      score,
      comment,
      title,
    };
    const review = await Review.create(payload);
    if (!review) {
      return res
        .status(400)
        .send({ success: false, message: "Something Went wrong" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Thank you for your review" });
  } catch (error) {
    return next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (userId) {
      const userType = await User.findOne({ _id: userId }, "type");

      const filter = {};
      if (userType.type == 3) filter.reviewTo = userId;
      else if (userType.type == 1) filter.reviewBy = userId;

      const review = await Review.find(filter)
        .lean(true)
        .populate("reviewBy", "firstname lastname fileName");

      if (review)
        return res.json({
          success: true,
          message: "Review retrieved successfully",
          review,
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "Review not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Review Id is required" });
  } catch (error) {
    return next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { reviewBy, reviewTo, score, comment, title } = req.body;

    if (!(reviewBy && reviewTo && score && comment && title)) {
      return res
        .status(400)
        .send({ success: false, message: "Please Enter all required fields" });
    }
    const filter = { reviewBy };

    const update = {
      reviewBy,
      reviewTo,
      score,
      comment,
      title,
    };

    const review = await Review.findOneAndUpdate(filter, update, {
      upsert: true,
    });

    if (!review) {
      return res
        .status(400)
        .send({ success: false, message: "Something Went wrong" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Your Review Is updated" });
  } catch (error) {
    return next(error);
  }
};
