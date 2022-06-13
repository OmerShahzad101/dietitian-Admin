import { BEFORE_COACHMEMBERSHIP, CREATE_COACHMEMBERSHIP, COACHMEMBERSHIP_LIST, GET_COACHMEMBERSHIP, UPDATE_COACHMEMBERSHIP, DELETE_COACHMEMBERSHIP} from "redux/types";

const initialState= {
    coachMembershipListAuth:false,
    coachMembershipList:[],
    coachMembership:null,
    getCoachMembership:null,
    getCoachMembershipAuth:false,
    updateCoachMembershipAuth: false,
    delCoachMembershipAuth: false,
    pagination: null,
}

export default function(state = initialState, action) {
    switch (action.type) {
        case BEFORE_COACHMEMBERSHIP:
            return {
                ...state,
                coachMembership: null,
                getCoachMembershipAuth: false,
                getCoachMembership: null,
            }
        case CREATE_COACHMEMBERSHIP:
            return {
                ...state,
                coachMembershipList: [action.payload, ...state.coachMembershipList],
                coachMembershipListAuth: true,
            }
        case UPDATE_COACHMEMBERSHIP:
            return {
                ...state,
                coachMembership: action.payload.coachMembership,
                updateCoachMembershipAuth: true,
            }
        case DELETE_COACHMEMBERSHIP:
            return {
                ...state,
                // delAdmin: action.payload,
                coachMembershipList: state.coachMembershipList.filter(
                    (coachMembership) => coachMembership._id !== action.payload.coachMembershipId
                  ),
                delCoachMembershipAuth:true,
            }
        case COACHMEMBERSHIP_LIST:
            return {
                ...state,
                coachMembershipList: action.payload.CoachMembershipList,
                coachMembershipListAuth: true,
                pagination: action.payload.pagination
            }
        case GET_COACHMEMBERSHIP:
            return {
                ...state,
                getCoachMembership: action.payload,
                getCoachMembershipAuth: true,
            }
        default:
            return {
                ...state
            }
    }
}
