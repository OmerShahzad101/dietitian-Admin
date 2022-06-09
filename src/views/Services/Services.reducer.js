import { GET_ERRORS, CREATE_SERVICES, BEFORE_SERVICES,LIST_SERVICES , GET_SERVICE, UPDATE_SERVICES, DELETE_SERVICES} from "redux/types";


const initialState = {
    servicesListAuth: false,
    servicesList: [],
    services: null,
    getServices: null,
    getAuth: false,
    updateServicesAuth: false,
    delServicesAuth: false,
    pagination: null,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case BEFORE_SERVICES:
            return {
                ...state,
                services: null,
                getAuth: false,
                getServices: null,
            }
        case CREATE_SERVICES:
            return {
                ...state,
                servicesList: [action.payload, ...state.servicesList],
                servicesListAuth: true,
            }
        case UPDATE_SERVICES:
            return {
                ...state,
                services: action.payload.servicesUpdated,
                updateServicesAuth: true,
            }
        case DELETE_SERVICES:
            return {
                ...state,
                // delAdmin: action.payload,
                servicesList: state.servicesList.filter(
                    (service) => service._id !== action.payload.serviceId
                  ),
                delServicesAuth:true,
            }
        case LIST_SERVICES:
            return {
                ...state,
                servicesList: action.payload.services,
                servicesListAuth: true,
                pagination: action.payload.pagination
            }
        case GET_SERVICE:
            return {
                ...state,
                getAuth: true,
                getServices: action.payload,
            }
        default:
            return {
                ...state
            }
    }
}