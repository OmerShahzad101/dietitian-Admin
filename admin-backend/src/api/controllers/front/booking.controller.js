const User = require("../../models/users.model");
const fs = require("fs");
const Booking = require("../../models/booking.model.js");

//API to booking coach
exports.create = async (req, res, next) => {
  try {
    const { coach, client, slots, bookingDate, meetingLink } = req.body;


    if (!coach) {
      return res
        .status(200)
        .send({ success: false, message: "Coach not found" });
    }

    if (!client) {
      return res
        .status(200)
        .send({ success: false, message: "Client not found" });
    }

    let payload = {
      coach,
      client,
      slots,
      bookingDate,
      meetingLink,
    };
    const BookingData = await Booking.create(payload);
    return res
      .status(200)
      .send({ success: true, message: "Appoinment Booked", BookingData });
  } catch (error) {
    return next(error);
  }
};

//API to get booking data
exports.get = async (req, res, next) => {
  try {
    const { coachId } = req.params;
    if (coachId) {
      const BookingData = await Booking.find({ coach: coachId })
        .populate("coach", "firstname lastname specialization fileName")
        .populate(
          "client",
          "firstname lastname email phone bloodgroup country city phone gender fileName "
        );

      if (BookingData)
        return res.json({
          success: true,
          message: "Coach booking details fetched successfully",
          BookingData,
        });
      else
        return res
          .status(200)
          .send({ success: false, message: "No booking found" });
    } else
      return res
        .status(200)
        .send({ success: false, message: "coach Id is required" });
  } catch (error) {
    return next(error);
  }
};

//API to get booking data for client
exports.getAppoinment = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    if (clientId) {
      const BookingData = await Booking.find({ client: clientId })
        .populate("coach", "firstname lastname specialization fileName")
        .populate(
          "client",
          "firstname lastname email phone bloodgroup country city phone gender fileName "
        );

      if (BookingData)
        return res.json({
          success: true,
          message: "Client booking details fetched successfully",
          BookingData,
        });
      else
        return res
          .status(200)
          .send({ success: false, message: "No booking found" });
    } else
      return res
        .status(200)
        .send({ success: false, message: "client Id is required" });
  } catch (error) {
    return next(error);
  }
};

//API to update Booking Status
exports.status = async (req, res, next) => {
  try {
    const { _id, bookingStatus } = req.body;
    if (!_id) {
      return res
        .status(404)
        .send({ success: false, message: "Bookiong Not Found" });
    }
    const filter = { _id };
    const update = { status: bookingStatus };
    const BookingData = await Booking.findOneAndUpdate(filter, update, {
      new: true,
    });
    if (BookingData) {
      return res.status(200).send({
        success: true,
        message: `Booking ${bookingStatus}`,
        BookingData,
      });
    }
  } catch (error) {
    return next(error);
  }
};
