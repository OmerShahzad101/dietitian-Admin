import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { getContacts, beforeContact, updateContact } from './ContactUsQueries.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { useHistory, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

const ContactUsQueries = (props) => {
    const history = useHistory();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search);
    const [queries, setQueries] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [editShow, setEditShow] = useState(false);
    const [formValues, setFormValues] = useState();
    const [filterCheck, setFilterCheck] = useState(false);
    const [filterMsgCheck, setFilterMsgCheck] = useState(false);
    const [filters, setFilters] = useState({
        email: searchQuery.get("email"),
        status: searchQuery.get("status"),
        name: searchQuery.get("name")
    });

    useEffect(() => {
        toast.dismiss();
        window.scroll(0, 0)
    }, [])

    useEffect(() => {
        if (props.query.getQueries) {
            const { queries, pagination } = props.query
            setQueries(queries)
            setPagination(pagination)
            props.beforeContact()
        }
    }, [props.query.getQueries])

    useEffect(() => {
        if (props.query.changed)
            setFilters({
                name: null, status: null, email: null
            })
    }, [props.query.changed])

    useEffect(() => {
        if (queries) {
            setLoader(false)
        }
    }, [queries])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    useEffect(() => {
        onPageChange(1);
    }, [filters])

    const handleEditClose = () => setEditShow(false);

    const handleEditShow = () => setEditShow(true);

    const onPageChange = async (page) => {
        const params = {};
        if (filters.name)
            params.name = filters.name;
        if (filters.status !== null)
            params.status = filters.status;
        if (filters.email)
            params.email = filters.email;
        setLoader(true);
        const qs = ENV.objectToQueryString({ ...params, page });
        props.getContacts(qs);
        history.replace({
            pathname: location.pathname, search: ENV.objectToQueryString(params)
        });
    }

    const handleEditContact = (e) => {
        e.preventDefault();
        setLoader(true);
        props.updateContact(formValues);
        handleEditClose();
    }

    const handleOnStatusChange = (e) => {
        setFormValues({ ...formValues, status: parseInt(e.target.value) });
    }

    const rendFilters = () => {
        if (filterCheck) {
            return (
                <Form className="row mt-4" onSubmit={(e) => {
                    e.preventDefault();
                    const name = document.getElementById("searchName").value.trim();
                    const email = document.getElementById("searchEmail").value.trim();
                    const status = document.getElementById("selectQueryStatus").value;

                    const obj = { ...filters };

                    if (name)
                        obj.name = name;
                    else
                        obj.name = null;
                    if (email)
                        obj.email = email;
                    else
                        obj.email = null;
                    if (status !== "null")
                        obj.status = parseInt(status);
                    else
                        obj.status = null;

                    if (obj.name || obj.email || obj.status) {
                        setFilterMsgCheck(false)
                        setFilters(obj);
                    }
                    else {
                        setFilterMsgCheck(true)
                    }
                }}>
                    <div className="col-md-3">
                        <label htmlFor="searchName">Name</label>
                        <input id="searchName" type="text" className="form-control" placeholder="Enter Name..." defaultValue={filters.name} />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="searchEmail">Email</label>
                        <input id="searchEmail" type="text" className="form-control" placeholder="Enter Email..." defaultValue={filters.email} />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="selectQueryStatus">Status</label>
                        <select id="selectQueryStatus" className="form-control form-select mb-3" aria-label="Default select example">
                            <option value="null" selected={!filters.status ? true : false}>-- Select Status --</option>
                            <option value="1" selected={filters.status === 1 ? true : false}>Pending</option>
                            <option value="2" selected={filters.status === 2 ? true : false}>In progress</option>
                            <option value="3" selected={filters.status === 3 ? true : false}>Closed</option>
                        </select>
                    </div>
                    <div className="col-md-3 d-flex justify-content-end align-items-end p-0">
                        {(filters.email || filters.status || filters.name) && <button className="btn btn-info mr-3 btn-warning" type="button" onClick={() => {
                            setFilters({
                                email: null, status: null, name: null
                            })
                        }} >Reset Filters</button>}
                        <button className="btn blue-bg" type="submit" >Apply Filters</button>
                    </div>
                    <div className="col-md-12">
                        <span className={filterMsgCheck ? `` : `d-none`}>
                            <label className="pt-3 text-danger">Please fill a filter field to perform filteration</label>
                        </span>
                    </div>
                </Form>
            )
        }
    }

    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        <Row>
                            <Col md={12}>
                                <Card.Header className='mb-5 head-grid'>
                                    <div className='d-block  d-sm-flex justify-content-between align-items-center'>
                                        {/* <Card.Title as="h4">Contact Us Queries</Card.Title> */}
                                        <Card.Title as="h4">Filter</Card.Title>
                                        <Button onClick={() => { setFilterCheck(!filterCheck); setFilterMsgCheck(false); }} className="yellow-bg m-0">
                                            <span>
                                                Filters
                                            </span>
                                            <span className="pl-1">
                                                <FontAwesomeIcon icon={faFilter} />
                                            </span>
                                        </Button>
                                    </div>
                                    <div>
                                        <div className='container-fluid'>
                                            {rendFilters()}
                                        </div>
                                    </div>
                                </Card.Header>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Body className="table-full-width">
                                        <div className='d-block  d-sm-flex justify-content-between align-items-center add-categories '>
                                            <Card.Title as="h4">Contact Us</Card.Title>
                                        </div>
                                        <div className=' table-responsive'>
                                            <Table className="table-striped w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center td-start">#</th>
                                                        <th className="td-name">Name</th>
                                                        <th className="td-email">Email</th>
                                                        <th className="td-subject">Subject</th>
                                                        <th className="td-description">Message</th>
                                                        <th className="td-status">Status</th>
                                                        <th className="td-actions">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        queries && queries.length ?
                                                            queries.map((query, index) => {
                                                                let status;
                                                                if (query?.status === 0)
                                                                    status = "In Progress";
                                                                else if (query?.status === 1)
                                                                    status = "Pending";
                                                                else if (query?.status === 2)
                                                                    status = "Closed";
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center td-start">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>

                                                                        <td className="td-name">
                                                                            {query?.name}
                                                                        </td>
                                                                        <td className="td-email">
                                                                            {query?.email}
                                                                        </td>
                                                                        <td className="td-subject">
                                                                            {query?.subject}
                                                                        </td>
                                                                        <td className="td-description">
                                                                            {query?.message}
                                                                        </td>
                                                                        <td className="td-status">
                                                                            <span className={`p-1 status  ${query.status === 1 ? "bg-danger" : query.status === 2 ? "bg-warning" : query.status === 3 ? "bg-success" : ""}`}>
                                                                                {query.status === 1 ? "Pending" : query.status === 2 ? "In Progress" : query.status === 3 ? "Closed" : ""}
                                                                            </span>
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <div className="d-flex">
                                                                                <OverlayTrigger
                                                                                    overlay={
                                                                                        <Tooltip id="tooltip-436082023">
                                                                                            Edit
                                                                                        </Tooltip>
                                                                                    }
                                                                                // placement="left"
                                                                                >
                                                                                    <Button
                                                                                        className="btn-link btn-xs"
                                                                                        type="button"
                                                                                        variant="warning"
                                                                                        onClick={() => {
                                                                                            const obj = {};
                                                                                            for (let key in query) {
                                                                                                obj[key] = query[key];
                                                                                            }
                                                                                            setFormValues(obj);
                                                                                            handleEditShow();
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
                                                                <td colSpan="7" className="text-center">
                                                                    <span className="no-data-found d-block">No queries found</span>
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
                editShow && <Modal show={editShow} onHide={handleEditClose}>
                    <Form onSubmit={handleEditContact}>
                        <Modal.Header closeButton>
                            <Modal.Title className='yellow-color'>Update Query Status</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" value={formValues?.name} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="text" value={formValues?.email} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Subject</Form.Label>
                                <Form.Control type="text" value={formValues?.subject} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Message</Form.Label>
                                <Form.Control type="text" value={formValues?.message} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <label className="d-block">Status</label>
                                <div className="d-flex flex-wrap">
                                    <div className="mr-3" style={{ display: "flex", alignItems: "center" }}>
                                        <input
                                            className="mr-1"
                                            type="radio"
                                            name="status"
                                            value={1}
                                            onClick={handleOnStatusChange}
                                            checked={formValues?.status === 1 ? true : false}
                                        />
                                        <label>Pending</label>
                                    </div>
                                    <div className="mr-3" style={{ display: "flex", alignItems: "center" }}>
                                        <input
                                            className="mr-1"
                                            type="radio"
                                            name="status"
                                            value={2}
                                            onClick={handleOnStatusChange}
                                            checked={formValues?.status === 2 ? true : false}
                                        />
                                        <label>In Progress</label>
                                    </div>
                                    <div className="mr-3" style={{ display: "flex", alignItems: "center" }}>
                                        <input
                                            className="mr-1"
                                            type="radio"
                                            name="status"
                                            value={3}
                                            onClick={handleOnStatusChange}
                                            checked={formValues?.status === 3 ? true : false}
                                        />
                                        <label>Closed</label>
                                    </div>
                                </div>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={handleEditClose}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" className="yellow-bg">
                                Update
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            }
        </>
    )
}

const mapStateToProps = state => ({
    query: state.contactUsQueries,
    error: state.error
});

export default connect(mapStateToProps, { getContacts, beforeContact, updateContact })(ContactUsQueries);