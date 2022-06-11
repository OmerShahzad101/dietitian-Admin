import { BEFORE_MEMBERSHIP, CREATE_MEMBERSHIP, MEMBERSHIP_LIST, GET_MEMBERSHIP, UPDATE_MEMBERSHIP, DELETE_MEMBERSHIP} from "redux/types";

const initialState= {
    membershipListAuth:false,
    membershipList:[],
    membership:null,
    getMembership:null,
    getMembershipAuth:false,
    updateMembershipAuth: false,
    delMembershipAuth: false,
    pagination: null,
}

export default function(state = initialState, action) {
    switch (action.type) {
        case BEFORE_MEMBERSHIP:
            return {
                ...state,
                membership: null,
                getMembershipAuth: false,
                getMembership: null,
            }
        case CREATE_MEMBERSHIP:
            return {
                ...state,
                membershipList: [action.payload, ...state.membershipList],
                membershipListAuth: true,
            }
        case UPDATE_MEMBERSHIP:
            return {
                ...state,
                membership: action.payload.membership,
                updateMembershipAuth: true,
            }
        case DELETE_MEMBERSHIP:
            return {
                ...state,
                // delAdmin: action.payload,
                membershipList: state.membershipList.filter(
                    (membership) => membership._id !== action.payload.membershipId
                  ),
                delMembershipAuth:true,
            }
        case MEMBERSHIP_LIST:
            return {
                ...state,
                membershipList: action.payload.membershipList,
                membershipListAuth: true,
                pagination: action.payload.pagination
            }
        case GET_MEMBERSHIP:
            return {
                ...state,
                getMembershipAuth: true,
                getMembership: action.payload,
            }
        default:
            return {
                ...state
            }
    }
}
