import { toast } from 'react-toastify';
import { GET_ERRORS, CREATE_SERVICES, BEFORE_SERVICES,LIST_SERVICES , GET_SERVICE, UPDATE_SERVICES, DELETE_SERVICES} from "redux/types";
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeServices = () => {
    return {
        type: BEFORE_SERVICES
    }
}
export const createServices = (obj, qs = null) => (dispatch) => {
    dispatch(emptyError());
    let url = `${ENV.url}services/create`;
    if (qs) url += `?${qs}`;
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: ENV.Authorization,
        "x-auth-token": ENV.x_auth_token,
        "x-access-token": localStorage.getItem("accessToken")
          ? window.atob(localStorage.getItem("accessToken"))
          : "",
        // "Content-Type": "application/json",
      },
      body: obj,
    })
      .then((res) => res.json()).then((data) => {
        if (data.success) {
          toast.success(data.message);
          dispatch({
            type: CREATE_SERVICES,
            payload: data.savedService,
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
            payload: data,
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

export const listServices = (qs = null) => (dispatch) => {
    dispatch(emptyError());
    let url = `${ENV.url}services/list`;
    if (qs) url += `?${qs}`;
    fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: ENV.Authorization,
        "x-auth-token": ENV.x_auth_token,
        "x-access-token": localStorage.getItem("accessToken")
          ? window.atob(localStorage.getItem("accessToken"))
          : "",
      },
    })
      .then((res) => res.json()).then((data) => {
        if (data.success) {
          dispatch({
            type: LIST_SERVICES,
            payload: data.data,
          });
        } else {
          if (data.userDisabled) {
            window.location.href = "/admin/login";
            localStorage.removeItem("accessToken");
            localStorage.removeItem("adminId");
            localStorage.removeItem("encuse");
          }
          if (!qs) toast.error(data.message);
          dispatch({
            type: GET_ERRORS,
            payload: data,
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

export const getService = (serviceId = '') => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}services/get/${serviceId}`;

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
                type: GET_SERVICE,
                payload: data.service
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

export const updateServices = (obj) => (dispatch) => {
    dispatch(emptyError());
    const url = `${ENV.url}services/edit`;
    fetch(url, {
      method: "PUT",
      headers: {
        Authorization: ENV.Authorization,
        "x-auth-token": ENV.x_auth_token,
        "x-access-token": localStorage.getItem("accessToken")
          ? window.atob(localStorage.getItem("accessToken"))
          : "",
        // "Content-Type": "application/json",
      },
      body:obj
    })
    .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          dispatch({
            type: UPDATE_SERVICES,
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
            payload: data,
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
export const deleteService = (id) => (dispatch) => {
    dispatch(emptyError());
    const url = `${ENV.url}services/delete/${id}`;
    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: ENV.Authorization,
        "x-auth-token": ENV.x_auth_token,
        "x-access-token": localStorage.getItem("accessToken")
          ? window.atob(localStorage.getItem("accessToken"))
          : "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          dispatch({
            type: DELETE_SERVICES,
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
            payload: data,
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