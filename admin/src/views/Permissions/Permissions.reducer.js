import {
    BEFORE_PERMISSION,
    CREATE_PERMISSION,
    GET_PERMISSION,
    UPDATE_PERMISSION ,
    DELETE_PERMISSION
} from "../../redux/types";


const initialState = {
    permissions: [],
    pagination: null,
    getpermCall: false,
    updatedPerm : null,
    updatedPermissions: null,
    updatedPermAuth:false,
    delPermAuth:false,
    delPerm: null,
};

export default function (state = initialState, action){
    switch(action.type){
        case BEFORE_PERMISSION:
            return{
                ...state,
                updatedPermAuth: false,
                delPerm: null,
                delPermAuth:false,
                getpermCall:false,
            }
        case CREATE_PERMISSION:
            return {
                ...state,
                permissions:[ action.payload ,...state.permissions] ,
                getpermCall:true,
            };
        case GET_PERMISSION:
            return {
                ...state,
                permissions: action.payload.permissions,
                pagination: action.payload.pagination,
                getpermCall:true,
            };
        case UPDATE_PERMISSION:
            return {
                ...state,
                updatedPerm: action.payload.permissions,
                updatedPermAuth: true,
            };
        case DELETE_PERMISSION:
            return{
                ...state,
                permissions: state.permissions.filter(
                    (permission) => permission._id !== action.payload.permId
                  ),
                delPermAuth: true,
                // delPerm: action.payload,
            };
        default:
            return {
                ...state,
            };              
    }
}