import { combineReducers } from 'redux'
import adminReducer from '../views/Admin/Admin.reducer'
import dashboardReducer from '../views/Dashboard/Dashboard.reducer'
import errorReducer from './shared/error/error.reducer'
import emailReducer from '../views/EmailTemplates/EmailTemplates.reducer'
import memberReducer from '../views/Members/Members.reducer'
import cmsReducer from '../views/CMS/Cms.reducer'
import membershipReducer from 'views/Memberships/Memberships.reducer'
import contactUsQueryReducer from 'views/ContactUsQueries/ContactUsQueries.reducer'
import permissionsReducer from 'views/Permissions/Permissions.reducer'
import coachesReducer from 'views/Coaches/Coaches.reducer'
import UserMembershipsResucer from 'views/UsersMemberships/UsersMembership.reducer'
import CoachSchedularReducer from 'views/Schedular/CoachSchedular.reducer'
import servicesReducer from 'views/Services/Services.reducer'
import reviewReducer from '../views/Review/Review.reducer'
import coachMembershipReducer from '../views/CoachMemberships/CoachMembership.reducer'
import CoachMembershipRecordReducer from 'views/CoachMembershipRecord/CoachMembershipRecord.reducer'
import SettingsReducer from 'views/Settings/Settings.reducer'
import PrivateAdminReducer from 'views/PrivateAdmin/PrivateAdmin.reducer'

export default combineReducers({
    admin: adminReducer,
    dashboard: dashboardReducer,
    user: memberReducer,
    error: errorReducer,
    cms: cmsReducer,
    review: reviewReducer,
    memberships:membershipReducer,
    email: emailReducer,
    contactUsQueries: contactUsQueryReducer,
    permissions:permissionsReducer,
    coaches:coachesReducer,
    userMemberships:UserMembershipsResucer,
    coachSchedules:CoachSchedularReducer,
    services:servicesReducer,
    coachMemberships:coachMembershipReducer,
    coachRecord:CoachMembershipRecordReducer,
    settings:SettingsReducer,
    privateAdmin:PrivateAdminReducer,
})