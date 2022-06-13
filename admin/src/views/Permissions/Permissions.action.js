import { toast } from "react-toastify";
import {
    BEFORE_PERMISSION,
    CREATE_PERMISSION,
    GET_PERMISSION,
    UPDATE_PERMISSION ,
    DELETE_PERMISSION,
    GET_ERRORS
} from "../../redux/types";
import { emptyError } from "../../redux/shared/error/error.action";
import { ENV } from "./../../config/config";

export const beforePremission = () => {
  return {
    type: BEFORE_PERMISSION,
  };
};

export const addPermission = (obj, qs = null) => (dispatch) => {

  dispatch(emptyError());
  let url = `${ENV.url}permissions/create`;
  if (qs) url += `?${qs}`;
  fetch(url, {
    method: "POST",
    headers: {
      Authorization: ENV.Authorization,
      "x-auth-token": ENV.x_auth_token,
      "x-access-token": localStorage.getItem("accessToken")
        ? window.atob(localStorage.getItem("accessToken"))
        : "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
  .then((res) => res.json()).then((data) => {
    if (data.success) {
      toast.success(data.message);
      dispatch({
        type: CREATE_PERMISSION,
        payload: data.permissions,
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

export const getpermissions = (qs=null, calledFunction) => dispatch => {
  dispatch(emptyError());
  let url = `${ENV.url}permissions/list`;
  let xyz;
  if (qs && qs != false)
    url += `?${qs}`;
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
      if (!qs && !calledFunction ) toast.success(data.message);
      dispatch({
        type: GET_PERMISSION,
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

export const updatePermissions = (obj) => (dispatch) => {
  dispatch(emptyError());
  const url = `${ENV.url}permissions/edit`;
  fetch(url, {
    method: "PUT",
    headers: {
      Authorization: ENV.Authorization,
      "x-auth-token": ENV.x_auth_token,
      "x-access-token": localStorage.getItem("accessToken")
        ? window.atob(localStorage.getItem("accessToken"))
        : "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
  .then((res) => res.json()).then((data) => {
    if (data.success) {
      toast.success(data.message);
      dispatch({
        type: UPDATE_PERMISSION,
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

export const deletePermission = (id) => (dispatch) => {
  dispatch(emptyError());
  const url = `${ENV.url}permissions/delete/${id}`;
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
        type: DELETE_PERMISSION,
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
  