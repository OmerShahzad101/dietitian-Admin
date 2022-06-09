import { CREATE_PRIVATE_ADMIN } from '../../redux/types';
const initialState = {
    privateAdmin: null,
    privateAdminAuth: false,
}
export default function (state = initialState, action) {
    switch (action.type) {
        case CREATE_PRIVATE_ADMIN:
            return {
                ...state,
                privateAdminAuth: true,
                privateAdmin: [action.payload, ...state.privateAdmin],
            }
        default:
            return {
                ...state
            }
    }
}