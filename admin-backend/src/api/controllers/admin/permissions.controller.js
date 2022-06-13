const ObjectId = require("mongoose").Types.ObjectId;
const Permissions = require("../../models/permissions.model");

exports.create = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.body.title)
      title= { $regex: new RegExp(req.body.title), $options: "si" };
    let payloadPerm = await Permissions.findOne({ title });
    if (payloadPerm) {
      return res
        .status(400)
        .send({
          success: false,
          message: "Title already exists.",
        });
    }
    const permissions = new Permissions(payload);
    await permissions.save();
    return res.send({
      success: true,
      message: "Permissions are created successfully",
      permissions,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "permissions");
    else return next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    //   const { permId } = req.params;
    let payload = req.body;
    const permissions = await Permissions.findByIdAndUpdate(
      { _id: payload._id },
      { $set: payload },
      { new: true }
    );
    return res.send({
      success: true,
      message: "permissions is updated successfully",
      permissions,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "permissions");
    else return next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { permId } = req.params;
    if (permId) {
      const permission = await Permissions.deleteOne({ _id: permId });
      if (permission && permission.deletedCount)
        return res.send({
          success: true,
          message: "permission deleted successfully",
          permId,
        });
      else
        return res.status(400).send({
          success: false,
          message: "permission not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "permission Id is required" });
  } catch (error) {
    return next(error);
  }
};

exports.getCount = async (req, res, next) => {
  try {
    const total = await Permissions.countDocuments({});
    return res.send({ success: true, total });
  } catch (error) {
    return next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    const filters = {};
    if (req.query.title)
      filters.title = { $regex: new RegExp(req.query.title), $options: "si" };
    if (req.query.statusValue == '1') 
      filters.status = true;
    if (req.query.statusValue == '0') 
      filters.status = false;  

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    const total = await Permissions.countDocuments(filters);
    const permissions = await Permissions.aggregate([
      { $match: filters },
      { $sort: { createdAt: -1 } },
      { $skip: limit * (page - 1) },
      { $limit: limit },
    ]);
    return res.send({
      success: true,
      message: "Permissions are fetched successfully",
      data: {
        permissions,
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
