const ObjectId = require("mongoose").Types.ObjectId;
const User = require("../../models/users.model");
const MemberShip = require('../../models/membership.model');
const Blog = require("../../models/blog.model");

exports.list = async (req, res, next) => {
    try {
      let { page, limit } = req.query;
      //admins
      const filters2 = {type:2};
      const totaladmin = await User.countDocuments(filters2);
      const date = new Date();
      const prior = new Date().setDate(date.getDate() - 30);
      const startDate =new Date(prior).toISOString(); //
      const EndDate = date.toISOString()
      ///members
      const filters1 = {type:1};
      const totalmember = await User.countDocuments(filters1);
      const membersGraph = await User.aggregate([
        { $match : filters1 },
        // { $sort: { createdAt: 1 } },
        {
          $match: { $and: [
            { "createdAt": { $gte: new Date (startDate) } },
            { "createdAt": { $lte: new Date (EndDate) } }
          ]},
        }, 
        {
          $group: {
            _id: { $dateToString: { "date": "$createdAt", "format": "%m-%d-%Y"}
            },
            Count: { $sum: 1,},
          }
        }, {$sort: { '_id' : 1 , "createdAt": -1} },
      ])

      //coaches
      const filters3 = {type:3};
      const totalcoach = await User.countDocuments(filters3);
      const coachesGraph = await User.aggregate([
        {$match : filters3},
        // { $sort: { createdAt: 1 } },
        {
          $match: { $and: [
            { "createdAt": { $gt: new Date (startDate) } },
            { "createdAt": { $lt: new Date (EndDate) } }
          ]},
        }, 
        { 
          $group: {
            _id: { $dateToString: { "date": "$createdAt", "format": "%m-%d-%Y"}
            },
            Count: { $sum: 1,},
          }
        }, {$sort: { '_id' : 1 , "createdAt": -1} },
      ])

      //coachMemberships
      const filters4 = {type : 3};
      const totalCoachMemberships = await MemberShip.countDocuments(filters4);
      const coachMembershipsGraph = await MemberShip.aggregate([
        {$match : filters4},
        // { $sort: { createdAt: 1 } },
        {
          $match: { $and: [
            { "createdAt": { $gt: new Date (startDate) } },
            { "createdAt": { $lt: new Date (EndDate) } }
          ]},
        }, 
        {
          $group: {
            _id: { $dateToString: { "date": "$createdAt", "format": "%m-%d-%Y"}
            },
            Count: { $sum: 1,},
          }
        },{$sort: { '_id' : 1 , "createdAt": -1} },
      ])

      
      //coachMemberships
      const filters5 = {type : 1};
      const totalMemberMemberships = await MemberShip.countDocuments(filters5);
      const memberMembershipsGraph = await MemberShip.aggregate([
        {$match : filters5},
        // { $sort: { createdAt: 1 } },
        {
          $match: { $and: [
            { "createdAt": { $gt: new Date (startDate) } },
            { "createdAt": { $lt: new Date (EndDate) } }
          ]},
        }, 
        {
          $group: {
            _id: { $dateToString: { "date": "$createdAt", "format": "%m-%d-%Y"}
            },
            Count: { $sum: 1,},
          }
        },{$sort: { '_id' : 1 , "createdAt": -1} },
      ])
      const totalBlogs = await Blog.countDocuments();

      const blogGraph = await Blog.aggregate([

        {
          $match: { $and: [
            { "createdAt": { $gt: new Date (startDate) } },
            { "createdAt": { $lt: new Date (EndDate) } }
          ]},
        }, 
        {
          $group: {
            _id: { $dateToString: { "date": "$createdAt", "format": "%m-%d-%Y"}
            },
            Count: { $sum: 1,},
          }
        },{$sort: { '_id' : 1 , "createdAt": -1} },
      ])

      return res.send({
        success: true,
        message: "dashboard data fetched successfully",
        data: {
          dashboardData: {
            totalBlogs,totalmember,totaladmin,totalcoach,totalCoachMemberships,totalMemberMemberships
          },membersGraph,coachesGraph,coachMembershipsGraph, memberMembershipsGraph,blogGraph
        },
      });
    } catch (error) {
      return next(error);
    }
};