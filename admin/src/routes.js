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
import Blog from 'views/Blogs/Blog';
import CreateBlog from 'views/Blogs/CreateBlog';
import EditBlog from 'views/Blogs/EditBlog';
import Category from 'views/Categories/Category';
import CategoryCreate from 'views/Categories/CategoryCreate';
import CategoryEdit from 'views/Categories/CategoryEdit';
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
      icon: "fas fa-user-circle",
      access: true, exact: true,
      component: Profile,
      showInSideBar: true ,
    },
    {
      path: "/dashboard",
      layout: Admin,
      name: "Dashboard",
      icon: "fas fa-tachometer-alt",
      access: data?.dashboardView === true ? true : false,
      exact: data?.dashboardView === true ? true : false,
      component: Dashboard,
      showInSideBar: data?.dashboardView === true ? true : false
    },
    // {
    //   path: "/staff/private-admin",
    //   name: "Private Admin",
    //   access: true, exact: true,
    //   layout: Unauth,
    //   component: PrivateAdmin,
    // },
    {
      collapse: true,
      name: "Staff Management",
      state: "openProducts",
      icon: "fas fa-users-cog",
      showInSideBar: data?.staffView === false && data?.permissionsView === false ? false : true,
      submenus: [
        {
          path: "/staff",
          layout: Admin,
          name: "Staff",
          icon: "fas fa-user-cog",
          access: data?.staffView === true ? true : false ,
           exact: data?.staffView === true ? true : false ,
          component: AdminUser,
          showInSideBar: data?.staffView === true ? true : false ,
        },
        {
          path: "/permissions",
          layout: Admin,
          name: "Roles & Permissions",
          icon: "fas fa-user-shield",
          access: data?.permissionsView === true ? true : false,
          exact: data?.permissionsView === true ? true : false,
          component: Permission,
          showInSideBar: data?.permissionsView === true ? true : false ,
        },
      ]
    },
    {
      path: "/dietitian",
      layout: Admin,
      name: "Dietitian",
      icon: "fas fa-user-md",
      access: data?.coachingView === true ? true : false,
      exact: data?.coachingView === true ? true : false,
      component: Coaches,
      showInSideBar: data?.coachingView === true ? true : false,
    },
    {
      collapse: true,
      name: "Blog Management",
      state: "openProductssssss",
      icon: "fab fa-blogger-b",
      showInSideBar: data?.blogView === false && data?.categoryView === false ? false : true,
      submenus: [
        {
          path: "/blogs",
          layout: Admin,
          name: "Blogs",
          icon: "fas fa-blog",
          access: data?.blogView === true ? true : false ,
          exact: data?.blogView === true ? true : false ,
          component: Blog,
          showInSideBar: data?.blogView === true ? true : false ,
        },
        
        {
          path: "/categories",
          layout: Admin,
          name: "Categories",
          icon: "fas fa-blog",
          access: data?.categoryView === true ? true : false,
          exact: data?.categoryView === true ? true : false,
          component: Category,
          showInSideBar: data?.categoryView === true ? true : false ,
        },
      ]
    } ,
    {
      exceptional:true,
      path: "/blog/create",
      layout: Admin,
      name: "CREATE BLOG",
      icon: "nc-icon nc-layers-3",
      access: data?.blogCreate === true ? true : false, 
      exact: true,
      component: CreateBlog,
    },
    {
      exceptional:true,
      path: "/blog/edit/:id",
      layout: Admin,
      name: "EDIT BLOG",
      icon: "nc-icon nc-layers-3",
      access: data?.blogEdit === true ? true : false, 
      exact: true,
      component: EditBlog,
    },
    {
      exceptional:true,
      path: "/category/edit/:id",
      layout: Admin,
      name: "EDIT CATEGORY",
      icon: "nc-icon nc-layers-3",
      access: data?.categoryEdit === true ? true : false, 
      exact: true,
      component: CategoryEdit,
    },
    {
      exceptional:true,
      path: "/category/create",
      layout: Admin,
      name: "CREATE CATEGORY",
      icon: "nc-icon nc-layers-3",
      access: data?.categoryCreate === true ? true : false, 
      exact: true,
      component: CategoryCreate,
    },
    // {
    //   collapse: true,
    //   name: "Users Management",
    //   state: "openProductss",
    //   icon: "fas fa-users",
    //   showInSideBar: data?.userView === false && data?.coachingView === false ? false : true,
    //   submenus: [
    //     {
    //       path: "/clients",
    //       layout: Admin,
    //       name: "Clients",
    //       icon: "fas fa-user",
    //       access: data?.userView === true ? true : false,
    //       exact: data?.userView === true ? true : false,
    //       component: Members,
    //       showInSideBar: data?.userView === true ? true : false ,
    //     },
    //     {
    //       path: "/dietitian",
    //       layout: Admin,
    //       name: "Dietitian",
    //       icon: "fas fa-user-md",
    //       access: data?.coachingView === true ? true : false,
    //       exact: data?.coachingView === true ? true : false,
    //       component: Coaches,
    //       showInSideBar: data?.coachingView === true ? true : false,
    //     },
    //   ],
    // },
    {
      collapse: true,
      name: "Subscriptions Management",
      state: "openProductsss",
      icon: "fas fa-credit-card",
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
    // {
    //   path: "/services",
    //   layout: Admin,
    //   name: "Services Management",
    //   icon: "nc-icon nc-layers-3",
    //   access: data?.servicesView === true ? true : false, exact: true,
    //   component: Services,
    //   showInSideBar: data?.servicesView === true ? true : false,
    // },
    // { 
    //   exceptional:true,
    //   path: "/services/create",
    //   layout: Admin,
    //   name: "Services",
    //   icon: "nc-icon nc-layers-3",
    //   access: data?.servicesView === true ? true : false, exact: true,
    //   component: ServiceCreate,
    // },
    // {
    //   exceptional:true,
    //   path: "/services/edit/:id",
    //   layout: Admin,
    //   name: "EDIT Services",
    //   icon: "nc-icon nc-layers-3",
    //   access: data?.servicesView === true ? true : false, 
    //   exact: true,
    //   component: ServicesEdit,
    // },
    {
      path: "/cms",
      layout: Admin,
      name: "Content Management",
      icon: "fas fa-desktop",
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
    // {
    //   path: "/review",
    //   layout: Admin,
    //   name: "Reviews",
    //   icon: "nc-icon nc-layers-3",
    //   access: data?.reviewView === true ? true : false, exact: true,
    //   component: Review,
    //   showInSideBar: false,
    //   showInSideBar: data?.reviewView === true ? true : false,
    // },
    // {
    //   path: "/email-templates",
    //   layout: Admin,
    //   name: "Email Templates",
    //   icon: "nc-icon nc-layers-3",
    //   access: data?.emailTemplateEdit === true ? true : false, exact: true,
    //   component: EmailTemplates,
    //   showInSideBar:  false,
    //   showInSideBar: data?.emailTemplateEdit === true ? true : false,
    // },
    {
      path: "/contact-us-queries",
      layout: Admin,
      name: "Contact Us Queries",
      icon: "fas fa-address-book",
      access: data?.contactUsQueriesView === true ? true : false, exact: true,
      component: ContactUsQueries,
      showInSideBar: data?.contactUsQueriesView === true ? true : false,
    },
    // {
    //   exceptional:true,
    //   path: "/schedular/edit/:id",
    //   layout: Admin,
    //   name: "Coach SChedular",
    //   access: data?.coachingEdit === true ? true : false , exact: true,
    //   component: CoachSchedular,
    // },
    // {
    //   exceptional:true,
    //   path: "/schedular/view/:id",
    //   layout: Admin,
    //   name: "Coach Schedules View",
    //   access: data?.coachingView === true ? true : false , exact:true,
    //   component: CoachSchedulesView,
    // },
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
      icon: "fas fa-cogs",
      component: Settings,
      access:data?.settingsView === true ? true : false,
      showInSideBar:data?.settingsView === true ? true : false,
    },
  ];

  return routesArr;
}

export default routes;