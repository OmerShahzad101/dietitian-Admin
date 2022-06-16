import { toast } from "react-toastify";
import {
  CREATE_MEMBER,
  GET_ERRORS,
  BEFORE_MEMBER,
  GET_MEMBERS,
  UPSERT_MEMBER,
  DELETE_MEMBER,
} from "../../redux/types";
import { emptyError } from "../../redux/shared/error/error.action";
import { ENV } from "../../config/config";

export const beforeMember = () => {
  return {
    type: BEFORE_MEMBER,
  };
};

//////
export const createMember = (obj, qs = null) => (dispatch) => {

  dispatch(emptyError());
  let url = `${ENV.url}user/create`;
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
          type: CREATE_MEMBER,
          payload: data.savedUser,
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


export const getMembers = (qs = null) => (dispatch) => {
    dispatch(emptyError());
    let url = `${ENV.url}user/list`;
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
            type: GET_MEMBERS,
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

export const updateMember = (obj) => (dispatch) => {
  dispatch(emptyError());
  const url = `${ENV.url}user/edit`;
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
          type: UPSERT_MEMBER,
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

export const deleteMember = (id) => (dispatch) => {
  dispatch(emptyError());
  const url = `${ENV.url}user/delete/${id}`;
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
          type: DELETE_MEMBER,
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
