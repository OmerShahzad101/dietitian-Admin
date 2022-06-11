const User = require("../../models/users.model");
const Chat = require("../../models/chat.model");
const Conversation = require("../../models/conversation.model");

//API to create conversation
exports.create = async (req, res, next) => {
  try {
    const { senderId, recieverId } = req.body;
    if (!recieverId || !senderId) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }
    const conversationExists = await Conversation.findOne({
      $or: [
        { participants: [senderId, recieverId] },
        { participants: [recieverId, senderId] },
      ],
    }).lean(true);
    console.log("conversationExists" , conversationExists)
    if (!conversationExists) {
      console.log(conversationExists);
      let payload = { participants: [senderId, recieverId] };
      const conversationData = await Conversation.create(payload);

      if (conversationData) {
        return res.status(200).send({
          success: true,
          message: "conversation has created",
          conversationId: conversationData._id,
        });
      } else {
        return res
          .status(400)
          .send({ success: false, message: "conversation can't be created" });
      }
    } else {
      console.log(conversationExists._id);
      const chatData = await Chat.find({ conversationId: conversationExists._id }).lean(
        true
      );

      return res.status(200).send({
        success: true,
        message: "conversation already exists",
        chatMessages: chatData,
        conversationId: conversationExists._id,
      });
    }
  } catch (error) {
    return next(error);
  }
};

//API TO GET Messages
exports.get = async (req, res, next) => {
  try {
    const chatData = await Chat.find({}).lean(true);
    if (chatData)
      return res.status(200).send({
        success: true,
        message: "chat Found",
        chatData: chatData,
      });
    else {
      return res.status(200).send({ success: false, message: "No Data Found" });
    }
  } catch (error) {
    return next(error);
  }
};

//API TO create message
exports.sendMessage = async (req, res, next) => {
  try {
    const payload = req.body;
    console.log(payload);
    const chatData = await Chat.create(payload);
    if (chatData)
      return res.status(200).send({
        success: true,
        message: "chat Found",
        chatData: chatData,
      });
    else {
      return res.status(200).send({ success: false, message: "No Data Found" });
    }
  } catch (error) {
    return next(error);
  }
};

//API TO GET Messages USERS
exports.getUsers = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userData = await User.find({ _id: userId }).lean(true);
    if (!userData) {
      return res
        .status(404)
        .send({ success: false, message: "user not found" });
    }
    const chatData = await Chat.find({
      $or: [{ senderId: userId }, { recieverID: userId }],
    }).lean(true);
    if (chatData) {
      console.log(chatData);
      return res.status(200).send({
        success: true,
        message: "chat Found",
        chatData: chatData,
      });
    } else {
      return res.status(200).send({ success: false, message: "No Data Found" });
    }
  } catch (error) {
    return next(error);
  }
};

//API TO GET Messages USERS
exports.list = async (req, res, next) => {
  try {
    const UserId = req.user;
    console.log(UserId);
    const userData = await User.findOne({ _id: UserId });
    let userType = userData.type;
    if (userType === 1) {
      userType = 3;
    } else {
      userType = 1;
    }
    console.log(userType);
    const filters = { type: userType };
    const client = await User.aggregate([
      { $match: filters },
      {
        $project: {
          _id: 1,
          username: 1,
          firstname: 1,
          lastname: 1,
          country: 1,
          state: 1,
          city: 1,
          email: 1,
          address: 1,
          createdAt: 1,
          status: 1,
          about: 1,
          price: 1,
          emailVerified: 1,
          specialization: 1,
          fileName: 1,
          profileImage: 1,
        },
      },
    ]);
    // console.log("client",client);
    return res.send({
      success: true,
      message: "clients fetched Successfully",
      client,
    });
  } catch (error) {
    return next(error);
  }
};
