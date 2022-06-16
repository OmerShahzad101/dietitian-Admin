const mongoose = require("mongoose");
const { checkDuplicate } = require("../../../config/errors");
const Category = require("../../models/category.model");

exports.create = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.file) {
      const images = req.file.filename;
      payload.image = `/${images}`;
    }
    const validate = await Category.findOne({title: payload.title}).lean();
    if (!validate) {
      const newCategory = new Category(payload);
      const category = await newCategory.save();
      return res.send({
        success: true,
        message: "Created successfully",
        category,
      });
    } else {
      return res.send({
        success: false,
        message: "Category name already exist",
      });
    }
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Category");
    else return next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    let { page, limit } = req.query;

    const filters = {};
    if (req.query.name)
      filters.name = { $regex: new RegExp(req.query.name), $options: "si" };
    if (req.query.statusValue == "1") filters.status = true;
    if (req.query.statusValue == "0") filters.status = false;

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    const total = await Category.countDocuments(filters);

    const category = await Category.aggregate([
      { $match: filters },
      { $sort: { createdAt: -1 } },
      { $skip: limit * (page - 1) },
      { $limit: limit },
    ]);
    return res.send({
      success: true,
      message: "Category are fetched successfully",
      data: {
        category,
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

exports.get = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    if (categoryId) {
      const category = await Category.findOne(
        { _id: mongoose.Types.ObjectId(categoryId) },
        { __v: 0, createdAt: 0, updatedAt: 0 }
      ).lean(true);

      if (category)
        return res.json({
          success: true,
          message: "Category retrieved successfully",
          category,
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "Category not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Category Id is required" });
  } catch (error) {
    return next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const filter = {}
    if(payload)
    if (req.file) {
      const images = req.file.filename;
      payload.image = `/${images}`;
    }
    // const validate = await Category.findOne({title: payload.title}).lean()
    // if (!validate) {
    const category = await Category.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(payload._id) },
      { $set: payload },
      { new: true }
    );
    return res.send({
      success: true,
      message: "Updated successfully",
      category,
    });
  // }
  // else{
  //   return res.send({
  //     success: false,
  //     message: "Category name already exist",
  //   });
  // }
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "category");
    else return next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    if (categoryId) {
      const category = await Category.deleteOne({ _id: categoryId });
      if (category && category.deletedCount)
        return res.send({
          success: true,
          message: "Deleted successfully",
          categoryId,
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "category not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "category Id is required" });
  } catch (error) {
    return next(error);
  }
};
