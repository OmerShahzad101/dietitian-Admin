const path = require('path');
// import .env variables
require('dotenv').config();
module.exports = {
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  encruptionKey: process.env.ENCRYPTION_KEY,
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  frontEncSecret: process.env.FRONT_ENC_SECRET,
  adminUrl: process.env.ADMIN_URL,
  emailAdd: process.env.EMAIL,
  url: process.env.URL,
  mongo: {
    uri: process.env.MONGO_URI,
  },
  pwEncruptionKey: process.env.PW_ENCRYPTION_KEY,
  pwdSaltRounds: process.env.PWD_SALT_ROUNDS,
  frontUrl:process.env.FRONT_URL,
  userDefaultImage: '/img/placeholder.png',

  googleClientID:process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleClientCalback: process.env.GOOGLE_CLIENT_CALLBACK,
};
