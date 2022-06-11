import { BEFORE_CMS ,CREATE_CMS, CMS_LIST, GET_CMS, UPDATE_CMS, DELETE_CMS } from "redux/types";

const initialState = {
    cmsListAuth: false,
    cmsList: [],
    cms: null,
    getCms: null,
    getAuth: false,
    updateCmsAuth: false,
    delCms: null,
    delCmsAuth: false,
    pagination: null,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case BEFORE_CMS:
            return {
                ...state,
                cms: null,
                getAuth: false,
                getCms: null,
                delCms: null,
                delCmsAuth: false,
            }
        case CREATE_CMS:
            return {
                ...state,
                cmsList: [action.payload, ...state.cmsList],
                cmsListAuth: true,
            }
        case UPDATE_CMS:
            return {
                ...state,
                cms: action.payload.cms,
                updateCmsAuth: true,
            }
        case DELETE_CMS:
            return {
                ...state,
                // delCms: action.payload,
                cmsList: state.cmsList.filter((cms) => cms._id !== action.payload.cmsId),
                delCmsAuth:true
            }
        case CMS_LIST:
            return {
                ...state,
                cmsList: action.payload.cmsList,
                cmsListAuth: true,
                pagination: action.payload.pagination
            }
        case GET_CMS:
            return {
                ...state,
                getAuth: true,
                getCms: action.payload,
            }
        default:
            return {
                ...state
            }
    }
}