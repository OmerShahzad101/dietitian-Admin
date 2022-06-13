const User = require("../../models/users.model");
const Services = require("../../models/services.model")

/**
 * 
 * @param {name, gender, services, courses, page, limit} req 
 * @param {200} res 
 * @param {Error} next 
 * @returns coach searched data
 */
exports.get = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    const { city, country, name, gender, services, courses } = req.query;
    const payload = {};
    if(city && city.length>0)
      payload.city = city;
    if(country && country.length>0)
      payload.country = country;
    if(name && name !='')
      payload.firstname = name
    if(gender && gender.length>0)
      payload.gender = gender;
    if(courses && courses.length>0)
      payload.courses = courses;
    payload.type = 3;
    if(services && services.length > 0){
      const servicesArray = services.split(",")
      payload.services_id = { $all: servicesArray }
    }
    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;
    var searchedData
    const total = await  User.countDocuments(payload);
    if(payload.services){
    searchedData = await User.aggregate([
      { $match: payload },
      {
        $unwind: "$services_id",
          $unwind: {
              path: "$services_id",
              preserveNullAndEmptyArrays: true
          }
      },
      {$set: 
        {
          services_id: {$toObjectId: "$services_id"} 
        }
      },
      { $lookup:{
        from: "services",
        localField: "services_id",
        foreignField: "_id",
        as: "servicesInfo"
      }
    },
    { $sort: { createdAt: -1 } },
    { $skip: limit * (page - 1) },
    { $limit: limit },
    ]);
  } else {
    searchedData = await User.aggregate([
      { $match: payload },
      { $sort: { createdAt: -1 } },
      { $skip: limit * (page - 1) },
      { $limit: limit },
    ]);
  }
    return res
    .status(200)
    .send({ success: true, message: "Success", data: {
          searchedData,
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
