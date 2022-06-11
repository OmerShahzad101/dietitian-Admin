import React, { useState, useEffect } from 'react';
import RedirectPath from '../../src/views/RedirectPath/RedirectPath';

import { ENV } from './../config/config'
const Unauth = (props)=>{

//   useEffect(() => {
//     let adminData = ENV.getUserKeys();
//     if (adminData && adminData.email) {
//       props.history.push(RedirectPath())
//     }
// }, [])

  // componentDidMount() {
  //   let adminData = ENV.getUserKeys();
  //   if (adminData && adminData.email) {
  //     this.props.history.push('/dashboard')
  //   }
  // }
    return (
      <div className="wrapper login-wrapper">
        {props.children}
      </div>
    );
}
export default Unauth;