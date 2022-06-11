const mongoose = require("mongoose");
const { checkDuplicate } = require("../../../config/errors");
const Blog = require("../../models/blog.model");

// API to create blog
exports.create = async (req, res, next) => {
  try {
    let payload = req.body;
    console.log("req", payload);
    const blog = new Blog(payload);
    await blog.save();

    return res.send({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Blog");
    else return next(error);
  }
};

// API to edit blog
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    if (payload._id) {
      const blog = await Blog.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(payload._id) },{ $set: payload },{new: true });

      if (blog)
        return res.json({
          success: true,
          message: "Blog Update successfully",
          blog,
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "Blog not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Blog Id is required" });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Blog");
    else return next(error);
  }
}


// API to delete Blog
exports.delete = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    if (blogId) {
      const blog = await Blog.deleteOne({ _id: blogId });
      if (blog.deletedCount)
        return res.send({
          success: true,
          message: "Blog deleted successfully",
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "Blog not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Blog Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get an blog
exports.get = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    if (blogId) {
      const blog = await Blog.findOne({ _id: mongoose.Types.ObjectId(blogId) },{ __v: 0, createdAt: 0, updatedAt: 0 }).lean(true);

      if (blog)
        return res.json({
          success: true,
          message: "Blog retrieved successfully",
          blog,
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "Blog not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Blog Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get blog list
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

    // const total = await Blog.countDocuments({})

    const totalBlogs = await Blog.aggregate([
      {
        $project: {
          _id: 1,
          title: 1,
          image: 1,
          description: 1,
          email: 1,
          category: 1,
          createdAt: 1,
          status: 1,
        },
      },
      { $match: filters },
      { $count: "total" },
    ]);

    const blogList = await Blog.aggregate([
      { $match: filters },
      { $sort: { createdAt: -1 } },
      { $skip: limit * (page - 1) },
      {
        $project: {
          _id: 1,
          title: 1,
          image: 1,
          description: 1,
          email: 1,
          category: 1,
          createdAt: 1,
          status: 1,
        },
      },
      { $limit: limit },
    ]);

    let total = totalBlogs[0] ? totalBlogs[0].total : "";

    return res.send({
      success: true,
      message: `blog's fetched successfully`,
      data: {
        blogList,
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
