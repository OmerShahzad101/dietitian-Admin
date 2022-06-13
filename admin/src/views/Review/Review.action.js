import { toast } from 'react-toastify';
import { BEFORE_REVIEW, REVIEW_LIST, UPDATE_REVIEW, DELETE_REVIEW, GET_ERRORS } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeReview = () => {
    return {
        type: BEFORE_REVIEW
    }
}

export const listReview = (qs = null) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}review/list`;
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
            if (!qs) toast.success(data.message);
            dispatch({
                type: REVIEW_LIST,
                payload: data.data
            })
        } else {
            if (data.userDisabled) {
                window.location.href = '/admin/login'
                localStorage.removeItem("accessToken");
                localStorage.removeItem("adminId");
                localStorage.removeItem("encuse");
            }
            if (!qs) toast.error(data.message);
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

export const updateReview = (obj, method = 'PUT') => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}review/edit`;
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
                type: UPDATE_REVIEW,
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

export const deleteReview = (id) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}review/delete/${id}`;
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
                type: DELETE_REVIEW,
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