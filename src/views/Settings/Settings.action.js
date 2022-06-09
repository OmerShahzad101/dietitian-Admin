import { toast } from 'react-toastify';
import { GET_SETTINGS , EDIT_SETTINGS, BEFORE_SETTINGS } from "redux/types";
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeSettings = () => {
    return {
        type: BEFORE_SETTINGS
    }
}

export const updateSettings = (obj) => (dispatch) => {
    dispatch(emptyError());
    const url = `${ENV.url}settings/edit`;
    fetch(url, {
      method: "PUT",
      headers: {
        'Authorization': ENV.Authorization,
        'x-auth-token': ENV.x_auth_token,
        'x-access-token': (localStorage.getItem('accessToken') ? window.atob(localStorage.getItem('accessToken')) : ''),
        "Content-Type": "application/json",
    },
    body:  JSON.stringify(obj)
    })
    .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          dispatch({
            type: EDIT_SETTINGS,
            payload: data,
          });
        } else {
          if (data.userDisabled) {
            window.location.href = "/admin/login";
            localStorage.removeItem("accessToken");
            localStorage.removeItem("adminId");
            localStorage.removeItem("encuse");
          }
          toast.error(data.message);
          dispatch({
            type: GET_ERRORS,
            payload: data.updatedSettings,
          });
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const { data } = error.response;
          if (data.message) toast.error(data.message);
        }
        dispatch({
          type: GET_ERRORS,
          payload: error,
        });
      });
};

export const getSettings = () => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}settings/get`;
    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': (localStorage.getItem('accessToken') ? window.atob(localStorage.getItem('accessToken')) : '')
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_SETTINGS,
                payload: data.settingsDocument
            })
        } else {
            window.location.href = '/admin/login'
            localStorage.removeItem("accessToken");
            localStorage.removeItem("adminId");
            localStorage.removeItem("encuse");
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};