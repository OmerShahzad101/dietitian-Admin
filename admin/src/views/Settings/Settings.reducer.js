import { GET_SETTINGS , EDIT_SETTINGS, BEFORE_SETTINGS } from "redux/types";

const initialState = {
    getSettings: null,
    getSettingsAuth: false,
    updatedSettings: null,
    updatedSettingsAuth: false,
};
export default function(state = initialState, action) {
    switch (action.type) {

        case BEFORE_SETTINGS:
            return {
                ...state,
                updatedSettings: null,
                getSettingsAuth: false,
                getSettings: null,
                updatedSettingsAuth: false,
            }
        case EDIT_SETTINGS:
            return {
                ...state,
                updatedSettings: action.payload,
                updatedSettingsAuth: true,
            }
        case GET_SETTINGS:
            return {
                ...state,
                getSettingsAuth: true,
                getSettings: action.payload,
            }
        default:
            return {
                ...state
            }
    }
}