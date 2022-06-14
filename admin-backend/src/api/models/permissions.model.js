const mongoose = require('mongoose');
/**
 * Permissions Schema
 * @private
 */
const PermissionsSechema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        dashboardView: {
            type:Boolean, 
            default:false
        },
        staffCreate : {
            type:Boolean, 
            default:false
        },
        staffView : {
            type:Boolean, 
            default:false
        },
        staffEdit : {
            type:Boolean, 
            default:false
        },
        staffDelete : {
            type:Boolean, 
            default:false
        },
        userCreate : {
            type:Boolean, 
            default:false
        },
        userView : {
            type:Boolean, 
            default:false
        },
        userEdit : {
            type:Boolean, 
            default:false
        },
        userDelete : {
            type:Boolean, 
            default:false
        },
        coachingCreate: {
            type:Boolean, 
            default:false
        },
        coachingView: {
            type:Boolean, 
            default:false
        },
        coachingEdit: {
            type:Boolean, 
            default:false
        },
        coachingDelete: {
            type:Boolean, 
            default:false
        },
        coachMemberShipCreate : {
            type:Boolean, 
            default: false
        },
        coachMemberShipView : {
            type:Boolean, 
            default: false
        },
        coachMemberShipEdit : {
            type:Boolean, 
            default: false
        },
        coachMemberShipDelete : {
            type:Boolean, 
            default: false
        },
        userMemberShipCreate : {
            type:Boolean, 
            default: false
        },
        userMemberShipView : {
            type:Boolean, 
            default: false
        },
        userMemberShipEdit : {
            type:Boolean, 
            default: false
        },
        userMemberShipDelete : {
            type:Boolean, 
            default: false
        },
        userMembershipRecordCreate : {
            type:Boolean, 
            default: false
        },
        userMembershipRecordView : {
            type:Boolean, 
            default: false
        },
        userMembershipRecordEdit : {
            type:Boolean, 
            default: false
        },
        coachMembershipRecordCreate : {
            type:Boolean, 
            default: false
        },
        coachMembershipRecordEdit : {
            type:Boolean, 
            default: false
        },
        coachMembershipRecordView : {
            type:Boolean, 
            default: false
        },
        blogCreate: {
            type:Boolean, 
            default:false
        },
        blogView: {
            type:Boolean, 
            default:false
        },
        blogEdit: {
            type:Boolean, 
            default:false
        },
        blogDelete: {
            type:Boolean, 
            default:false
        },
        categoryCreate: {
            type:Boolean, 
            default:false
        },
        categoryView: {
            type:Boolean, 
            default:false
        },
        categoryEdit: {
            type:Boolean, 
            default:false
        },
        categoryDelete: {
            type:Boolean, 
            default:false
        },
        servicesCreate: {
            type:Boolean, 
            default:false
        },
        servicesView: {
            type:Boolean, 
            default:false
        },
        servicesEdit: {
            type:Boolean, 
            default:false
        },
        servicesDelete: {
            type:Boolean, 
            default:false
        },
        contentCreate: {
            type:Boolean, 
            default:false
        },
        contentView: {
            type:Boolean, 
            default:false
        },
        contentEdit: {
            type:Boolean, 
            default:false
        },
        contentDelete: {
            type:Boolean, 
            default:false
        },
        reviewView: {
            type:Boolean, 
            default:false
        },
        reviewEdit: {
            type:Boolean, 
            deafault:false
        },   
        reviewDelete: {
            type:Boolean, 
            default:false
        },
        emailTemplateView: {
            type:Boolean, 
            default:false
        },
        emailTemplateEdit: {
            type:Boolean, 
            deafault:false
        },   
        emailTemplateDelete: {
            type:Boolean, 
            default:false
        },
        permissionsCreate: {
            type:Boolean, 
            default:false
        },
        permissionsView: {
            type:Boolean, 
            default:false
        },
        permissionsEdit: {
            type:Boolean, 
            default:false
        },
        permissionsDelete: {
            type:Boolean, 
            default:false
        },
        roleCreate: {
            type:Boolean, 
            default:false
        },
        roleView: {
            type:Boolean, 
            default:false
        },
        roleEdit: {
            type:Boolean, 
            default:false
        },
        roleDelete: {
            type:Boolean, 
            default:false
        },
        notificationsView: {
            type:Boolean, 
            default:false
        },
        paymentsView: {
            type:Boolean, 
            default:false
        },
        thirdPartyEdit: {
            type:Boolean, 
            default:false
        },
        contactUsQueriesView: {
            type:Boolean,
            default:false
        },
        settingsView: {
            type:Boolean,
            default:false
        },
        settingsEdit: {
            type:Boolean,
            default:false
        },
        status: { 
            type: Boolean, 
            default: true, 
            required: true 
        },
    },
    { timestamps: true }
)
/**
 * @typedef Permissions
 */

module.exports = mongoose.model('permissions', PermissionsSechema)