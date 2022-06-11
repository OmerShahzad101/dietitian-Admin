const User = require("../../models/users.model");
const CoachSchedule = require("../../models/coachSchedule.model");

//API to set coach schedule
exports.set = async (req, res, next) => {
  try {
    // __ __ userId = coachId __ __ //
    const { userId, selections } = req.body;

    if (!userId) {
      return res
        .status(400)
        .send({ success: false, message: "Coach not found" });
    }

    if (!selections) {
      return res
        .status(400)
        .send({ success: false, message: "Select Valid timeslot." });
    }
    const filter = { _id: userId };
    const update = { selections: JSON.parse(selections) };

    let scheduleData = await User.findOneAndUpdate(filter, update, {
      new: true,
    });
    if (scheduleData)
      return res.status(200).send({
        success: true,
        message: "Schedule updated",
        scheduleData : scheduleData,
      });
    else {
      return res
        .status(403)
        .send({ success: false, message: "user not found" });
    }
  } catch (error) {
    return next(error);
  }
};

//API TO GET COACH SCHEULE
exports.get = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(404)
        .send({ success: false, message: "Coach not found" });
    }

    const scheduleData = await User.findOne({ _id: userId }).lean(true);
    if (scheduleData)
      return res.status(200).send({
        success: true,
        message: "Schedule Found",
        scheduleData: scheduleData,
      });
    else {
      return res.status(200).send({ success: true, message: "No Data Found" });
    }
  } catch (error) {
    return next(error);
  }
};
