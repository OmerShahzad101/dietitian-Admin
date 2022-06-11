const express = require("express");
const authRoutes = require("./auth.route");
const coachesRoutes = require("./coaches.route");
const clientsRoutes = require("./client.route");
const contactRoutes = require("./contact.route");
const bookingRoutes = require("./booking.route");
const coachSchedule = require("./coachSchedule.route");
const favouritesRoutes = require("./favourites.route");
const searchRoutes = require("./search.route");
const chatRoutes  = require("./chat.route")
const paymentRoutes = require("./payment.route")
const googleMeetRoute = require("./googleMeet.route")
const reviewoutes = require("./review.route")
const notificationRoutes =  require("./notification.route")

const router = express.Router();
/**
 * GET v1/status
 */
router.use("/auth", authRoutes);
router.use("/contact", contactRoutes);
router.use("/coach", coachesRoutes);
router.use("/client", clientsRoutes);
router.use("/booking", bookingRoutes);
router.use("/schedule", coachSchedule);
router.use("/favourites", favouritesRoutes);
router.use("/search", searchRoutes);
router.use("/chat", chatRoutes)
router.use("/payment", paymentRoutes)
router.use("/googleMeet", googleMeetRoute)
router.use("/review", reviewoutes)
router.use("/notification", notificationRoutes)

module.exports = router;
