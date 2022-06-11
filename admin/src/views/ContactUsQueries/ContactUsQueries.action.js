import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_CONTACT, GET_CONTACTS, EDIT_CONTACT } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeContact = () => {
    return {
        type: BEFORE_CONTACT
    }
}

export const getContacts = (qs = null) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}contacts/list`;
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
            if (!qs)
                toast.success(data.message)
            dispatch({
                type: GET_CONTACTS,
                payload: data.data
            })
        } else {
            if (data.userDisabled) {
                window.location.href = '/admin/login'
                localStorage.removeItem("accessToken");
                localStorage.removeItem("adminId");
                localStorage.removeItem("encuse");
            }
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


export const updateContact = (body) => dispatch => {
    dispatch(emptyError());
    const data = new FormData();
    data.append("_id", body._id);
    data.append("status", body.status);
    const url = `${ENV.url}contacts/edit`;
    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': (localStorage.getItem('accessToken') ? window.atob(localStorage.getItem('accessToken')) : '')
        },
        body: data
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: EDIT_CONTACT,
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