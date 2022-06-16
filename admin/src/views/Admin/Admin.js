import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { getUserKeys } from '../../config/config'
import { beforeAdmin, listAdmin, createAdmin, updateAdmin, deleteAdmin} from './Admin.action';
import {getpermissions} from '../Permissions/Permissions.action'
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import imagePlaceholder from "assets/img/placeholder.png";
import { useHistory, useLocation } from 'react-router';
import moment from "moment";
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import Select from "react-dropdown-select";

const AdminUser = (props) => {
    var calledFunction = true;
    const history = useHistory();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search);
    const [users, setUsers] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [loader, setLoader] = useState(true);
    const [editShow, setEditShow] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [addShow, setAddShow] = useState(false);
    const [userAuthenticData, setUserAuthenticData] = useState(null)
    const [addForm, setAddForm] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '123456789',
        profileImage: '',
        status: true,
        type: 2,
        permissionId:'',
    });
    const [pic, setPic] = useState({
        image: ''
    });
    const [delModalCheck, setDelModalCheck] = useState(false);
    const [delId, selDelId] = useState(null);
    const [filterCheck, setFilterCheck] = useState(false);
    const [filterMsgCheck, setFilterMsgCheck] = useState(false);
    const [filters, setFilters] = useState({
        name: searchQuery.get("name"),
        email: searchQuery.get("email"),
        address: searchQuery.get("address"),
        statusValue:searchQuery.get("statusValue"),
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        toast.dismiss();
        props.beforeAdmin()
        window.scroll(0, 0);
        props.listAdmin();
        props.getpermissions(calledFunction);
    }, [])

    useEffect(() => {
        if (props.admin.adminListAuth) {
            const { adminList, pagination } = props.admin
            setUsers(adminList)
            setPagination(pagination)
            setErrors({})
            setLoader(false);  
        }
    }, [props.admin.adminListAuth, props.admin.adminList])

    useEffect(() => {
        if (users) {
            setLoader(false)
        }
    }, [users])

    useEffect(() => {
        if (ENV.getUserKeys("encuse")) {
          let obj = ENV.getUserKeys();
          setUserAuthenticData(obj)
        }
      }, [])
    
    useEffect(() => {
        if (userAuthenticData) {
            setLoader(false)
        }
    }, [userAuthenticData])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false);
            setErrors({});
    }, [props.error.error])

    useEffect(() => {
        onPageChange(1);
    }, [filters, props.admin.delAdminAuth])

    useEffect(() => {
        if (props.admin.updateAdminAuth) {
            const admin = props.admin.admin
             setUsers( users.map((item) => {
                    if (item._id === admin._id) {
                        if (admin.username)
                            item.username = admin.username;
                        if (admin.profileImage)
                            item.profileImage = admin.profileImage;
                        if (admin.email)
                            item.email = admin.email;
                        if (admin.address)
                            item.address = admin.address;
                        if (admin.status !== undefined)
                            item.status = admin.status;
                        item["permissionData"] = admin.permissionData
                    }
                    return (item)
                })
            )
            props.beforeAdmin()
            setLoader(false)
        }
    }, [ props.admin.updateAdminAuth ])

    useEffect(() => {
        if (props.admin.delAdminAuth) {
            const { success } = props.admin.delAdmin
            if (success) {
                props.beforeAdmin()
                setUsers(
                    users.filter((item) => {
                        if (item._id !== delId) {
                            return (item)
                        }
                    })
                )
            }
            setLoader(false)
        }
    }, [props.admin.delAdminAuth])

    const onPageChange = async (page) => {
        const params = {};
        if (filters.name)
            params.name = filters.name;
        if (filters.email)
            params.email = filters.email;
        if (filters.address)
            params.address = filters.address;
        if (filters.statusValue)
            params.statusValue = filters.statusValue;    
        setLoader(true);
        const qs = ENV.objectToQueryString({ ...params, page });
        props.listAdmin(qs);
        history.replace({
            pathname: location.pathname, search: ENV.objectToQueryString(params)
        });
    }
    const handlePhotoChange = (event) => {
        const file = event.target.files;
        if (file.length === 0) {
            setEditForm({ ...editForm, profileImage: null });
        } else if (checkMimeType(event)) {
            setEditForm({ ...editForm, profileImage: file[0] });
        } else {
            setEditForm({ ...editForm, profileImage: null });
            toast.error("Unsuccessful in choosing image file");
        }
    };
    const handleAddPhotoChange = (event) => {
        const file = event.target.files;
        if (file.length === 0) {
            setAddForm({ ...addForm, profileImage: '' });
        } else if (checkMimeType(event)) {
            let reader = new FileReader();
            reader.readAsDataURL(file[0])
            reader.onloadend = function () {
                setPic({ image: reader.result })
            }
            setAddForm({ ...addForm, profileImage: file[0] })
        } else {
            setAddForm({ ...addForm, profileImage: '' });
            toast.error("Unsuccessful in choosing image file");
        }
    };

    const checkMimeType = (event) => {
        //getting file object
        let file = event.target.files;
        //define message container
        let err = "";
        // list allow mime type
        const types = ["image/png", "image/jpg", "image/jpeg", "image/svg", "image/gif"];

        // compare file type find doesn't matach
        if (types.every((type) => file[0].type !== type)) {
            // create error message and assign to container
            err = file[0].type + " is not a supported format";
        }

        if (err !== "") {
            // if message not same old that mean has error
            event.target.value = null; // discard selected file
            console.log(err);
            return false;
        }
        return true;
    };

    const submitEdit = (e) => {
        e.preventDefault()
        let formData = new FormData()
        for (const key in editForm)
            formData.append(key, editForm[key])
        props.updateAdmin(formData)
        setEditShow(false)
        setLoader(false)
    }

    const submitAdd = (e) => {
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        e.preventDefault()
        if (addForm.username.trim() === '') {
            setErrors({ ...errors, username: 'username is required' })
        }
         else if (!addForm.email.trim() || regex.test(addForm.email) === false) {
            setErrors({ ...errors, email: "Valid Email is required" });
        } else if (addForm.password.trim() === '') {
            setErrors({ ...errors, password: "password is required" });
        }  else if (addForm.permissionId === '') {
            setErrors({...errors, permissionId: " permission is required" })
        } else if (addForm.phone.trim() === '') {
            setErrors({ ...errors, phone: "phone  is required" });
        }
         else {
            let formData = new FormData()
            for (const key in addForm)
                formData.append(key, addForm[key])
            props.createAdmin(formData)
            setAddShow(false)
            setAddForm({
                username: '',
                email: '',
                password: '',
                phone: '',
                address: '123456789',
                profileImage: '',
                status: true,
                type: 2,
                permissionId:'',
            })
            setErrors({});

            setPic({ image: '' })
        }
    }
    const delUser = () => {
        setDelModalCheck(false)
        props.deleteAdmin(delId)
        setLoader(true)
    }
    const rendFilters = () => {
        if (filterCheck) {
            return (
                <Form className="row mt-4" onSubmit={(e) => {
                    e.preventDefault();
                    const name = document.getElementById("searchName").value.trim();
                    const email = document.getElementById("searchEmail").value.trim();
                    const address = document.getElementById("searchAddress").value.trim();
                    var select = document.getElementById('memberStatus');
                    var statusValue = select.options[select.selectedIndex].value;
                    const obj = { ...filters };
                    if (name)
                        obj.name = name;
                    else
                        obj.name = null;
                    if (email)
                        obj.email = email;
                    else
                        obj.email = null;
                    if (address)
                        obj.address = address;
                    else
                        obj.address = null;
                    if (statusValue)
                        obj.statusValue = statusValue;
                    else
                        obj.statusValue = null;    
                    if (name || email || address || statusValue) {
                        setFilterMsgCheck(false)
                        setFilters(obj);
                    }
                    else {
                        setFilterMsgCheck(true)
                    }
                }}>
                    <div className="col-md-3 ">
                        <label htmlFor="searchName">Name</label>
                        <input id="searchName" type="text" className="form-control" placeholder="Enter name..." defaultValue={filters.name} />
                    </div>
                    <div className="col-md-3 ">
                        <label htmlFor="searchEmail">Email</label>
                        <input id="searchEmail" type="text" className="form-control" placeholder="Enter email..." defaultValue={filters.email} />
                    </div>
                    <div className="col-md-3 ">
                        <label htmlFor="searchAddress">Address</label>
                        <input id="searchAddress" type="text" className="form-control" placeholder="Enter address..." defaultValue={filters.address} />
                    </div>
                    <div className="col-md-3 ">
                    <label htmlFor="searchAddress">Status</label>
                        <select  class="form-control form-select" id = "memberStatus">
                            <option value={''}>Select Status</option>
                            <option value={'1'}>Active</option>
                            <option value={'0'}>InActive</option>
                        </select>
                    </div>
                    <div className="mt-4 ">
                        {( filters.name || filters.email || filters.address || filters.statusValue ) && <button className="btn btn-info mr-3 btn-warning" type="button" onClick={() => setFilters({
                            name: null, email: null, address: null, statusValue:null,
                        })} >Reset Filters</button>}
                        <button className="btn apply-filters blue-bg" type="submit" >Apply Filters</button>
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
                                <Card.Header className="mb-5 head-grid">
                                    <div className='d-block  d-sm-flex justify-content-between align-items-center'>
                                        <Card.Title as="h4">
                                            Filter
                                            {/* <Button onClick={() => { setAddShow(!addShow) }} className="yellow-bg m-0">
                                                <span>
                                                    Add Staff
                                                </span>
                                                <span className="pl-1">
                                                    <FontAwesomeIcon icon={faUserPlus} />
                                                </span>
                                            </Button> */}
                                        </Card.Title>

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
                                        <div className="d-block  d-sm-flex justify-content-between align-items-center add-categories">
                                            <Card.Title as="h4">Staff Management</Card.Title>
                                            {
                                                userAuthenticData?.permissionId?.staffCreate === true ? 
                                                <Button onClick={() => { setAddShow(!addShow) }} className="yellow-bg m-0" >
                                                <span>
                                                    ADD
                                                </span>
                                                <span className="pl-1">
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </span>
                                                </Button> : ""}
                                        </div>
                                        <div className=' table-responsive'>
                                            <Table className="table-striped table-hover w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center td-start">#</th>
                                                        <th className="td-image">Image</th>
                                                        <th className="td-name">USERNAME</th>
                                                        <th className="td-email">Email</th>
                                                        <th className="td-email">Role</th>
                                                        <th className="td-address">Address</th>
                                                        <th className="td-status">Status</th>
                                                        <th className="td-created">Created At</th>
                                                        {userAuthenticData?.permissionId?.staffEdit||userAuthenticData?.permissionId?.staffDelete?<th className="td-actions">Action</th>:""}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        users && users.length ?
                                                            users.map((user, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="td-start text-center">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="td-image">
                                                                            <div className="user-image">
                                                                             <img src={ !user.profileImage ? imagePlaceholder : `${ENV.Backend_Img_Url}${user.profileImage}`}
                                                                                alt="userImage"
                                                                                className="img-fluid" >
                                                                              </img> 
                                                                            </div>
                                                                        </td>
                                                                        <td className="td-name">
                                                                            {user?.username}
                                                                        </td>
                                                                        <td className="td-email">
                                                                            {user?.email}
                                                                        </td>
                                                                        <td className="td-email">
                                                                            {user?.permissionData?.title ? user?.permissionData?.title : "N/A"}
                                                                        </td>
                                                                        <td className="td-resident">
                                                                            {user?.address}
                                                                        </td>
                                                                        <td className="td-status">
                                                                            <span className={ `status p-1 ${user.status ? `bg-success` : `bg-danger`}`}>
                                                                                {user.status ? "active" : "inactive"}
                                                                            </span>
                                                                        </td>
                                                                        <td className="td-created">
                                                                            {user.createdAt ? moment(user.createdAt).format('DD-MM-YYYY HH:MM:SS') : 'N/A'}
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <div className='d-flex'>
                                                                                {
                                                                                    userAuthenticData?.permissionId?.staffEdit === true ? 
                                                                                    <OverlayTrigger
                                                                                    overlay={
                                                                                        <Tooltip id="tooltip-436082023">
                                                                                            Edit
                                                                                        </Tooltip>
                                                                                    }
                                                                                    >
                                                                                    <Button
                                                                                    className="btn-link btn-xs"
                                                                                    type="button"
                                                                                    variant="warning"
                                                                                    onClick={() => {
                                                                                        setEditForm({
                                                                                            ...editForm,
                                                                                            profileImage: user.profileImage,
                                                                                            username: user.username,
                                                                                            email: user.email,
                                                                                            phone: user.phone,
                                                                                            address: user.address,
                                                                                            status: user.status,
                                                                                            _id: user._id,
                                                                                            permissionId: user?.permissionData?._id ? user?.permissionData?._id : "" ,
                                                                                        })
                                                                                        setEditShow(true)
                                                                                        }}
                                                                                        >
                                                                                        <i className="fas fa-edit"></i>
                                                                                        </Button>
                                                                                    </OverlayTrigger> : ""}
                                                                                {
                                                                                    userAuthenticData?.permissionId?.staffDelete === true ? 
                                                                                    <OverlayTrigger
                                                                                    overlay={
                                                                                        <Tooltip id="tooltip-481441726">Remove</Tooltip>
                                                                                    }
                                                                                    >
                                                                                    <Button
                                                                                        className="btn-link btn-xs"
                                                                                        onClick={() => {
                                                                                            setDelModalCheck(true)
                                                                                            selDelId(user._id)
                                                                                        }}
                                                                                        variant="danger"
                                                                                    >
                                                                                        <i className="fas fa-times"></i>
                                                                                    </Button>
                                                                                    </OverlayTrigger> : ""}
                                                                            </div>

                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="9" className="text-center">
                                                                    <span className="no-data-found d-block">No Users found</span>
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
                editShow && <Modal show={editShow} onHide={() => { setEditShow(false) }}>
                    <Form onSubmit={(e) => { submitEdit(e) }}>
                        <Modal.Header closeButton>
                            <Modal.Title className="yellow-color">Update User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Username
                                </Form.Label>
                                <Form.Control type="text" placeholder="Enter name" name="name" value={editForm.username} onChange={(e) => { setEditForm({ ...editForm, username: e.target.value }) }} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Email
                                </Form.Label>
                                <Form.Control type="text" placeholder="Enter Email" name="email" value={editForm.email} onChange={(e) => { setEditForm({ ...editForm, email: e.target.value }) }} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Phone
                                </Form.Label>
                                <Form.Control type="text" placeholder="Phone" name="phone" value={editForm.phone} onChange={(e) => { setEditForm({ ...editForm, phone: e.target.value }) }} />
                            </Form.Group>
                            
                            <Form.Label>
                                    Select Role
                                </Form.Label>
                                <select className='form-control form-select' Value={editForm.permissionId} onChange={(e) => {
                                        setEditForm({ ...editForm,permissionId:e.target.value })
                                    }}>
                                        { props.permissions.permissions &&  props.permissions.permissions.length ?
                                            props.permissions.permissions.map(( data,i ) => {
                                            return (
                                                <option key={i} value={data?._id} selected={data?._id === editForm.permissionId ? 'selected' : ''} required>{data.title}</option>
                                            );
                                            })
                                            :
                                            "No permission found"
                                        }
                                </select>
                                 {/* <h6><span style={{ color: "red" }}>{editForm.permissionId === ''? errors["permissionId"] : ""}</span></h6> */}
                            <Form.Group className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" rows={3} name="description" value={editForm.address} onChange={(e) => { setEditForm({ ...editForm, address: e.target.value }) }} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Image</Form.Label>
                                <div className='mb-2'>
                                    <img src={editForm.profileImage ? typeof editForm.profileImage === 'string' ? `${ENV.Backend_Img_Url}${editForm.profileImage}` : URL.createObjectURL(editForm.profileImage) : imagePlaceholder} style={{ height: 100, width: 100, objectFit: "contain" }} />
                                </div>
                                <Form.Control type="file" onChange={handlePhotoChange} />
                            </Form.Group>
                            <Form.Group className="switch-wrapper mb-3">
                                <span className="d-block mb-2">Status</span>
                                <label className="switch">
                                    <input type="checkbox" name="status" checked={editForm.status ? true : false} onChange={(e) => {
                                        setEditForm({ ...editForm, status: e.target.checked })
                                    }} />
                                    <span className="slider round"></span>
                                </label>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={(e) => { setEditShow(false) }}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" className="yellow-bg">
                                Update Changes
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            }
            {
                addShow && <Modal show={addShow} onHide={() => { setAddShow(false) }}>
                    <Form onSubmit={(e) => { submitAdd(e) }}>
                        <Modal.Header closeButton>
                            <Modal.Title className="yellow-color">Add Admin User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Username
                                </Form.Label>
                                <Form.Control type="text" placeholder="Enter name" name="username" value={addForm.username} onChange={(e) => { setAddForm({ ...addForm, username: e.target.value }) }}/>
                                <span style={{ color: "red" }}>{addForm.username === '' ? errors["username"]: " " }</span>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Email
                                </Form.Label>
                                <Form.Control type="text" placeholder="Enter Email" name="email" value={addForm.email} onChange={(e) => { setAddForm({ ...addForm, email: e.target.value }) }} />
                                <span style={{ color: "red" }}>{addForm.email === '' ? errors["email"]: " " }</span>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Password
                                </Form.Label>
                                <Form.Control type="Password" placeholder="Password" name="password" value={addForm.password} onChange={(e) => { setAddForm({ ...addForm, password: e.target.value }) }} />
                                <span style={{ color: "red" }}>{addForm.password === '' ? errors["password"]: " " }</span>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Select Role
                                </Form.Label>
                                    <select className='form-control form-select' onChange={(e) => {
                                        setAddForm({ ...addForm,permissionId:e.target.value })
                                    }}>
                                        <option value={'622b3f7a57179a450496e901'}>Please Select</option>
                                        { props.permissions.permissions &&  props.permissions.permissions.length ?
                                            props.permissions.permissions.map((data,i) => {
                                            return (
                                                    <option key={i} value={data?._id} required>{data.title}</option>
                                                );
                                            })
                                            :
                                            "No permission founds"
                                        }
                                    </select>
                                <span style={{ color: "red" }}>{addForm.permissionId === ''? errors["permissionId"] : ""}</span>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Phone
                                </Form.Label>
                                <Form.Control type="text" placeholder="Phone" name="phone" value={addForm.phone} onChange={(e) => { setAddForm({ ...addForm, phone: e.target.value }) }} />
                                <span style={{ color: "red" }}>{addForm.phone === '' ? errors["phone"] : " "}</span>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" rows={3} name="address" value={addForm.address} onChange={(e) => { setAddForm({ ...addForm, address: e.target.value }) }} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Image</Form.Label>
                                <div className='mb-2'>
                                    <img src={pic.image ? pic.image : imagePlaceholder} style={{ height: 100, width: 100, objectFit: "contain" }} />
                                </div>
                                <Form.Control type="file" onChange={handleAddPhotoChange} />
                            </Form.Group>
                            <Form.Group className="switch-wrapper mb-3">
                                <span className="d-block mb-2">Status</span>
                                <label className="switch">
                                    <input type="checkbox" name="status" checked={addForm.status ? true : false} onChange={(e) => {
                                        setAddForm({ ...addForm, status: e.target.checked })
                                    }} />
                                    <span className="slider round"></span>
                                </label>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={(e) => { setAddShow(false) }}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" className="yellow-bg">
                                Add Admin User
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            }
            {
                delModalCheck && <Modal show={delModalCheck} onHide={() => setDelModalCheck(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title className='yellow-color delete-tag mb-5'>Are you sure you want to delete this user?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer className='d-flex justify-content-center'>
                        <Button className='save-btn mr-3' variant="danger" onClick={() => setDelModalCheck(false)}>
                            No
                        </Button>
                        <Button variant="primary" onClick={delUser} className="yellow-bg save-btn">
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    )
}
const mapStateToProps = state => ({
    admin: state.admin,
    error: state.error,
    permissions: state.permissions,

});
export default connect( mapStateToProps, { beforeAdmin, createAdmin, listAdmin, updateAdmin, deleteAdmin, getpermissions })(AdminUser);