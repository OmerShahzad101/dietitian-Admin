import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import moment from "moment";
import { beforePremission, addPermission, getpermissions, updatePermissions, deletePermission } from './Permissions.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { useHistory, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons'

const Permissions = (props) => {
  const history = useHistory();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);
  const [viewPerm, setviewPerm] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [loader, setLoader] = useState(false)
  const [addShow, setaddShow] = useState(false);
  const [editshow, setEditShow] = useState(false);
  const [delModalCheck, setDelModalCheck] = useState(false);
  const [delId, setDelId] = useState(null);
  const [filterCheck, setFilterCheck] = useState(false);
  const [filterMsgCheck, setFilterMsgCheck] = useState(false);
  const [userAuthenticData, setUserAuthenticData] = useState(null)
  const [filters, setFilters] = useState({
    title: searchQuery.get("title"),
    statusValue: searchQuery.get("statusValue"),
  });
  const [permissions, setpermissions] = useState({
    title: "",
    //dashboard
    dashboardView: false,
    //coach memebership management
    coachMemberShipCreate: false,
    coachMemberShipView: false,
    coachMemberShipEdit: false,
    coachMemberShipDelete: false,
    //user memebership management
    // userMemberShipCreate: false,
    // userMemberShipView: false,
    // userMemberShipEdit: false,
    // userMemberShipDelete: false,
    //usermembership record
    // userMembershipRecordCreate: false,
    // userMembershipRecordView: false,
    // userMembershipRecordEdit: false,
    //usermembership record
    coachMembershipRecordCreate: false,
    coachMembershipRecordView: false,
    memberMembershipRecordEdit: false,
    //staff
    staffCreate: false,
    staffView: false,
    staffEdit: false,
    staffDelete: false,
    //usermanagement
    userCreate: false,
    userView: false,
    userEdit: false,
    userDelete: false,
    //coaching
    coachingCreate: false,
    coachingView: false,
    coachingEdit: false,
    coachingDelete: false,
    //services
    // servicesCreate: false,
    // servicesView: false,
    // servicesEdit: false,
    // servicesDelete: false,
    //content
    contentCreate: false,
    contentView: false,
    contentEdit: false,
    contentDelete: false,
    //reviewmanagement
    reviewView: false,
    reviewEdit: false,
    reviewDelete: false,
    //emailTemplateManagement
    emailTemplateView: false,
    emailTemplateEdit: false,
    emailTemplateDelete: false,
    // permissions
    permissionsCreate: false,
    permissionsView: false,
    permissionsEdit: false,
    permissionsDelete: false,
    // blogs
    blogCreate: false,
    blogView: false,
    blogEdit: false,
    blogDelete: false,
    // categories
    categoryCreate: false,
    categoryView: false,
    categoryEdit: false,
    categoryDelete: false,
    //role
    roleCreate: false,
    roleView: false,
    roleEdit: false,
    roleDelete: false,
    //notifications
    notificationsView: false,
    //payments
    paymentsView: false,
    //thirdparty
    thirdPartyEdit: false,
    //contactus 
    contactUsQueriesView: false,
    //settings
    settingsView: false,
    settingsEdit: false,
    //
    status: true,
  })
  const [editPermissions, seteditPermissions] = useState({});

  ////after page refresh
  useEffect(() => {
    toast.dismiss();
    props.beforePremission();
    window.scroll(0, 0);
    props.getpermissions();
  }, []);

  // after every new entry refresh list
  useEffect(() => {
    if (props.state.getpermCall) {
      const { permissions, pagination } = props.state;
      setviewPerm(permissions);
      setPagination(pagination);
    }
  }, [props.state.getpermCall, props.state.permissions]);

  // if state have an entry refresh list  
  useEffect(() => {
    if (viewPerm) {
      setLoader(false)
    }
  }, [viewPerm])

  // when an error is received
  useEffect(() => {
    if (props.error.error)
      setLoader(false)
  }, [props.error.error])

  useEffect(() => {
    onPageChange(1);
  }, [filters])

  // after updating permission list will update
  useEffect(() => {
    if ( props.state.updatedPermAuth ) {
      const { updatedPerm } = props.state;
      setviewPerm(
        viewPerm.map((item) => {
          if (item._id === updatedPerm._id) {
            for (const prop of Object.keys(updatedPerm)) {
              if (prop in item) {
                item[prop] = updatedPerm[prop];
              }
            }
          }
          return item;
        })
      );
      props.beforePremission();
      setLoader(false);
    }
  }, [props.state.updatedPermAuth]);

  
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

  const closeAddModal = () => {
    setaddShow(false);
  }

  const closeEditModal = () => {
    setEditShow(false);
  }
  const addPermsissions = (e) => {
    e.preventDefault();
    props.addPermission(permissions);
    setpermissions({
      status:true,
    });
    setaddShow(false);
  }

  const onEditPermissions = (e) => {
    e.preventDefault();
    props.updatePermissions(editPermissions);
    setEditShow(false);
  }

  const delPerm = () => {
    setDelModalCheck(false);
    props.deletePermission(delId);
  };

  const onPageChange = async (page) => {
    const params = {};
    if (filters.title)
      params.title = filters.title;
    if (filters.statusValue)
      params.statusValue = filters.statusValue;  
    setLoader(true);
    const qs = ENV.objectToQueryString({ ...params, page });
    props.getpermissions(qs);
    history.replace({
      pathname: location.pathname, search: ENV.objectToQueryString(params)
    });
  }

  const rendFilters = () => {
    if (filterCheck) {
      return (
        <Form className="row mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            const title = document.getElementById("searchTitle").value.trim();
            var select = document.getElementById('memberStatus');
            var statusValue = select.options[select.selectedIndex].value;
            const obj = { ...filters };
            if (title) obj.title = title;
            else obj.title = null;
            if (statusValue) obj.statusValue = statusValue;
            else obj.statusValue = null;
            if ( title || statusValue ) {
              setFilterMsgCheck(false);
              setFilters(obj);
            } else {
              setFilterMsgCheck(true);
            }
          }}
        >
          <div className="col-md-3">
            <label htmlFor="searchTitle">Title</label>
            <input
              id="searchTitle"
              type="text"
              className="form-control"
              placeholder="Enter title..."
              defaultValue={filters.title}
            />
          </div>
          <div className="col-md-3">
            <lable htmlFor='searchTitle'>Status</lable>
            <select className='form-control form-select' id = "memberStatus">
                <option value={''}>Select Status</option>
                <option value={'1'}>Active</option>
                <option value={'0'}>InActive</option>
            </select>
          </div>
          <div className="col-md-3 p-0 d-flex justify-content-end align-items-end">
            {( filters.title || filters.statusValue ) && (
              <button
                className="btn btn-info mr-3 btn-warning"
                type="button"
                onClick={() =>
                  setFilters({
                    title: null,
                    statusValue:null,
                  })
                }
              >
                Reset Filters
              </button>
            )}
            <button className="btn apply-filters blue-bg" type="submit">
              Apply Filters
            </button>
          </div>
          <div className="col-md-12">
            <span className={filterMsgCheck ? `` : `d-none`}>
              <label className="pt-3 text-danger">
                Please fill a filter field to perform filteration
              </label>
            </span>
          </div>
        </Form>
      );
    }
  };

  return (
    <>
      {
        loader ? <FullPageLoader /> :
          <Container fluid >
            <Row>
              <Col md={12}>
                <Card.Header className="mb-5 head-grid">
                  <div className='d-block  d-sm-flex justify-content-between align-items-center'>
                    <Card.Title as="h4">Filter</Card.Title>
                    <Button onClick={() => { setFilterCheck(!filterCheck); setFilterMsgCheck(false); }} className="yellow-bg m-0">
                      <span> Filters  </span>
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
              <Col md={12}>
                <Card className="table-big-boy">
                  <div className="d-block  d-sm-flex justify-content-between align-items-center register-users">
                    <Card.Title as="h4">Roles & Permissions Management</Card.Title>
                   { 
                     userAuthenticData?.permissionId?.permissionsCreate === true ? 
                     <Button onClick={() => { setaddShow(true) }} className="yellow-bg m-0">
                      <span> ADD  </span>
                      <span className="pl-1"> <FontAwesomeIcon icon={faPlus} /> </span>
                    </Button> : ""}
                  </div>
                  <Card.Body className="table-full-width">
                    <div className=" table-responsive">
                      <Table className="table-striped w-full">
                        <thead>
                          <tr>
                            <th className="text-center td-start">#</th>
                            <th className="td-name">Role</th>
                            <th className="td-title">Permissions</th>
                            <th className="td-status">status</th>
                            <th className="td-created">Created At</th>
                            {userAuthenticData?.permissionId?.permissionsEdit||userAuthenticData?.permissionId?.permissionsDelete?<th className="td-action">Actions</th>:""}
                          </tr>
                        </thead>
                        <tbody>
                          {viewPerm && viewPerm.length ? (
                            viewPerm.map((data, index) => {
                              return (
                                <tr key={index}>
                                  <td className="td-start text-center">
                                    {pagination &&
                                      pagination.limit * pagination.page -
                                      pagination.limit +
                                      index +
                                      1}
                                  </td>
                                  <td className="td-name">{data?.title}</td>
                                  <td className="td-tags">
                                    {data?.dashboardView ? <span className='lable-info'>Dashboard View</span> : ""}
                                    {data?.staffCreate ?  <span className='lable-info'>Staff Create</span> : ""}
                                    {data?.staffView ? <span className='lable-info'> Staff View </span> : ""}
                                    {data?.staffEdit ?  <span className='lable-info'> Staff Edit </span> : ""}
                                    {data?.staffDelete ? <span className='lable-info'> Staff Delete </span>: ""}
                                    {data?.userCreate ? <span className='lable-info'> Member Create  </span>: ""}
                                    {data?.userView ?  <span className='lable-info'> Member View</span> : ""}
                                    {data?.userEdit ? <span className='lable-info'> Member Edit</span>: ""}
                                    {data?.userDelete ? <span className='lable-info'> Member Delete </span> : ""}
                                    {data?.coachingCreate ? <span className='lable-info'> Coaching Create </span> : ""}
                                    {data?.coachingView ? <span className='lable-info'> Coaching View </span>: ""}
                                    {data?.coachingEdit ? <span className='lable-info'> Coaching Edit </span>: ""}
                                    {data?.coachingDelete ? <span className='lable-info'> Coaching Delete</span> : ""}
                                    {data?.coachMemberShipCreate ? <span className='lable-info'> Coach Membership Create</span> : ""}
                                    {data?.coachMemberShipView ? <span className='lable-info'> Coach Membership View</span> : ""}
                                    {data?.coachMemberShipEdit ? <span className='lable-info'> Coach Membership Edit</span> : ""}
                                    {data?.coachMemberShipDelete ? <span className='lable-info'> Coach Membership Delete</span> : ""}
                                    {data?.userMemberShipCreate ? <span className='lable-info'> User Membership Create</span> : ""}
                                    {data?.userMemberShipView ? <span className='lable-info'> User Membership View</span> : ""}
                                    {data?.userMemberShipEdit ? <span className='lable-info'> User Membership Edit</span> : ""}
                                    {data?.userMemberShipDelete ? <span className='lable-info'> User Membership Delete</span> : ""}
                                    {data?.userMembershipRecordCreate ? <span className='lable-info'> User Membership Record Create</span> : ""}
                                    {data?.userMembershipRecordView ? <span className='lable-info'> User Membership Record View</span> : ""}
                                    {data?.userMembershipRecordEdit ? <span className='lable-info'> User Membership Record Edit</span> : ""}
                                    {data?.coachMembershipRecordCreate ? <span className='lable-info'> Coach Membership Record Create</span> : ""}
                                    {data?.coachMembershipRecordView ? <span className='lable-info'> Coach Membership Record View</span> : ""}
                                    {data?.coachMembershipRecordEdit ? <span className='lable-info'> User Membership Record Edit</span> : ""}
                                    {data?.blogCreate ? <span className='lable-info'> blog Create</span>: ""}
                                    {data?.blogView ? <span className='lable-info'> blog View</span> : ""}
                                    {data?.blogEdit ?  <span className='lable-info'> blog Edit  </span> : ""}
                                    {data?.blogDelete ? <span className='lable-info'> blog Delete</span> : ""}
                                    {data?.categoryCreate ? <span className='lable-info'> category Create</span>: ""}
                                    {data?.categoryView ? <span className='lable-info'> category View</span> : ""}
                                    {data?.categoryEdit ?  <span className='lable-info'> category Edit  </span> : ""}
                                    {data?.categoryDelete ? <span className='lable-info'> category Delete</span> : ""}
                                    {data?.servicesCreate ? <span className='lable-info'> Services Create</span>: ""}
                                    {data?.servicesView ? <span className='lable-info'> Services View</span> : ""}
                                    {data?.servicesEdit ?  <span className='lable-info'> Services Edit  </span> : ""}
                                    {data?.servicesDelete ? <span className='lable-info'> Services Delete</span> : ""}
                                    {data?.contentCreate ? <span className='lable-info'> Content Create</span> : ""}
                                    {data?.contentView ? <span className='lable-info'> Content View</span> : ""}
                                    {data?.contentEdit ? <span className='lable-info'> Content Edit</span> : ""}
                                    {data?.contentDelete ? <span className='lable-info'> Content Delete</span> : ""}
                                    {data?.dashboardView ? <span className='lable-info'> Dashboard View</span> : ""}
                                    {data?.reviewView ? <span className='lable-info'> Review View</span>: ""}
                                    {data?.reviewEdit ? <span className='lable-info'> Review Edit</span> : ""}
                                    {data?.reviewDelete ? <span className='lable-info'> Review Delete</span>: ""}
                                    {data?.emailTemplateView ? <span className='lable-info'> Email Template View</span>: ""}
                                    {data?.emailTemplateEdit ? <span className='lable-info'> Email Template Edit</span> : ""}
                                    {data?.emailTemplateDelete ? <span className='lable-info'> Email Template Delete</span> : ""}
                                    {data?.roleCreate ? <span className='lable-info'> Role Create</span> : ""}
                                    {data?.roleView ? <span className='lable-info'> Role View</span>: ""}
                                    {data?.roleEdit ? <span className='lable-info'> Role Edit</span>: ""}
                                    {data?.roleDelete ? <span className='lable-info'> Role Delete</span> : ""}
                                    {data?.permissionsCreate ? <span className='lable-info'> Permissions Create</span> : ""}
                                    {data?.permissionsView ? <span className='lable-info'> Permissions View</span>: ""}
                                    {data?.permissionsEdit ? <span className='lable-info'> Permissions Edit</span>: ""}
                                    {data?.permissionsDelete ? <span className='lable-info'> Permissions Delete</span> : ""}
                                    {data?.notificationsView ? <span className='lable-info'> Notifications View</span> : ""}
                                    {data?.paymentsView ? <span className='lable-info'> Payments View</span>: ""}
                                    {data?.thirdPartyEdit ? <span className='lable-info'> Thirdparty Edit</span> : ""}
                                    {data?.contactUsQueriesView ? <span className='lable-info'> Contact Us Queries View </span> : ""}
                                    {data?.settingsView ? <span className='lable-info'> Settings View </span> : ""}
                                    {data?.settingsEdit ? <span className='lable-info'> Settings Edit </span> : ""}

                                  </td>
                                  <td className="td-status">
                                    <span
                                      className={`status p-1 ${data.status ? `bg-success` : `bg-danger`
                                        }`}
                                    >
                                      {data.status ? "active" : "inactive"}
                                    </span>
                                  </td>
                                  <td className="td-created">
                                    {data.createdAt
                                      ? moment(data?.createdAt).format(
                                        "DD-MM-YYYY HH:MM:SS"
                                      )
                                      : "N/A"}
                                  </td>
                                  <td className="td-actions">
                                    <span className='d-flex'>
                                      {
                                        userAuthenticData?.permissionId?.permissionsEdit === true ? 
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
                                            seteditPermissions({
                                              ...editPermissions,
                                              ...data
                                            });
                                            setEditShow(true);
                                          }}
                                        >
                                          <i className="fas fa-edit"></i>
                                        </Button>
                                        </OverlayTrigger> : ""}
                                        {
                                          userAuthenticData?.permissionId?.permissionsDelete === true ? 
                                          <OverlayTrigger
                                          overlay={
                                            <Tooltip id="tooltip-481441726">
                                              Remove
                                            </Tooltip>
                                          }
                                          >
                                          <Button className="btn-link btn-xs" variant="danger"
                                            onClick={() => {
                                              setDelModalCheck(true);
                                              setDelId(data._id);
                                            }}
                                          >
                                            <i className="fas fa-times"></i>
                                          </Button>
                                          </OverlayTrigger> : ""}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                <span className="no-data-found d-block">No User found</span>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    {pagination && (
                      <Pagination
                        className="m-3"
                        defaultCurrent={1}
                        pageSize // items per page
                        current={pagination.page} // current active page
                        total={pagination.pages} // total pages
                        onChange={onPageChange}
                        locale={localeInfo}
                      />
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
      }
      {/* ///addshow modal */}
      {
        addShow &&
        <Modal className='permissions_main' show={addShow} onHide={() => {
          setaddShow(false)
        }}>
          <Form onSubmit={addPermsissions} >
            <Modal.Header closeButton>
              <Modal.Title className='yellow-color'>Add Permissions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" >
                <Form.Label>Role title</Form.Label>
                <Form.Control type="text" placeholder="eg. admin" name="title" value={permissions.title} onChange={(e) => {
                  setpermissions({ ...permissions, title: e.target.value });
                }} required
                />
              </Form.Group>
              {/* //Dashboard */}
              <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">

                <Form.Label>Dashboard</Form.Label>
                <div >
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.dashboardView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, dashboardView: e.target.checked }) }}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
              <Form.Label>Staff Management</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" checked={permissions.staffCreate ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, staffCreate: e.target.checked }) }}
                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.staffView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, staffView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.staffEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, staffEdit: e.target.checked }) }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" checked={permissions.staffDelete ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, staffDelete: e.target.checked }) }}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
              <Form.Label>Permissions Management</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" checked={permissions.permissionsCreate ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, permissionsCreate: e.target.checked }) }}
                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.permissionsView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, permissionsView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.permissionsEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, permissionsEdit: e.target.checked }) }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" checked={permissions.permissionsDelete ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, permissionsDelete: e.target.checked }) }}
                  />
                </div>
              </Form.Group>
              {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Member Management</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" checked={permissions.userCreate ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, userCreate: e.target.checked }) }}
                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.userView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, userView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.userEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, userEdit: e.target.checked }) }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" checked={permissions.userDelete ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, userDelete: e.target.checked }) }}
                  />
                </div>
              </Form.Group> */}
              {/* //Coaching */}
              <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">

                <Form.Label>Dietitian Management</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" checked={permissions.coachingCreate ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, coachingCreate: e.target.checked }) }}
                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.coachingView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, coachingView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.coachingEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, coachingEdit: e.target.checked }) }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" checked={permissions.coachingDelete ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, coachingDelete: e.target.checked }) }}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Dietitian Membership Management</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" checked={permissions.coachMemberShipCreate ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, coachMemberShipCreate: e.target.checked }) }}

                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.coachMemberShipView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, coachMemberShipView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.coachMemberShipEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, coachMemberShipEdit: e.target.checked }) }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" checked={permissions.coachMemberShipDelete ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, coachMemberShipDelete: e.target.checked }) }}
                  />
                </div>
              </Form.Group>
              {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Users Membership Management</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" checked={permissions.userMemberShipCreate ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, userMemberShipCreate: e.target.checked }) }}

                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.userMemberShipView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, userMemberShipView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.userMemberShipEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, userMemberShipEdit: e.target.checked }) }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" checked={permissions.userMemberShipDelete ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, userMemberShipDelete: e.target.checked }) }}
                  />
                </div>
              </Form.Group> */}

              {/* usermembership */}
              {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Member Membership Record</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" checked={permissions.userMembershipRecordCreate ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, userMembershipRecordCreate: e.target.checked }) }}
                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.userMembershipRecordView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, userMembershipRecordView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.userMembershipRecordEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, userMembershipRecordEdit: e.target.checked }) }}
                  />
                </div>
              </Form.Group> */}

              <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Dietitian Membership Record</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" checked={permissions.coachMembershipRecordCreate ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, coachMembershipRecordCreate: e.target.checked }) }}
                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.coachMembershipRecordView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, coachMembershipRecordView: e.target.checked }) }}
                  />
                   <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.coachMembershipRecordEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, coachMembershipRecordEdit: e.target.checked }) }}
                  />
                </div>
              </Form.Group>
              {/* //BLOG */}
              <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Blog Management</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" checked={permissions.blogCreate ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, blogCreate: e.target.checked }) }}
                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.blogView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, blogView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.blogEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, blogEdit: e.target.checked }) }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" checked={permissions.blogDelete ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, blogDelete: e.target.checked }) }}
                  />
                </div>
              </Form.Group>
               {/* //CATEGORIES */}
              <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Categories Management</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" checked={permissions.categoryCreate ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, categoryCreate: e.target.checked }) }}
                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.categoryView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, categoryView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.categoryEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, categoryEdit: e.target.checked }) }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" checked={permissions.categoryDelete ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, categoryDelete: e.target.checked }) }}
                  />
                </div>
              </Form.Group>
{/* //SERVICES */}
              {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
              <Form.Label>Services Management</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" checked={permissions.servicesCreate ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, servicesCreate: e.target.checked }) }}
                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.servicesView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, servicesView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.servicesEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, servicesEdit: e.target.checked }) }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" checked={permissions.servicesDelete ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, servicesDelete: e.target.checked }) }}
                  />
                </div>
              </Form.Group> */}
            
              {/* //Content */}
              <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">

                <Form.Label>Content Management</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" checked={permissions.contentCreate ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, contentCreate: e.target.checked }) }}
                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.contentView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, contentView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.contentEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, contentEdit: e.target.checked }) }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" checked={permissions.contentDelete ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, contentDelete: e.target.checked }) }}
                  />
                </div>
              </Form.Group>
              
              {/* //Review */}
              {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Review Management</Form.Label>
                <div >
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.reviewView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, reviewView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.reviewEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, reviewEdit: e.target.checked }) }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" checked={permissions.reviewDelete ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, reviewDelete: e.target.checked }) }}
                  />
                </div>
              </Form.Group> */}
              {/* //Review */}
              {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Email Template Management</Form.Label>
                <div >
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.emailTemplateView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, emailTemplateView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.emailTemplateEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, emailTemplateEdit: e.target.checked }) }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" checked={permissions.emailTemplateDelete ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, emailTemplateDelete: e.target.checked }) }}
                  />
                </div>
              </Form.Group> */}
              {/* //Role */}
              {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Role Management</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" checked={permissions.roleCreate ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, roleCreate: e.target.checked }) }}
                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.roleView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, roleView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.roleEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, roleEdit: e.target.checked }) }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" checked={permissions.roleDelete ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, roleDelete: e.target.checked }) }}
                  />
                </div>
              </Form.Group> */}
                {/* //MemberShip */}
                {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Notifications</Form.Label>
                  <div >
                    <Form.Label>View</Form.Label>
                    <input type="checkbox" checked={permissions.notificationsView ? true : false}
                      onChange={(e) => { setpermissions({ ...permissions, notificationsView: e.target.checked }) }}
                    />
                  </div>
                </Form.Group> */}
              {/* //Payments */}
              <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">

                <Form.Label>Payments</Form.Label>
                <div >
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.paymentsView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, paymentsView: e.target.checked }) }}
                  />
                </div>
              </Form.Group>
              {/* //thirdpart */}
              {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">

                <Form.Label>Third Party</Form.Label>
                <div >
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.thirdPartyEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, thirdPartyEdit: e.target.checked }) }}
                  />
                </div>
              </Form.Group> */}
              <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">

                <Form.Label>Contact Us</Form.Label>
                <div >
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.contactUsQueriesView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, contactUsQueriesView: e.target.checked }) }}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">

                <Form.Label>Social Links</Form.Label>
                <div >
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={permissions.settingsView ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, settingsView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={permissions.settingsEdit ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, settingsEdit: e.target.checked }) }}
                  />
                </div>
              </Form.Group>
              <Form.Group className="switch-wrapper mb-3">
                <span className="d-block mb-2 form-label">Status</span>
                <label class="switch">
                  <input type="checkbox" name="status" checked={permissions.status ? true : false}
                    onChange={(e) => { setpermissions({ ...permissions, status: e.target.checked }); }}
                  />
                  <span class="slider round"></span>
                </label>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={closeAddModal}>
                Close
              </Button>
              <Button variant="primary" type="submit" className="yellow-bg">
                Add Permission
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      }

      {/* ///editShow modal */}
      {
        editshow &&
        <Modal className='permissions_main' show={editshow} onHide={() => {
          setEditShow(false);
        }}>
          <Form onSubmit={onEditPermissions} >
            <Modal.Header closeButton>
              <Modal.Title className='yellow-color'>Edit Permissions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" >
                <Form.Label>Role Title</Form.Label>
                <Form.Control type="text" placeholder="eg. admin" value={editPermissions.title}
                  onChange={(e) => { seteditPermissions({ ...editPermissions, title: e.target.value }); }}
                />
                <div className=''>
                  {/* <Form.Label>Select All</Form.Label>
                          <input type="checkbox" value={1}  /> */}
                </div>
              </Form.Group>
               {/* //Dashboard */}
               <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Dashboard</Form.Label>
                <div >
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" name="dashboardView" checked={editPermissions.dashboardView ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, dashboardView: e.target.checked }); }}
                  />
                </div>
                </Form.Group>
                {/* //MemberShip */}
                <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                  <Form.Label>Staff Management</Form.Label>
                  <div>
                    <Form.Label>Create</Form.Label>
                    <input type="checkbox" name="create"  checked={editPermissions.staffCreate ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, staffCreate: e.target.checked }); }}
                    />
                    <Form.Label>View</Form.Label>
                    <input type="checkbox" name="delete" checked={editPermissions.staffView ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, staffView: e.target.checked }); }}
                    />
                    <Form.Label>Edit</Form.Label>
                    <input type="checkbox" name="delete" checked={editPermissions.staffEdit ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, staffEdit: e.target.checked }); }}
                    />
                    <Form.Label>Delete</Form.Label>
                    <input type="checkbox" name="delete" checked={editPermissions.staffDelete ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, staffDelete: e.target.checked }); }}
                    />
                  </div>
                </Form.Group>
                 {/* //User */}
                {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Member Management</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" name="userCreate" checked={editPermissions.userCreate ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, userCreate: e.target.checked }); }}
                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" name="userView" checked={editPermissions.userView ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, userView: e.target.checked }); }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" name="userEdit" checked={editPermissions.userEdit ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, userEdit: e.target.checked }); }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" name="userDelete" checked={editPermissions.userDelete ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, userDelete: e.target.checked }); }}
                  />
                </div>
                </Form.Group> */}
                 {/* //User */}
                 <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Permissions Management</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" name="userCreate" checked={editPermissions.permissionsCreate ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, permissionsCreate: e.target.checked }); }}
                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" name="permissionsView" checked={editPermissions.permissionsView ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, permissionsView: e.target.checked }); }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" name="permissionsEdit" checked={editPermissions.permissionsEdit ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, permissionsEdit: e.target.checked }); }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" name="permissionsDelete" checked={editPermissions.permissionsDelete ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, permissionsDelete: e.target.checked }); }}
                  />
                </div>
                </Form.Group>
                {/* //Coaching */}
                <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                  <Form.Label>Dietitian Management</Form.Label>
                  <div >
                    <Form.Label>Create</Form.Label>
                    <input type="checkbox" name="coachingCreate" checked={editPermissions.coachingCreate ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, coachingCreate: e.target.checked }); }}
                    />
                    <Form.Label>View</Form.Label>
                    <input type="checkbox" name="coachingView" checked={editPermissions.coachingView ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, coachingView: e.target.checked }); }}
                    />
                    <Form.Label>Edit</Form.Label>
                    <input type="checkbox" name="coachingEdit" checked={editPermissions.coachingEdit ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, coachingEdit: e.target.checked }); }}
                    />
                    <Form.Label>Delete</Form.Label>
                    <input type="checkbox" name="coachingDelete" checked={editPermissions.coachingDelete ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, coachingDelete: e.target.checked }); }}
                    />
                  </div>
                </Form.Group>
                {/* //usercoachShip */}
                {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                  <Form.Label>Member Membership Record</Form.Label>
                  <div >
                    <Form.Label>Create</Form.Label>
                    <input type="checkbox" name="create" checked={editPermissions.userMembershipRecordCreate ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, userMembershipRecordCreate: e.target.checked }); }}
                    />
                    <Form.Label>View</Form.Label>
                    <input type="checkbox" name="view" checked={editPermissions.userMembershipRecordView ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, userMembershipRecordView: e.target.checked }); }}
                    />
                     <Form.Label>Edit</Form.Label>
                    <input type="checkbox" name="view" checked={editPermissions.userMembershipRecordEdit ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, userMembershipRecordEdit: e.target.checked }); }}
                    />
                  </div>
                </Form.Group> */}
                {/* //usercoachShip */}
                <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                  <Form.Label>Coach Membership Record</Form.Label>
                  <div >
                    <Form.Label>Create</Form.Label>
                    <input type="checkbox" name="create" checked={editPermissions.coachMembershipRecordCreate ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, coachMembershipRecordCreate: e.target.checked }); }}
                    />
                    <Form.Label>View</Form.Label>
                    <input type="checkbox" name="view" checked={editPermissions.coachMembershipRecordView ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, coachMembershipRecordView: e.target.checked }); }}
                    />
                    <Form.Label>Edit</Form.Label>
                    <input type="checkbox" name="view" checked={editPermissions.coachMembershipRecordEdit ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, coachMembershipRecordEdit: e.target.checked }); }}
                    />
                  </div>
              
                </Form.Group>
                      {/* //BLOG */}
              <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Blog Management</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" checked={editPermissions.blogCreate ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, blogCreate: e.target.checked }) }}
                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={editPermissions.blogView ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, blogView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={editPermissions.blogEdit ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, blogEdit: e.target.checked }) }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" checked={editPermissions.blogDelete ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, blogDelete: e.target.checked }) }}
                  />
                </div>
              </Form.Group>
               {/* //CATEGORIES */}
              <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Categories Management</Form.Label>
                <div >
                  <Form.Label>Create</Form.Label>
                  <input type="checkbox" checked={editPermissions.categoryCreate ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, categoryCreate: e.target.checked }) }}
                  />
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={editPermissions.categoryView ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, categoryView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={editPermissions.categoryEdit ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, categoryEdit: e.target.checked }) }}
                  />
                  <Form.Label>Delete</Form.Label>
                  <input type="checkbox" checked={editPermissions.categoryDelete ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, categoryDelete: e.target.checked }) }}
                  />
                </div>
              </Form.Group>
                  {/* //Content */}
                  {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                  <Form.Label>Services Management</Form.Label>
                  <div >
                    <Form.Label>Create</Form.Label>
                    <input type="checkbox" name="contentCreate" checked={editPermissions.servicesCreate ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, servicesCreate: e.target.checked }); }}
                    />
                    <Form.Label>View</Form.Label>
                    <input type="checkbox" name="contentView" checked={editPermissions.servicesView ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, servicesView: e.target.checked }); }}
                    />
                    <Form.Label>Edit</Form.Label>
                    <input type="checkbox" name="contentEdit" checked={editPermissions.servicesEdit ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, servicesEdit: e.target.checked }); }}
                    />
                    <Form.Label>Delete</Form.Label>
                    <input type="checkbox" name="contentDelete" checked={editPermissions.servicesDelete ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, servicesDelete: e.target.checked }); }}
                    />
                  </div>
                </Form.Group> */}
                {/* //Content */}
                <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                  <Form.Label>Content Management</Form.Label>
                  <div >
                    <Form.Label>Create</Form.Label>
                    <input type="checkbox" name="contentCreate" checked={editPermissions.contentCreate ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, contentCreate: e.target.checked }); }}
                    />
                    <Form.Label>View</Form.Label>
                    <input type="checkbox" name="contentView" checked={editPermissions.contentView ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, contentView: e.target.checked }); }}
                    />
                    <Form.Label>Edit</Form.Label>
                    <input type="checkbox" name="contentEdit" checked={editPermissions.contentEdit ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, contentEdit: e.target.checked }); }}
                    />
                    <Form.Label>Delete</Form.Label>
                    <input type="checkbox" name="contentDelete" checked={editPermissions.contentDelete ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, contentDelete: e.target.checked }); }}
                    />
                  </div>
                </Form.Group>
                {/* //Review */}
                {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                  <Form.Label>Review Management</Form.Label>
                  <div >
                    <Form.Label>View</Form.Label>
                    <input type="checkbox" name="reviewView" checked={editPermissions.reviewView ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, reviewView: e.target.checked }); }}
                    />
                    <Form.Label>Edit</Form.Label>
                    <input type="checkbox" name="reviewEdit" checked={editPermissions.reviewEdit ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, reviewEdit: e.target.checked }); }}
                    />
                    <Form.Label>Delete</Form.Label>
                    <input type="checkbox" name="reviewDelete" checked={editPermissions.reviewDelete ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, reviewDelete: e.target.checked }); }}
                    />
                  </div>
                </Form.Group> */}
                 {/* //Review */}
                 {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                  <Form.Label>Email Template Management</Form.Label>
                  <div >
                    <Form.Label>View</Form.Label>
                    <input type="checkbox" name="reviewView" checked={editPermissions.emailTemplateView ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, emailTemplateView: e.target.checked }); }}
                    />
                    <Form.Label>Edit</Form.Label>
                    <input type="checkbox" name="reviewEdit" checked={editPermissions.emailTemplateEdit ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, emailTemplateEdit: e.target.checked }); }}
                    />
                    <Form.Label>Delete</Form.Label>
                    <input type="checkbox" name="reviewDelete" checked={editPermissions.emailTemplateDelete ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, emailTemplateDelete: e.target.checked }); }}
                    />
                  </div>
                </Form.Group> */}
                {/* //Role */}
                {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                  <Form.Label>Role Management</Form.Label>
                  <div >
                    <Form.Label>Create</Form.Label>
                    <input type="checkbox" name="roleCreate" checked={editPermissions.roleCreate ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, roleCreate: e.target.checked }); }}
                    />
                    <Form.Label>View</Form.Label>
                    <input type="checkbox" name="roleView" checked={editPermissions.roleView ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, roleView: e.target.checked }); }}
                    />
                    <Form.Label>Edit</Form.Label>
                    <input type="checkbox" name="roleEdit" checked={editPermissions.roleEdit ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, roleEdit: e.target.checked }); }}
                    />
                    <Form.Label>Delete</Form.Label>
                    <input type="checkbox" name="roleDelete" checked={editPermissions.roleDelete ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, roleDelete: e.target.checked }); }}
                    />
                  </div>
                </Form.Group> */}
               {/* //MemberShip */}
               {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Notifications</Form.Label>
                <div >
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" name="notifications" checked={editPermissions.notificationsView ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, notificationsView: e.target.checked }); }}
                  />
                </div>
                </Form.Group> */}
                {/* //Payments */}
                <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                  <Form.Label>Payments</Form.Label>
                  <div >
                    <Form.Label>View</Form.Label>
                    <input type="checkbox" name="paymentsView" checked={editPermissions.paymentsView ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, paymentsView: e.target.checked }); }}
                    />
                  </div>
                </Form.Group>
                {/* //thirdpart */}
                {/* <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                  <Form.Label>Third Party</Form.Label>
                  <div >
                    <Form.Label>Edit</Form.Label>
                    <input type="checkbox" ame="thirdPartyEdit" checked={editPermissions.thirdPartyEdit ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, thirdPartyEdit: e.target.checked }); }}
                    />
                  </div>
                </Form.Group> */}
                <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Contact Us</Form.Label>
                <div >
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={editPermissions.contactUsQueriesView ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, contactUsQueriesView: e.target.checked }) }}
                  />
                </div>
                </Form.Group>
                <Form.Group className="mb-3 flex-wrapp d-flex justify-content-between align-items-center">
                <Form.Label>Social Links</Form.Label>
                <div >
                  <Form.Label>View</Form.Label>
                  <input type="checkbox" checked={editPermissions.settingsView ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, settingsView: e.target.checked }) }}
                  />
                  <Form.Label>Edit</Form.Label>
                  <input type="checkbox" checked={editPermissions.settingsEdit ? true : false}
                    onChange={(e) => { seteditPermissions({ ...editPermissions, settingsEdit: e.target.checked }) }}
                  />
                </div>
                </Form.Group>
                <Form.Group className="switch-wrapper mb-3">
                  <span className="d-block mb-2 form-label">Status</span>
                  <label className="switch">
                    <input type="checkbox" name="status" checked={editPermissions.status ? true : false}
                      onChange={(e) => { seteditPermissions({ ...editPermissions, status: e.target.checked }); }}
                    />
                    <span className="slider round"></span>
                  </label>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={closeEditModal}>
                Close
              </Button>
              <Button variant="primary" type="submit" className="yellow-bg">
                Update Permission
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      }
      {/* //delModalCheck */}

      {
        delModalCheck && (
          <Modal show={delModalCheck} onHide={() => setDelModalCheck(false)}>
            <Modal.Header closeButton>
              <Modal.Title className="yellow-color delete-tag mb-5">
                Are you sure you want to delete this user?
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer className='d-flex justify-content-center'>
              <Button className="save-btn mr-3" variant="danger" onClick={() => setDelModalCheck(false)}>
                No
              </Button>
              <Button variant="primary" onClick={delPerm} className="yellow-bg save-btn">
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
        )}
    </>
  )
}
const mapStateToProps = state => ({
  state: state.permissions,
  error: state.error
});
export default connect(mapStateToProps, { beforePremission, addPermission, updatePermissions, getpermissions, deletePermission })(Permissions);
