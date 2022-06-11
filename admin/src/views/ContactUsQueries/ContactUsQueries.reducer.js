import { GET_CONTACTS, BEFORE_CONTACT, EDIT_CONTACT } from '../../redux/types';

const initialState = {
    queries: [],
    pagination: null,
    getQueries: false,
    changed: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_CONTACTS:
            return {
                ...state,
                queries: action.payload.contacts,
                pagination: action.payload.pagination,
                getQueries: true
            }
        case BEFORE_CONTACT:
            return {
                ...state,
                queries: [],
                pagination: null,
                getQueries: false,
                changed: false
            }
        case EDIT_CONTACT:
            return {
                ...state,
                changed: true
            }
        default:
            return {
                ...state
            }
    }
}