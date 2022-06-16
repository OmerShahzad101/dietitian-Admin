import { toast } from 'react-toastify';
import { GET_ERRORS, CREATE_CATEGORY, BEFORE_CATEGORY, LIST_CATEGORY , GET_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY} from "redux/types";
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from '../../config/config';

export const beforeCategory = () => {
    return {
        type: BEFORE_CATEGORY
    }
}
export const createCategory = (obj, qs = null) => (dispatch) => {
    dispatch(emptyError());
    let url = `${ENV.url}category/create`;
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
            type: CREATE_CATEGORY,
            payload: data.savedCategory,
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

export const listCategory = (qs = null) => (dispatch) => {
    dispatch(emptyError());
    let url = `${ENV.url}category/list`;
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
            type: LIST_CATEGORY,
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

export const getCategory = (categoryId = '') => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}category/get/${categoryId}`;

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
                type: GET_CATEGORY,
                payload: data.category
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

export const updateCategory = (obj) => (dispatch) => {
    dispatch(emptyError());
    const url = `${ENV.url}category/edit`;
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
            type: UPDATE_CATEGORY,
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
export const deleteCategory = (id) => (dispatch) => {
    dispatch(emptyError());
    const url = `${ENV.url}category/delete/${id}`;
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
            type: DELETE_CATEGORY,
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