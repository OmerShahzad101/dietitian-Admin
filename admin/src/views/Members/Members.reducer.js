import {
  CREATE_MEMBER,
  GET_MEMBERS,
  BEFORE_MEMBER,
  UPSERT_MEMBER,
  DELETE_MEMBER,
  } from "../../redux/types";
  
  const initialState = {
    registeredMembers: [],
    pagination: null,
    getRegisteredMembers: false,
    updatedMember: null,
    updatedMemberAuth: false,
    delAuth: false,
    delMember: null,
    createdUser: null,
    createdUserAuth: false,
  };
  
  export default function (state = initialState, action) {
    switch (action.type) {
      case CREATE_MEMBER:
        return { 
          ...state,
          getRegisteredMembers: true,
          registeredMembers: [ action.payload ,...state.registeredMembers] ,
        };
      case GET_MEMBERS:
        return {
          ...state,
          registeredMembers: action.payload.users,
          pagination: action.payload.pagination,
          getRegisteredMembers: true,
        };
      case BEFORE_MEMBER:
        return {
          ...state,
          pagination: null,
          updatedMember: null,
          updatedMemberAuth: false,
          delMember: null,
          createdUserAuth: false,
        };
      case UPSERT_MEMBER:
        return {
          ...state,
          updatedMember: action.payload,
          updatedMemberAuth: true,
        };
      case DELETE_MEMBER:
        return {
          ...state,
          delAuth: true,
          // delMember: action.payload,
          registeredMembers: state.registeredMembers.filter(
            (user) => user._id !== action.payload.userId
          ),
        };
      default:
        return {
          ...state,
        };
    }
  }
  