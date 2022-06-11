import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { toast } from 'react-toastify';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { createPrivateAdmin } from './PrivateAdmin.action'

const PrivateAdmin = (props) => {
    const [delModalCheck, setDelModalCheck] = useState(false);
    const [errors, setErrors] = useState({});
    const [addForm, setAddForm] = useState({
        username: '',
        email: '',
        password: '',
        status:true,
        type: 2,
        privateKey:"",
    });

    useEffect(() => {
        toast.dismiss();
        window.scroll(0, 0);
    }, [])

    const submitAdd = (e) =>  {
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        e.preventDefault()
        if (addForm.username.trim() === '') {
            setErrors({ ...errors, username: 'username is required' })
        }
         else if (!addForm.email.trim() || regex.test(addForm.email) === false) {
            setErrors({ ...errors, email: "Valid Email is required" });
        } else if (addForm.password.trim() === '') {
            setErrors({ ...errors, password: "password is required" });
        } else if (addForm.privateKey.trim() === '') {
            setErrors({ ...errors, privateKey: "private key  is required" });
        } 
        else {
            if( ENV.privateKeys === addForm.privateKey){
                delete addForm['privateKey'];
                props.createPrivateAdmin(addForm)
                setAddForm({
                    username: '',
                    email: '',
                    password: '',
                    status: true,
                    type: 2,
                    privateKey:"",
                })
                props.history.push("/login")
            } else if (ENV.privateKeys !== addForm.privateKey) {
                setDelModalCheck(true)
            }
        }
    }
    return (
        <>
        <Container>
            <Form onSubmit={(e) => { submitAdd(e) }}>
                <span as="h4">Register</span>
                <Form.Group className="mb-3">
                    <Form.Label>
                        Name
                    </Form.Label>
                    <Form.Control  type="text" placeholder="John Smith" name="username" value={addForm.username} onChange={(e) => { setAddForm({ ...addForm, username: e.target.value }) }}/>
                    <span style={{ color: "red" }}>{addForm.username === '' ? errors["username"]: " " }</span>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>
                        Email
                    </Form.Label>
                    <Form.Control type="email" placeholder="johnsmith@gmail.com" name="email" value={addForm.email} onChange={(e) => { setAddForm({ ...addForm, email: e.target.value }) }} />
                    <span style={{ color: "red" }}>{addForm.email === '' ? errors["email"]: " " }</span>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>
                        Password
                    </Form.Label>
                    <Form.Control  type="Password"  name="password" value={addForm.password} onChange={(e) => { setAddForm({ ...addForm, password: e.target.value }) }} />
                    <span style={{ color: "red" }}>{addForm.password === '' ? errors["password"]: " " }</span>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>
                        Private Key
                    </Form.Label>
                    <Form.Control  type="Password"  name="password" value={addForm.privateKey} onChange={(e) => { setAddForm({ ...addForm, privateKey: e.target.value }) }} />
                    <span style={{ color: "red" }}>{addForm.privateKey === '' ? errors["privateKey"]: " " }</span>
                </Form.Group>
                <Form.Group className="switch-wrapper mb-3">
                    <Form.Label>
                        Status
                    </Form.Label>
                    <label className="switch">
                        <input type="checkbox" name="status" checked={addForm.status ? true : false} onChange={(e) => {
                            setAddForm({ ...addForm, status: e.target.checked })
                        }} />
                        <span className="slider round"></span>
                    </label>
                </Form.Group>
                <Button type="submit" className="yellow-bg">
                    Register
                </Button>
            </Form>
        </Container>
        {
        delModalCheck && (
          <Modal show={delModalCheck} onHide={() => props.history.push("/login")}>
            <Modal.Header closeButton>
              <Modal.Title className="yellow-color delete-tag mb-5">
                Warning X! You dont have permission to create Admin
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer className='d-flex justify-content-center'>
              <Button className="save-btn mr-3" variant="danger" onClick={() => props.history.push("/login")}>
                close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        </>
    )
}
const mapStateToProps = state => ({
    privateAdmin: state.privateAdmin,
    error: state.error
  });
export default connect(mapStateToProps, { createPrivateAdmin })(PrivateAdmin);