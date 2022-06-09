//importing layouts....
import  {ENV}  from 'config/config';
import Admin from 'layouts/Admin';
import UnAuth from 'layouts/Auth';
import Dashboard from "views/Dashboard/Dashboard";
import Login from "./views/Login/Login";
import Profile from 'views/Profile/profile';
import Unauth from 'layouts/Auth';
import ForgotPassword from 'views/ForgotPassword/ForgotPassword';
import ResetPassword from 'views/ResetPassword/ResetPassword';
import Members from 'views/Members/Members';
import AdminUser from 'views/Admin/Admin';
import EmailTemplates from 'views/EmailTemplates/EmailTemplates';
import ContactUsQueries from 'views/ContactUsQueries/ContactUsQueries';
import Cms from 'views/CMS/Cms';
import CreateCms from 'views/CMS/CreateCms';
import Permission from 'views/Permissions/Permission';
import EditCms from 'views/CMS/EditCms';
import Review from 'views/Review/Review';
import Membership from 'views/Memberships/Memberships';
import createMembership  from 'views/Memberships/MembershipCreate';
import EditMembership from 'views/Memberships/MembershipEdit';
import ViewMembership from 'views/Memberships/MembershipView';
import Coaches from 'views/Coaches/Coaches';
import UserMemberships from 'views/UsersMemberships/UsersMemberships';
import UserMembershipEdit from 'views/UsersMemberships/UserMembershipsEdit';
import CoachSchedular from 'views/Schedular/CoachSchedular';
import CoachSchedulesView from 'views/Schedular/CoachSchedulesView';
import Services from 'views/Services/Services';
import ServiceCreate from 'views/Services/ServicesCreate';
import ServicesEdit from 'views/Services/ServicesEdit';
import CoachMemberships from 'views/CoachMemberships/CoachMemberships'
import CoachMembershipCreate from 'views/CoachMemberships/CoachMembershipCreate';
import CoachMembershipEdit from 'views/CoachMemberships/CoachMembershipEdit';
import CoachMembershipView from 'views/CoachMemberships/CoachMembershipView';
import CoachMembershipRecord from 'views/CoachMembershipRecord/CoachMembershipRecord'
import CoachMembershipEditRecord from 'views/CoachMembershipRecord/CoachMembershipRecordEdit'
import Settings from 'views/Settings/Settings'
import PrivateAdmin from 'views/PrivateAdmin/PrivateAdmin'
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import { object } from 'prop-types';

