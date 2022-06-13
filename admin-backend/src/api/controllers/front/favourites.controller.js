const User = require("../../models/users.model");
const Favourites = require("../../models/favourites.model");


//API to create FAVOURITE list
exports.create = async (req, res, next) => {
  try {
    var count = 0;
    const { coachId, clientId } = req.body;
    if (!coachId || !clientId) {
      return res
        .status(400)
        .send({ success: false, message: "ID's not found" });
    }

    const clientData = await User.find({ _id: clientId });
    if (!clientData) {
      return res
        .status(400)
        .send({ success: false, message: "Client not found" });
    }

    const coachData = await User.find(
      { _id: coachId },
      "_id"
    ).lean(true);
    if (!coachData) {
      return res
        .status(400)
        .send({ success: false, message: "No coach FOund" });
    }

    const favouritesData = await Favourites.findOne({ clientId });
    if (favouritesData) {
      favouritesData.clientFavourite.forEach(async (element) => {
        if (element._id == coachId) {
          const array = favouritesData.clientFavourite.filter(
            (index) => index._id != coachId
          );
          count = count + 1;
          const Data = await Favourites.findOneAndUpdate(
            { clientId },
            { clientFavourite: array },
            { new: true }
          );
          return res.send({
            success: true,
            message: "Removed From Favourite",
            Data: Data,
          });
        }
      });
      if (count == 0) {
        const Data = await Favourites.findOneAndUpdate(
          { clientId },
          {
            clientFavourite: [...favouritesData.clientFavourite, ...coachData],
          },
          { new: true }
        );
        return res
          .status(200)
          .send({ success: true, message: "Added to Favourite", Data });
      }
    } else {
      let payload = { clientId, clientFavourite: coachData };
      const Favourite = await Favourites.create(payload);
      return res
        .status(200)
        .send({ success: true, message: "Added to Favourite", Favourite });
    }
  } catch (error) {
    return next(error);
  }
};

//API TO GET FAVOURITE SCHEULE
exports.get = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    if (!clientId) {
      return res
        .status(404)
        .send({ success: false, message: "Client not found" });
    }

    const favourites = await Favourites.findOne({ clientId: clientId }).lean(true);

    let userIds = [];
    favourites?.clientFavourite?.map(function(data, i){
      userIds.push(data._id);
    })

    const favouriteUsers = await User.find({
      '_id': { $in: userIds}
    }, { firstname: 1, lastname: 1, fileName: 1, address: 1, city:1, country: 1 });


    if (favouriteUsers)
      return res.status(200).send({
        success: true,
        message: "Data Found",
        favouriteCoaches:favouriteUsers,
      });
    else {
      return res.status(200).send({
        success: false,
        message: "No Data found",
      });
    }
  } catch (error) {
    return next(error);
  }
};
