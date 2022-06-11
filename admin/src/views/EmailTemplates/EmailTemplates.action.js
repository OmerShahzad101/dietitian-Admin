import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_EMAIL, GET_EMAILS, UPDATE_EMAIL, GET_EMAIL } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeEmail = () => {
    return {
        type: BEFORE_EMAIL
    }
}

export const getEmails = (qs = null) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}email/list`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            if (!qs)
                toast.success(data.message)
            dispatch({
                type: GET_EMAILS,
                payload: data.data
            })
        } else {
            if (!qs)
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

export const getEmail = (emailId, qs = null) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}email/get/${emailId}`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: GET_EMAIL,
                payload: data
            })
        } else {
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

export const updateEmail = (obj) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}email/edit`;

    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj)
    }).then(res => res.json()).then(data => {
        debugger
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: UPDATE_EMAIL,
                payload: data.email
            })
        } else {
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
