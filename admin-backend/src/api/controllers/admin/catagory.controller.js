const mongoose = require("mongoose");
const { checkDuplicate } = require("../../../config/errors");
const Category = require("../../models/catagory.model");

// API to create Category
exports.create = async (req, res, next) => {
  try {
    let payload = req.body;
    const category = new Category(payload);
    await category.save();

    return res.send({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Category");
    else return next(error);
  }
};

// API to edit category
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;

    const category = await Category.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(payload._id) },
      { $set: payload },
      { new: true }
    );
    return res.send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Category");
    else return next(error);
  }
};

// API to delete category
exports.delete = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    if (categoryId) {
      const category = await Category.deleteOne({ _id: categoryId });
      if (category.deletedCount)
        return res.send({
          success: true,
          message: "Category deleted successfully",
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

// API to get an category
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

// API to get category
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

    // const total = await Category.countDocuments({})

    const totalCategory = await Category.aggregate([
      {
        $project: {
          _id: 1,
          email: 1,
          title: 1,
          createdAt: 1,
        },
      },
      { $match: filters },
      { $count: "total" },
    ]);

    const categoryList = await Category.aggregate([
      { $match: filters },
      { $sort: { createdAt: -1 } },
      { $skip: limit * (page - 1) },
      {
        $project: {
          _id: 1,
          email: 1,
          title: 1,
          createdAt: 1,
        },
      },
      { $limit: limit },
    ]);

    let total = totalCategory[0] ? totalCategory[0].total : "";

    return res.send({
      success: true,
      message: `Category's fetched successfully`,
      data: {
        categoryList,
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
