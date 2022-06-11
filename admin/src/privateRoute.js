import React from 'react';
import { Route } from "react-router-dom";
import RedirectPath from '../src/views/RedirectPath/RedirectPath';
import PermissionsArray from '../src/views/PermissionsArray/PermissionsArray'
import PathScanner from './HelpingFunctions/pathScanner';

export const PrivateRoute = ({ component: Component,showInSideBar, access, ...rest }) => (
    <Route
        {...rest}
        render={ props => 
            PermissionsArray().includes(props.location.pathname) === true || props.location.pathname === "/login" 
            || props.location.pathname === "/staff/private-admin" ||
            PermissionsArray().includes(PathScanner(props.location.pathname)) === true ?
            //  props.location.pathname ?
                (<Component {...props} />
                )
                :
                history.back() 
        }
    />
);
