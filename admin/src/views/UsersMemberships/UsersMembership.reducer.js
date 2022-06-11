import {
  USERMEMBERSHIP_LIST,GET_USERMEMBERSHIP, UPDATE_USERMEMBERSHIP
} from "../../redux/types";

const initialState = {
    userMembership: [],
    pagination: null,
    getUserMembership: false,
    getusermemb: null,
    getAuth: false,
    updateusermemb:null,
    updatedAuth:false,
  };

  export default function (state = initialState, action) {
    switch (action.type) {
      case USERMEMBERSHIP_LIST:
        return {
          ...state,
          userMembership: action.payload.usermembershipList,
          pagination: action.payload.pagination,
          getUserMembership: true,
        };
      case GET_USERMEMBERSHIP:
        return {
          ...state,
          getusermemb:action.payload,
          getAuth:true,
        }  
      case UPDATE_USERMEMBERSHIP:
        return {
          ...state,
          updateusermemb:action.payload.usermembership,
          updatedAuth:true,
        }  
      default:
        return {
          ...state,
        };
    }
  }  