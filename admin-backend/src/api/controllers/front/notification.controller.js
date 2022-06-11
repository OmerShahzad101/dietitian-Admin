
const ObjectId = require("mongoose").Types.ObjectId;
const Notification = require("../../models/notification.model.js");

//API to create notification
/**
*@param { to, from, content, isRead, type } req 
* @param {200} res 
* @param {Error} next 
* @returns new notification data
*/

exports.create = async (req, res, next) => {
  try {
    const { to, from, content, isRead, type } = req.body;

    if (!to || !from) {
      return res
        .status(200)
        .send({ success: false, message: "user not found" });
    }

    if (!content) {
    return res
        .status(200)
        .send({ success: false, message: "content not found" });
    }
    if (!isRead) {
    return res
        .status(200)
        .send({ success: false, message: "isRead not found" });
    }
    if (!type) {
    return res
        .status(200)
        .send({ success: false, message: "type not found" });
    }

    let payload = {
      to,
      from,
      content,
      type,
      isRead,
    };
    const notificationData = await Notification.create(payload);
    return res
      .status(200)
      .send({ success: true, message: "Notification created", data: notificationData });
  } catch (error) {
    return next(error);
  }
};

//API to update notification to open
/**
*@param { isRead } req 
* @param {200} res 
* @param {Error} next 
* @returns notification updated data
*/
exports.update = async (req, res, next) => {
    try {

    const filter = req.params.id;
    const update = { isRead: true };

    const updatedNotification = await Notification.findOneAndUpdate(filter, update, {
        new: true
    });
    if(!updatedNotification){
        return res
        .status(404)
        .send({ success: true, message: "Notification not found" });
    }
    return res
    .status(200)
    .send({ success: true, message: "Notification is read", data: updatedNotification });
    } catch (error) {
      return next(error);
    }
  };

//API to retrieve all notification
/**
* @param {to, from, content, type} req 
* @param {200} res 
* @param {Error} next 
* @returns all notifications data
*/

exports.list = async (req, res, next) => {
try {
    let { page, limit } = req.query;
    const { to, from, content, type } = req.query;
    const filters = {};

    if(to)
      filters.to = ObjectId(to);
    if(from && from !=='')
      filters.from = ObjectId(from);
    if(content && content !='')
      filters.content = content
    if(type && type !==0)
      filters.type = parseInt(type);
      
    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    const total = await  Notification.countDocuments(filters);

    const notificationData = await Notification.aggregate([
    { $match: filters },
    { $lookup:{
      from: "users",
      localField: "to",
      foreignField: "_id",
      as: "to_info"
      }
    },
    { $lookup:{
      from: "users",
      localField: "from",
      foreignField: "_id",
      as: "from_info"
      }
    },
    { $sort: { createdAt: -1 } },
    { $skip: limit * (page - 1) },
    { $limit: limit },
    ]);

    return res.send({
    success: true,
    message: "notifications are fetched successfully",
    data: {
      notificationData,
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

//API to update notification to open
/**
*@param { isRead } req 
* @param {200} res 
* @param {Error} next 
* @returns notification updated data
*/
exports.update = async (req, res, next) => {
  try {
    
  const filter = req.params.id;
  const update = { isRead: true };

  const updatedNotification = await Notification.findOneAndUpdate(filter, update, {
      new: true
  });
  if(!updatedNotification){
      return res
      .status(404)
      .send({ success: true, message: "Notification not found" });
  }
  return res
  .status(200)
  .send({ success: true, message: "Notification is read", data: updatedNotification });
  } catch (error) {
    return next(error);
  }
};

//API to retrieve all notification
/**
* @param {notification_id} req 
* @param {200} res 
* @param {Error} next 
* @returns deleted notification data
*/

exports.delete = async (req, res, next) => {
try {
const filter = req.params.id;
const deletedData = await Notification.findOneAndDelete({_id : filter})
  if(!deletedData){
  return res.send({
    success: true,
    message: "notification not found",
  })
}
return res.send({
  success: true,
  message: "notification is deleted successfully",
  data: deletedData
  })
} catch (error) {
  return next(error);
}
};