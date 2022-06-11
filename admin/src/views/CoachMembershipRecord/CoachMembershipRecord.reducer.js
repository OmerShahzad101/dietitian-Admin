import {
    COACHRECORD_LIST,GET_COACHRECORD, UPDATE_COACHRECORD
  } from "../../redux/types";
  
  const initialState = {
      coachMembership: [],
      pagination: null,
      getCoachMembership: false,
      getCoachmemb: null,
      getAuth: false,
      updateCoachmemb:null,
      updatedAuth:false,
    };
  
    export default function (state = initialState, action) {
      switch (action.type) {
        case COACHRECORD_LIST:
          return {
            ...state,
            coachMembership: action.payload.coachMembershipList,
            pagination: action.payload.pagination,
            getCoachMembership: true,
          };
        case GET_COACHRECORD:
          return {
            ...state,
            getCoachmemb:action.payload,
            getAuth:true,
          }  
        case UPDATE_COACHRECORD:
          return {
            ...state,
            updateCoachmemb:action.payload.coachMembership,
            updatedAuth:true,
          }  
        default:
          return {
            ...state,
          };
      }
    }  