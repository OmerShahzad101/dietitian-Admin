import { CREATE_PRIVATE_ADMIN, GET_ERRORS} from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';
import { toast } from 'react-toastify';

export const createPrivateAdmin = (obj, qs = null) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}staff/private-admin`;
    if(qs){
        url += `?${qs}`;
    }
    fetch(url, {
        method: "POST",
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': (localStorage.getItem('accessToken') ? window.atob(localStorage.getItem('accessToken')) : ''),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            if (!qs) toast.success(data.message);
            dispatch({
                type: CREATE_PRIVATE_ADMIN,
                payload: data.admin
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