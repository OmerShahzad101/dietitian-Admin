import { GET_ERRORS, CREATE_CATEGORY, BEFORE_CATEGORY,LIST_CATEGORY , GET_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY} from "redux/types";


const initialState = {
    categoryListAuth: false,
    categoryList: [],
    category: null,
    getCategory: null,
    getAuth: false,
    updateCategoryAuth: false,
    delCategoryAuth: false,
    pagination: null,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case BEFORE_CATEGORY:
            return {
                ...state,
                category: null,
                getAuth: false,
                getCategory: null,
            }
        case CREATE_CATEGORY:
            return {
                ...state,
                categoryList: [action.payload, ...state.categoryList],
                categoryListAuth: true,
            }
        case UPDATE_CATEGORY:
            return {
                ...state,
                category: action.payload.categoryUpdated,
                updateCategoryAuth: true,
            }
        case DELETE_CATEGORY:
            return {
                ...state,
                // delAdmin: action.payload,
                categoryList: state.categoryList.filter(
                    (category) => category._id !== action.payload.categoryId
                  ),
                delCategoryAuth:true,
            }
        case LIST_CATEGORY:
            return {
                ...state,
                categoryList: action.payload.category,
                categoryListAuth: true,
                pagination: action.payload.pagination
            }
        case GET_CATEGORY:
            return {
                ...state,
                getAuth: true,
                getCategory: action.payload,
            }
        default:
            return {
                ...state
            }
    }
}