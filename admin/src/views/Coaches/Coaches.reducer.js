import { BEFORE_COACH, CREATE_COACH,GET_COACH,  UPDATE_COACH,DELETE_COACH, LIST_COACH } from '../../redux/types';
const initialState = {
    coachList:null,
    coachListAuth: false,
    pagination: null,
    coach: null,
    updateCoachAuth: false,
    getAuth: false,
    delCoach: null,
    delCoachAuth:false
}
export default function (state = initialState, action) {
    switch (action.type) {
        case CREATE_COACH:
            return {
                ...state,
                coachListAuth: true,
                coachList: [action.payload, ...state.coachList],
            }
        case UPDATE_COACH:
            return {
                ...state,
                coach: action.payload,
                updateCoachAuth: true
            }
            case DELETE_COACH:
            return {
                ...state,
                coachList: state.coachList.filter(
                    (coach) => coach._id !== action.payload.coachId
                  ),
                // delCoach: action.payload,
                delCoachAuth:true
            }
        case GET_COACH:
            return {
                ...state,
                coach: action.payload,
                getAuth: true
            }
        case BEFORE_COACH:
            return {
                ...state,
                // coach: null,
                updateCoachAuth: false,
                // coachList: null,
                coachListAuth: false,
            }
        case LIST_COACH:
            return {
                ...state,
                coachListAuth: true,
                coachList: action.payload.coaches,
                pagination: action.payload.pagination
            }
        default:
            return {
                ...state
            }
    }
}