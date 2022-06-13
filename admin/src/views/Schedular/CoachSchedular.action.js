import { toast } from 'react-toastify';
import { GET_ERRORS,CREATE_SCHEDULAR, BEFORE_SCHEDULAR, GET_SCHEDULAR, UPDATE_SCHEDULAR} from "redux/types";
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeSchedluar = () => {
    return {
        type: BEFORE_SCHEDULAR
    }
}

//create
export const createCoachSchedular = (obj) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}schedular/create`;
    fetch(url, {
        method: "POST",
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': (localStorage.getItem('accessToken') ? window.atob(localStorage.getItem('accessToken')) : ''),
            "Content-Type": "application/json",
        },
        body:  JSON.stringify(obj)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: CREATE_SCHEDULAR,
                payload: data.coachSchedules
            })
        } 
        else {
            if (data.userDisabled) {
                window.location.href = '/admin/login'
                localStorage.removeItem("accessToken");
                localStorage.removeItem("adminId");
                localStorage.removeItem("encuse");
            }
            toast.error(data.message)
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

//list 
export const getCoachSchedular = (coachId = '') => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}schedular/get/${coachId}`;
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
            toast.success(data.message);
            dispatch({
                type: GET_SCHEDULAR,
                payload: data.coachSchedules
            })
        } else {
            if (data.userDisabled) {
                window.location.href = '/admin/login'
                localStorage.removeItem("accessToken");
                localStorage.removeItem("adminId");
                localStorage.removeItem("encuse");
            }
            toast.error(data.message)
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

export const updateSchedule = (obj) => (dispatch) => {
    dispatch(emptyError());
    const url = `${ENV.url}schedular/edit`;
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
            type: UPDATE_SCHEDULAR,
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