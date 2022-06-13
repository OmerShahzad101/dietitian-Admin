const mongoose = require('mongoose');
/**
 * Membership Schema
 * @private
 */

 const MembershipSchema = new mongoose.Schema({

    title: { type: String },
    type: { type: Number, default: 0 }, // 1 = User, 3 = coaches
    description: { type: String },
    groupCoaching:{ type : Number },
    personalCoachChat:{ type : Number},
    microHabitLifestyle: { type : Number},
    rootCauseHealthCoaching: { type : Number },
    healthyWealthy: { type: Boolean, default: false},
    forCoach: { type: Boolean, default: false },
    onBoardTraining: { type: Boolean, default: false },
    businessPractise: { type: Boolean, default: false },
    healthMarketing:  { type: Boolean, default: false },
    personalPlatform: { type: Boolean, default: false },
    clientAccessList:  { type: Boolean, default: false },
    onePageDashboard: { type: Boolean, default: false },
    HipaaSocial:  { type: Boolean, default: false },
    hipaaGroupCoaching:{ type: Boolean, default: false },
    period : { type : Number },
    consultations :{type:Number},
    consultationExtentionCostUSD : { type:Number },
    consultationExtentionCostCrypto : { type:Number },
    personalPackage: { type: Boolean, default: false },
    familyPackage: { type: Boolean, default: false },
    teamsPackage: { type: Boolean, default: false },
    level:{type:Number},
    status: { type: Boolean, default: true, required: true },
    priceInUSD: { type: Number},
    sessionExtendPrice: { type: Number},
    priceInCrypto: { type: Number},
 }, { timestamps: true }
)
/**
 * @typedef Membership
 */

module.exports = mongoose.model('membership', MembershipSchema)