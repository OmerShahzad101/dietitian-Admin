import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { beforeAdmin, login } from '../Admin/Admin.action'
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { NavLink } from "react-router-dom";
// import logoLogin from "assets/img/banner-logo.png";
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import  {ENV}  from 'config/config';
import RedirectPath from '../RedirectPath/RedirectPath';


// react-bootstrap components
import { Badge, Button, Card, Form, Navbar, Nav, Container, Col } from "react-bootstrap";

function Login(props) {
    const [user, setUser] = useState({ email: '', password: '' })
    const [loader, setLoader] = useState(false)
    
    useEffect(() => {
        toast.dismiss();
        window.scroll(0, 0);
        props.beforeAdmin()
    }, [])

    // when response from login is received
    useEffect(() => {
        if ( props?.admin?.loginAdminAuth) {
            const result = RedirectPath()
            setLoader(false)
            props.history.push(result)
        }
    }, [props?.admin?.loginAdminAuth, props?.admin?.admin])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    const onChange = (e) => {
        let { name, value } = e.target
        let data = user
        data[name] = value
        setUser({ ...data })
    }
    const submit = async () => {
        if (user.email && user.password) {
            setLoader(true)
            props.login(user)
        }
    }
    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <div
                        className="full-page section-image"
                        // data-color="pink"
                        data-image={require("assets/img/bg.png").default}
                    >
                        <div className="content d-flex align-items-center p-0">
                            <Container>
                                <Col className="mx-auto" lg="4" md="8">
                                </Col>
                                <Col className="mx-auto" lg="5" md="8">
                                    <Form action="" className="form" method="">
                                        <Card className="card-login">
                                        <div className='text-center mb-4'>
                                       <div className=''>
                                       <img className='img-fluid'
                                            src={require("assets/img/favicon.png").default}
                                            alt="Dietitian Your Way"
                                        />
                                       </div>
                                    </div>
                                            <h3 className="header text-center m-0">Login</h3>
                                            <Card.Body>
                                                <Card.Body>
                                                    <Form.Group>
                                                        <label>Email address <span className="text-danger">*</span></label>
                                                        <Form.Control
                                                            placeholder="Enter email"
                                                            type="email"
                                                            name="email"
                                                            onChange={(e) => onChange(e)}
                                                            defaultValue={user.email}
                                                            required
                                                        />
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <label>Password <span className="text-danger">*</span></label>
                                                        <Form.Control
                                                            placeholder="Enter Password"
                                                            type="password"
                                                            name="password"
                                                            onChange={(e) => onChange(e)}
                                                            defaultValue={user.password}
                                                            required
                                                        />
                                                    </Form.Group>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <Form.Check className="pl-0">
                                                        </Form.Check>
                                                        <NavLink to="/forgotpassword" className="btn-no-bg" type="submit" variant="warning">
                                                            Forget Password ?
                                                        </NavLink>
                                                    </div>
                                                </Card.Body>
                                            </Card.Body>
                                            <Card.Footer className="ml-auto mr-auto">
                                                <Button className="btn-wd" type="submit" variant="warning"
                                                    disabled={loader} onClick={() => submit()}
                                                >
                                                    Login
                                                </Button>
                                            </Card.Footer>
                                        </Card>
                                    </Form>
                                </Col>
                            </Container>
                        </div>
                        <div
                            className="full-page-background"
                        ></div>
                    </div>
            }
        </>
    );
}
const mapStateToProps = state => ({
    admin: state.admin,
    error: state.error
});

export default connect(mapStateToProps, { beforeAdmin, login })(Login);