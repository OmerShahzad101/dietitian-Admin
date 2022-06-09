import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeEmail, getEmails,updateEmail } from './EmailTemplates.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SweetAlert from 'react-bootstrap-sweetalert';

const EmailTemplates = (props) => {
    const [emails, setEmails] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [editShow, setEditShow] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [errors, setErrors] = useState(false)
    const [delModalCheck, setDelModalCheck] = useState(false);
    const [enable, setEnable] = useState(false);
    const [status, setStatus] = useState(false);

    useEffect(() => {
        window.scroll(0, 0)
        props.getEmails()

    }, [])

    useEffect(() => {
        if (props.email.getAuth) {
            const { emails, pagination } = props.email
            setEmails(emails)
            setPagination(pagination)
            props.beforeEmail()
        }
    }, [props.email.getAuth])

    useEffect(() => {
        if (props?.email?.updateAuth) {
            const email = props?.email?.updatedemail
             setEmails( emails.map((item) => {
                    if (item._id === email._id) {
                        item.type = email.type;
                        item.subject = email.subject;
                        item.text = email.text;
                    }
                    return (item)
                })
            )
            props.beforeEmail()
            setLoader(false)
        }
    }, [ props?.email?.updateAuth ])

    useEffect(() => {
        if (emails) {
            setLoader(false)
        }
    }, [emails])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    const onPageChange = async (page) => {
        setLoader(true)
        const qs = ENV.objectToQueryString({ page })
        props.getEmails(qs)
    }
                                
    const submitEdit = (e) => {
        e.preventDefault();
        props.updateEmail(editForm)
        setEditShow(false)
        props.history.push("/email-templates")
    }
    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        <Row>
                            <Col md="12">
                                <Card.Header className='mb-5 head-grid card-header'>
                                    <Card.Title as="h4">Email Templates</Card.Title>
                                </Card.Header>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-hover table-striped w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center">#</th>
                                                        <th>Type</th>
                                                        <th>Subject</th>
                                                        <th>Text</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        emails && emails.length ?
                                                            emails.map((email, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="td-name">
                                                                            {email.type}
                                                                        </td>
                                                                        <td className="td-name">
                                                                            {email.subject}
                                                                        </td>
                                                                        <td className="td-name">
                                                                            <div className='url-click-link' dangerouslySetInnerHTML = {{ __html: email?.text}}/>
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <div className="d-flex">
                                                                                <OverlayTrigger
                                                                                    overlay={
                                                                                        <Tooltip id="tooltip-436082023">
                                                                                            Edit
                                                                                        </Tooltip>
                                                                                    }
                                                                                    placement="left"
                                                                                >
                                                                                    <Button
                                                                                        className="btn-link btn-icon"
                                                                                        type="button"
                                                                                        variant="success"
                                                                                        onClick={() => {
                                                                                            setEditForm({...editForm, ...email })
                                                                                            setEditShow(true)
                                                                                        }}
                                                                                    >
                                                                                        <i className="fas fa-edit"></i>
                                                                                    </Button>
                                                                                </OverlayTrigger>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="4" className="text-center">
                                                                    <span className="no-data-found d-block">No Emails found</span>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                        </div>
                                        {
                                            pagination &&
                                            <Pagination
                                                className="m-3"
                                                defaultCurrent={1}
                                                pageSize // items per page
                                                current={pagination.page} // current active page
                                                total={pagination.pages} // total pages
                                                onChange={onPageChange}
                                                locale={localeInfo}
                                            />
                                        }
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
            }
            {
                editShow && <Modal show={editShow} onHide={() => { setEditShow(false), setLoader(false) }}>
                    <Form onSubmit={(e) => { submitEdit(e) }}>
                        <Modal.Header closeButton>
                            <Modal.Title className="yellow-color">Email Template</Modal.Title>
                            { status===true ? 
                                    <div class="alert alert-warning">
                                    <strong>Be Sure!</strong>Avoid special characters like $(XYZ),etc &  do not delete all content
                                    </div>
                                : ""
                            }
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="switch-wrapper mb-3">
                                <Form.Label>
                                   Enable Editing
                                </Form.Label>
                                <label className="switch">
                                    <input type="checkbox" name="status" checked={status ? true : false} onChange={(e) => {
                                    setStatus( e.target.checked ) 
                                    }} />
                                    {console.log(`status`, status)}
                                    <span className="slider round"></span>
                                </label>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                   Type
                                </Form.Label>
                                <Form.Control type="text" placeholder="Enter name" name="name" value={editForm.type} onChange={(e) => { setEditForm({ ...editForm, username: e.target.value }) }} disabled/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                   Subject
                                </Form.Label>
                                <Form.Control type="text" placeholder="Enter Email" name="email" value={editForm.subject} onChange={(e) => { setEditForm({ ...editForm, email: e.target.value }) }} disabled/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Text
                                </Form.Label>
                                    {
                                        status === true ?  
                                        <CKEditor
                                            data={editForm?.text}
                                            text={editForm?.text}
                                            onReady={editor => {
                                                const data = editor.getData();
                                                setEditForm({ ...editForm, text: data })
                                            }}
                                            onChange={(event, editor) => {
                                            
                                                const data = editor.getData()
                                                setEditForm({ ...editForm, text: data })
                                            }}
                                            onBlur={(event, editor) => {
                                            }}
                                            onFocus={(event, editor) => {
                                            }}
                                            editor={ClassicEditor}
                                        />
                                        :
                                            ""
                                }
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={(e) => { setEditShow(false), setLoader(false) }}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" className="yellow-bg">
                                Update Changes
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            }
        </>
    )
}
const mapStateToProps = state => ({
    email: state.email,
    error: state.error
});
export default connect(mapStateToProps, { beforeEmail, getEmails, updateEmail })(EmailTemplates);