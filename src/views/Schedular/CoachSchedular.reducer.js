import { GET_ERRORS,CREATE_SCHEDULAR, BEFORE_SCHEDULAR, GET_SCHEDULAR, UPDATE_SCHEDULAR } from "redux/types";
const initialState= {
    schedularListAuth:false,
    schedularList:[],
    schedular:null,
    getSchedular:null,
    getSchedularAuth:false,
    updateSchedularAuth: false,
    delSchedularAuth: false,
    pagination: null,
}
export default function(state = initialState, action) {
    switch (action.type) {
        case BEFORE_SCHEDULAR:
            return {
                ...state,
                schedular: null,
                getSchedularAuth: false,
                getschedular: null,
            }
        case CREATE_SCHEDULAR:
            return {
                ...state,
                schedularList: [action.payload, ...state.schedularList],
                schedularListAuth: true,
            }
        case GET_SCHEDULAR:
            return {
                ...state,
                getSchedularAuth: true,
                getSchedular: action.payload,
                pagination: action.payload.pagination,
            }
        case UPDATE_SCHEDULAR:
            return {
                ...state,
                updateSchedularAuth:true,
                schedular:action.payload,
            }    
        default:
            return {
                ...state
            }
    }
}