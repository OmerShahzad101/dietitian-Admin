import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_MEMBERSHIP, CREATE_MEMBERSHIP, MEMBERSHIP_LIST, GET_MEMBERSHIP, UPDATE_MEMBERSHIP, DELETE_MEMBERSHIP} from "redux/types";
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeMembership = () => {
    return {
        type: BEFORE_MEMBERSHIP
    }
}

//create
export const createMembership = (obj) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}membermembership/create`;
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
                type: CREATE_MEMBERSHIP,
                payload: data.memberMemberships
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

//get
export const getMembership = (membershipId = '') => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}membermembership/get/${membershipId}`;

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
                type: GET_MEMBERSHIP,
                payload: data.Usermembership
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

//list
export const listMemberships= (qs = null, calledFunction) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}membermembership/list`;
    if (qs)
        url += `?${qs}`
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
            if ( !qs && !calledFunction ) toast.success(data.message);
            dispatch({
                type: MEMBERSHIP_LIST,
                payload: data.data
            })
        } else {
            if (data.userDisabled) {
                window.location.href = '/admin/login'
                localStorage.removeItem("accessToken");
                localStorage.removeItem("adminId");
                localStorage.removeItem("encuse");
            }
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

//update
export const updateMembership = (obj, method = 'PUT') => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}membermembership/edit`;
    fetch(url, {
        method,
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
                type: UPDATE_MEMBERSHIP,
                payload: data
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

//delete
export const deleteMembership = (id) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}membermembership/delete/${id}`;
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': (localStorage.getItem('accessToken') ? window.atob(localStorage.getItem('accessToken')) : '')
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: DELETE_MEMBERSHIP,
                payload: data
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