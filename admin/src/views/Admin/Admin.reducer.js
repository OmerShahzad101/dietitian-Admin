import { BEFORE_ADMIN, LOGIN_ADMIN, GET_ADMIN,CREATE_ADMIN, UPDATE_ADMIN,DELETE_ADMIN, UPDATE_PASSWORD, FORGOT_PASSWORD, RESET_PASSWORD, LIST_ADMIN } from '../../redux/types';
const initialState = {
    adminList: null,
    pagination: null,
    admin: null,
    loginAdminAuth: false,
    updateAdminAuth: false,
    updatePasswordAuth: false,
    getAuth: false,
    forgotPassword: null,
    forgotPasswordAuth: false,  
    resetPasswordAuth: false,
    forgotMsg: null,
    adminListAuth: false,
    delAdmin: null,
    delAdminAuth:false,
    redirectFunction:false,
}
export default function (state = initialState, action) {
    switch (action.type) {
        case CREATE_ADMIN:
            return {
                ...state,
                adminListAuth: true,
                adminList: [action.payload, ...state.adminList],
            }
        case UPDATE_ADMIN:
            return {
                ...state,
                admin: action.payload,
                updateAdminAuth: true
            }
            case DELETE_ADMIN:
            return {
                ...state,
                delAdmin: action.payload,
                // adminList: state.adminList.filter((admin) => admin._id !== action.payload.adminId),
                delAdminAuth:true
            }
        case UPDATE_PASSWORD:
            return {
                ...state,
                admin: action.payload,
                updatePasswordAuth: true
            }
        case LOGIN_ADMIN:
            return {
                ...state,
                admin: action.payload,
                loginAdminAuth: true,
                redirectFunction:true,
            }
        case GET_ADMIN:
            return {
                ...state,
                admin: action.payload,
                getAuth: true
            }
        case BEFORE_ADMIN:
            return {
                ...state,
                updateAdminAuth: false,
                delAdmin: null,
                delAdminAuth:false,
                adminListAuth: false
            }
        case FORGOT_PASSWORD:
            return {
                ...state,
                forgotPasswordAuth: true,
                forgotMsg: action.msg
            }
        case RESET_PASSWORD:
            return {
                ...state,
                resetPasswordAuth: true
            }
        case LIST_ADMIN:
            return {
                ...state,
                adminListAuth: true,
                adminList: action.payload.admins,
                pagination: action.payload.pagination
            }
        default:
            return {
                ...state
            }
    }
}