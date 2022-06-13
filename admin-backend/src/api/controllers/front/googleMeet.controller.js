const User = require("../../models/users.model");
const Meeting = require("../../utils/GoogleMeet/GoogleMeetAPI.js").meet;
exports.create = async (req, res, next) => {
  const { startTime, endTime, summary, googleRefreshToken } = req.body;
  console.log(req.body);
  const user = await User.findOne({ googleRefreshToken });
  if (!user) {
    res.send({
      status: false,
      message: "User not found",
    });
  }

  if (user.googleRefreshToken !== googleRefreshToken) {
    res.send({
      status: false,
      message: "Invalid User",
    });
  }

  Meeting({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: googleRefreshToken,
    startTime: startTime,
    endTime: endTime,
    summary: summary,
    // summary: "coach meeting",
    // time: time,
    checking: 0,
  })
    .then(function (result) {
      res.send(result);
    })
    .catch((error) => {
      console.log("error", error);
    });
};
