const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const jwt = require("jwt-simple");
const {
  pwdSaltRounds,
  jwtExpirationInterval,
  pwEncruptionKey,
} = require("../../config/vars");

/**
 * User Schema
 * @private
 */
const UserSchema = new mongoose.Schema(
  {
    type: { type: Number, default: 1 }, // 1 = User, 2 = Admin, 3= coaches
    profileImage: { type: String },
    googleProfileId: {type: String},
    googleAccessToken: {type: String},
    googleRefreshToken: {type: String},
    name: { type: String },
    fileName: { type: String },
    bannerImage: { type: String },
    username: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    gender: { type: String },
    postalCode: { type: String },
    address: { type: String },
    email: { type: String },
    bloodgroup: { type: String },
    emailVerified: { type: Boolean },
    description: { type: String },
    about: { type: String },
    price: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    referralKey: { type: String },
    specialization: { type: String },
    facebookLink: { type: String },
    twitterLink: { type: String },
    gPlusLink: { type: String },
    vineLink: { type: String },
    signature: { type: String },
    phone: { type: String },
    roleId: { type: String },
    resetCode: { type: String },
    password: { type: String, required: true},
    awards: { type: Array, default: undefined },
    experience: { type: Array, default: undefined },
    qualifications: { type: Array, default: undefined },
    status: { type: Boolean,},
    isEmailVerified: { type: Boolean, default: false },
    accociatedCoach: {type: String ,  ref: "users" },
    selections: { type: Array },
    services: { type: Array },
    services_id: { type : Array },
    refferedBy: { type: mongoose.Schema.Types.ObjectId },
    permissionId: { type: mongoose.Schema.Types.ObjectId, ref: "permissions" },
    membershipId: { type: mongoose.Schema.Types.ObjectId, ref: "membership" },
  },
  { timestamps: true }
);

UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.getPasswordHash = async function (password) {
  const rounds = pwdSaltRounds ? parseInt(pwdSaltRounds) : 10;
  const hash = await bcrypt.hash(password, rounds);
  return hash;
};

/**
 * Methods
 */
UserSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "_id",
      "email",
      "address",
      "description",
      "qualifications",
      "permissionTitle",
      "permissionId",
      "facebookLink",
      "gPlusLink",
      "profileImage",
      "bannerImage",
      "twitterLink",
      "vineLink",
      "username",
      "referralKey",
      "fileName",
      "associatedCoach",
      "googleAccessToken"
    ];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },
  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, "minutes").unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(playload, pwEncruptionKey);
  },
  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});

UserSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();
    const rounds = pwdSaltRounds ? parseInt(pwdSaltRounds) : 10;
    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * @typedef User
 */

module.exports = mongoose.model("users", UserSchema);
