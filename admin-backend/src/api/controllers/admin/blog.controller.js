const mongoose = require("mongoose");
const { checkDuplicate } = require("../../../config/errors");
const Blog = require("../../models/blog.model");


exports.create = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.file) {
      const images = req.file.filename;
      payload.image = `/${images}`;
    }
    
    console.log(payload.image)
    const newBlog = new Blog(payload);
    const blog = await newBlog.save();
    return res.send({
      success: true,
      message: "Created successfully",
      blog,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Blog");
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

    const total = await Blog.countDocuments(filters);

    const blog = await Blog.aggregate([
      { $match: filters },
      { $sort: { createdAt: -1 } },
      { $skip: limit * (page - 1) },
      { $limit: limit },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categorylist",
        },
      },
    ]);
    return res.send({
      success: true,
      message: "Blog are fetched successfully",
      data: {
        blog,
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
    const { blogId } = req.params;
    if (blogId) {
      const blog = await Blog.findOne(
        { _id: mongoose.Types.ObjectId(blogId) },
        { __v: 0, createdAt: 0, updatedAt: 0 }
      ).lean(true);

      if (blog)
        return res.json({
          success: true,
          message: "blog retrieved successfully",
          blog,
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "blog not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "blog Id is required" });
  } catch (error) {
    return next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.file) {
      const images = req.file.filename;
      payload.image = `/${images}`;
    }

    const blog = await Blog.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(payload._id) },
      { $set: payload },
      { new: true }
    );
    return res.send({
      success: true,
      message: "Updated successfully",
      blog,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "blog");
    else return next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    if (blogId) {
      const blog = await Blog.deleteOne({ _id: blogId });
      if (blog && blog.deletedCount)
        return res.send({
          success: true,
          message: "Deleted successfully",
          blogId,
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "blog not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "blog Id is required" });
  } catch (error) {
    return next(error);
  }
};