const routes =  () =>  {

  let obj =  ENV.getUserKeys();
  let uid = obj?._id
  let data = obj?.permissionId;
  let settingPath = `/settings/${uid}`;

  var routesArr = [
    {
      path: "/",
      layout: Unauth,
      name: "Login",
      icon: "nc-icon nc-chart-pie-35",
      access: true,
      exact: true,
      component: Login
    },
    {
      exceptional:true,
      path: "/profile",
      layout: Admin,
      name: "Profile",
      icon: "nc-icon nc-circle-09",
      access: true, exact: true,
      component: Profile,
      showInSideBar: false,
    },
    {
      path: "/dashboard",
      layout: Admin,
      name: "Dashboard",
      icon: "nc-icon nc-chart-pie-35",
      access: data?.dashboardView === true ? true : false,
      exact: data?.dashboardView === true ? true : false,
      component: Dashboard,
      showInSideBar: data?.dashboardView === true ? true : false
    },
    {
      path: "/staff/private-admin",
      name: "Private Admin",
      access: true, exact: true,
      layout: Unauth,
      component: PrivateAdmin,
    },
    {
      collapse: true,
      name: "Staff Management",
      state: "openProducts",
      icon: "nc-icon nc-badge",
      showInSideBar: data?.staffView === false && data?.permissionsView === false ? false : true,
      submenus: [
        {
          path: "/staff",
          layout: Admin,
          name: "Staff",
          icon: "nc-icon nc-badge",
          access: data?.staffView === true ? true : false ,
           exact: data?.staffView === true ? true : false ,
          component: AdminUser,
          showInSideBar: data?.staffView === true ? true : false ,
        },
        {
          path: "/permissions",
          layout: Admin,
          name: "Permissions",
          icon: "nc-icon nc-notes",
          access: data?.permissionsView === true ? true : false,
          exact: data?.permissionsView === true ? true : false,
          component: Permission,
          showInSideBar: data?.permissionsView === true ? true : false ,
        },
      ]
    } ,
    {
      collapse: true,
      name: "Users",
      state: "openProductss",
      icon: "nc-icon nc-badge",
      showInSideBar: data?.userView === false && data?.coachingView === false ? false : true,
      submenus: [
        {
          path: "/members",
          layout: Admin,
          name: "Members",
          icon: "nc-icon nc-badge",
          access: data?.userView === true ? true : false,
          exact: data?.userView === true ? true : false,
          component: Members,
          showInSideBar: data?.userView === true ? true : false ,
        },
        {
          path: "/coaches",
          layout: Admin,
          name: "Coaches",
          icon: "nc-icon nc-badge",
          access: data?.coachingView === true ? true : false,
          exact: data?.coachingView === true ? true : false,
          component: Coaches,
          showInSideBar: data?.coachingView === true ? true : false,
        },
      ],
    },
    {
      collapse: true,
      name: "Membership Management",
      state: "openProductsss",
      icon: "nc-icon nc-badge",
      showInSideBar: data?.userMemberShipView === false && data?.coachMemberShipView === false ? false : true,
      submenus: [
        {
          path: "/membermembership",
          layout: Admin,
          mini: "SS",
          name: "Member Memberships",
          icon: "nc-icon nc-layers-3",
          access: data?.userMemberShipView === true ? true : false, exact: true,
          component: Membership,
          showInSideBar: data?.userMemberShipView === true ? true : false,
        },
        {
          path: "/coachmembership",
          layout: Admin,
          mini: "SS",
          name: "Coach Memberships",
          icon: "nc-icon nc-layers-3",
          access: data?.coachMemberShipView === true ? true : false, exact: true,
          component: CoachMemberships,
          showInSideBar: data?.coachMemberShipView === true ? true : false,
        },
        {
          path: "/usersmemberships",
          layout: Admin,
          mini: "SS",
          name: "Member Membership Data",
          icon: "nc-icon nc-layers-3",
          access: data?.userMembershipRecordView === true ? true : false, exact: true,
          component:UserMemberships,
          showInSideBar: data?.userMembershipRecordView === true ? true : false,
        },
        {
          path: "/coachrecord",
          layout: Admin,
          mini: "SS",
          name: "Coach Membership Data",
          icon: "nc-icon nc-layers-3",
          access: data?.coachMembershipRecordView === true ? true : false, exact: true,
          component: CoachMembershipRecord,
          showInSideBar: data?.coachMembershipRecordView === true ? true : false,
        },
      ],
    },
    {
      path: "/usermembership/edit/:id",
      layout: Admin,
      name: "EDIT userMembership",
      icon: "nc-icon nc-layers-3",
      access: data?.userMembershipRecordEdit === true ? true : false , 
      exact: true,
      component: UserMembershipEdit,
    },
    {
      path: "/coachrecord/edit/:id",
      layout: Admin,
      name: "EDIT userMembership",
      icon: "nc-icon nc-layers-3",
      access: data?.coachMembershipRecordEdit === true ? true : false , 
      exact: true,
      component: CoachMembershipEditRecord,
    },
    {
      path: "/membermembership/create",
      layout: Admin,
      name: "CREATE memberships",
      icon: "nc-icon nc-layers-3",
      access: data?.userMemberShipCreate === true ? true : false, 
      exact: true,
      component: createMembership,
    },
    {
      path: "/membermembership/edit/:id",
      layout: Admin,
      name: "Edit memberships",
      icon: "nc-icon nc-layers-3",
      access: data?.UserMembershipEdit === true ? true : false, 
      exact: true,
      component: EditMembership,
    },
    {
      path: "/membermembership/view/:id",
      layout: Admin,
      name: "View memberships",
      icon: "nc-icon nc-layers-3",
      access: data?.userMemberShipView === true ? true : false, 
      exact: true,
      component: ViewMembership,
    },
    {
      path: "/coachmembership/create",
      layout: Admin,
      name: "CREATE CoachMembership",
      icon: "nc-icon nc-layers-3",
      access: data?.coachMemberShipCreate === true ? true : false, 
      exact: true,
      component: CoachMembershipCreate,
    },
    {
      path: "/coachmembership/edit/:id",
      layout: Admin,
      name: "Edit CoachMembership",
      icon: "nc-icon nc-layers-3",
      access: data?.CoachMembershipEdit === true ? true : false, 
      exact: true,
      component: CoachMembershipEdit,
    },
    {
      path: "/coachmembership/view/:id",
      layout: Admin,
      name: "View CoachMemberships",
      icon: "nc-icon nc-layers-3",
      access: data?.coachMemberShipView === true ? true : false, 
      exact: true,
      component: CoachMembershipView,
    },
    {
      path: "/services",
      layout: Admin,
      name: "Services",
      icon: "nc-icon nc-layers-3",
      access: data?.servicesView === true ? true : false, exact: true,
      component: Services,
      showInSideBar: data?.servicesView === true ? true : false,
    },
    { 
      exceptional:true,
      path: "/services/create",
      layout: Admin,
      name: "Services",
      icon: "nc-icon nc-layers-3",
      access: data?.servicesView === true ? true : false, exact: true,
      component: ServiceCreate,
    },
    {
      exceptional:true,
      path: "/services/edit/:id",
      layout: Admin,
      name: "EDIT Services",
      icon: "nc-icon nc-layers-3",
      access: data?.servicesView === true ? true : false, 
      exact: true,
      component: ServicesEdit,
    },
    {
      path: "/cms",
      layout: Admin,
      name: "CMS",
      icon: "nc-icon nc-layers-3",
      access: data?.contentView === true ? true : false, exact: true,
      component: Cms,
      showInSideBar: data?.contentView === true ? true : false,
    },
    {
      exceptional:true,
      path: "/cms/create",
      layout: Admin,
      name: "CREATE CMS",
      icon: "nc-icon nc-layers-3",
      access: data?.contentView === true ? true : false, 
      exact: true,
      component: CreateCms,
    },
    {
      exceptional:true,
      path: "/cms/edit/:id",
      layout: Admin,
      name: "EDIT CMS",
      icon: "nc-icon nc-layers-3",
      access: data?.contentView === true ? true : false, 
      exact: true,
      component: EditCms,
    },
    {
      path: "/review",
      layout: Admin,
      name: "Reviews",
      icon: "nc-icon nc-layers-3",
      access: data?.reviewView === true ? true : false, exact: true,
      component: Review,
      showInSideBar: data?.reviewView === true ? true : false,
    },
    {
      path: "/email-templates",
      layout: Admin,
      name: "Email Templates",
      icon: "nc-icon nc-layers-3",
      access: data?.emailTemplateEdit === true ? true : false, exact: true,
      component: EmailTemplates,
      showInSideBar: data?.emailTemplateEdit === true ? true : false,
    },
    {
      path: "/contact-us-queries",
      layout: Admin,
      name: "Contact Us Queries",
      icon: "nc-icon nc-notes",
      access: data?.contactUsQueriesView === true ? true : false, exact: true,
      component: ContactUsQueries,
      showInSideBar: data?.contactUsQueriesView === true ? true : false,
    },
    {
      exceptional:true,
      path: "/schedular/edit/:id",
      layout: Admin,
      name: "Coach SChedular",
      access: data?.coachingEdit === true ? true : false , exact: true,
      component: CoachSchedular,
    },
    {
      exceptional:true,
      path: "/schedular/view/:id",
      layout: Admin,
      name: "Coach Schedules View",
      access: data?.coachingView === true ? true : false , exact:true,
      component: CoachSchedulesView,
    },
    {
      exceptional:true,
      path: "/login",
      layout: UnAuth,
      name: "Login",
      mini: "LP",
      component: Login,
      access:true,
    },
    {
      exceptional:true,
      path: "/forgotpassword",
      layout: UnAuth,
      name: "Forgot Passowrd",
      mini: "FP",
      component: ForgotPassword,
      access:true,
    },
    {
      exceptional:true,
      path: "/reset-password/:adminId",
      layout: UnAuth,
      name: "Reset Passowrd",
      mini: "RP",
      component: ResetPassword,
      access:true,
    },
    {
      path:"/settings",
      layout: Admin,
      name: "Settings",
      icon: "nc-icon nc-layers-3",
      component: Settings,
      access:data?.settingsView === true ? true : false,
      showInSideBar:data?.settingsView === true ? true : false,
    },
  ];

  return routesArr;
}

export default routes;