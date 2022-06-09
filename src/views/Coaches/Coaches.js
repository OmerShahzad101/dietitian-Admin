import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import { ENV } from "../../config/config";
import {
  createCoach,
  listCoach,
  beforeCoach,
  updateCoach,
  deleteCoach,
} from "./Coaches.action";
import { listCoachMemberships,} from '../CoachMemberships/CoachMembership.action'
import FullPageLoader from "components/FullPageLoader/FullPageLoader";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import localeInfo from "rc-pagination/lib/locale/en_US";
import {
  Button,
  Card,
  Form,
  Table,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Modal,
} from "react-bootstrap";
import imagePlaceholder from "assets/img/placeholder.png";
import userDefaultImg from "../../assets/img/placeholder.png";
import { useHistory, useLocation } from "react-router";
import moment from "moment";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { ENV } from "../../config/config";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


const Coaches = (props) => {

  var userId;
  
  var calledFunction = true;
  const [_id, setId] = useState(window.atob(localStorage.getItem("adminId")));

  const history = useHistory();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);
  const [coaches, setCoaches] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loader, setLoader] = useState(true);
  const [addShow, setAddShow] = useState(false);
  const [addForm, setAddForm] = useState({
    profileImage: "",
    status: true,
    type: 3,
    address: "Arhamsoft johar Town",
    membershipId:"",
  });
  const [editShow, setEditShow] = useState(false);
  const [editForm, setEditForm] = useState({
    profileImage: "",
  });
  const [delModalCheck, setDelModalCheck] = useState(false);
  const [errors, setErrors] = useState({});
  const [delId, selDelId] = useState(null);
  const [filterCheck, setFilterCheck] = useState(false);
  const [filterMsgCheck, setFilterMsgCheck] = useState(false);
  const [userAuthenticData, setUserAuthenticData] = useState(null)
  const [filters, setFilters] = useState({
    name: searchQuery.get("name"),
    email: searchQuery.get("email"),
    address: searchQuery.get("address"),
    statusValue: searchQuery.get("statusValue")
  });
  const [pic, setPic] = useState({
    image: null,
    _id,
  });

  useEffect(() => {
    toast.dismiss();
    window.scroll(0, 0);
    props.listCoach();
    props.listCoachMemberships(calledFunction);
  }, []);

  useEffect(() => {
    if (props.coach.coachListAuth) {
      const { coachList, pagination } = props.coach;
      setCoaches(coachList);
      setPagination(pagination);
    }
  }, [props.coach.coachListAuth, props.coach.coachList]);

  useEffect(() => {
    if (coaches) {
      setLoader(false);
    }
  }, [coaches]);

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
    if (props.error.error) setLoader(false);
  }, [props.error.error]);

  useEffect(() => {
    onPageChange(1);
  }, [filters]);

  useEffect(() => {
    if (props.coach.updateCoachAuth) {
      const { coach } = props.coach.coach;
      setCoaches(
        coaches.map((item) => {
          if (item._id === coach?._id) {
            if (coach.username) item.username = coach.username;
            if (coach.profileImage) item.profileImage = coach.profileImage;
            if (coach.email) item.email = coach.email;
            if (coach.address) item.address = coach.address;
            if (coach.status !== undefined) item.status = coach.status;
            item["membershipData"] = coach.membershipData;
          }
          return item;
        })
      );
      props.beforeCoach();
      setLoader(false);
    }
  }, [props.coach.updateCoachAuth]);

  const onPageChange = async (page) => {
    const params = {};
    if (filters.name) params.name = filters.name;
    if (filters.email) params.email = filters.email;
    if (filters.address) params.address = filters.address;
    if (filters.statusValue) params.statusValue = filters.statusValue;
    setLoader(true);
    const qs = ENV.objectToQueryString({ ...params, page });
    props.listCoach(qs);
    history.replace({
      pathname: location.pathname,
      search: ENV.objectToQueryString(params),
    });
  };

  const checkMimeType = (event) => {
    //getting file object
    let file = event.target.files;
    //define message container
    let err = "";
    // list allow mime type
    const types = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/svg",
      "image/gif",
    ];

    // compare file type find doesn't matach
    if (types.every((type) => file[0].type !== type)) {
      // create error message and assign to container
      err = file[0].type + " is not a supported format";
    }

    if (err !== "") {
      // if message not same old that mean has error
      event.target.value = null; // discard selected file
      return false;
    }
    return true;
  };

  const editPhotoChange = (event) => {
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

  const submitEdit = (e) => {
    e.preventDefault();
    let formData = new FormData()
    for (const key in editForm)
      formData.append(key, editForm[key])
    props.updateCoach(formData);
    setEditShow(false);
    setLoader(false);
  };

  const delUser = () => {
    setDelModalCheck(false);
    props.deleteCoach(delId);
    setLoader(false)
  };

  const addPhotoChange = (event) => {
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

  const addCoach = (e) => {
    e.preventDefault();
    if(addForm.username === ''){
      setErrors({...errors, username : "name is required" })
    }else if (addForm.email === '') {
      setErrors({ ...errors, email: "Valid Email is required" });
    } else if (addForm.password === '') {
      setErrors({ ...errors, password: "password is required" });
    } else {
      let formData = new FormData()
      for (const key in addForm)
        formData.append(key, addForm[key])
      props.createCoach(formData);
      setAddForm({
        profileImage: "",
        status: true,
        type: 3,
        address: "Arhamsoft johar Town",
      })
      setAddShow(false);
      setLoader(true);
    }
  };
  const rendFilters = () => {
    if (filterCheck) {
      return (
        <Form
          className="row mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            const name = document.getElementById("searchName").value.trim();
            const email = document.getElementById("searchEmail").value.trim();
            const address = document.getElementById("searchAddress").value.trim();
            var select = document.getElementById('memberStatus');
            var statusValue = select.options[select.selectedIndex].value;
            const obj = { ...filters };
            if (name) obj.name = name;
            else obj.name = null;
            if (email) obj.email = email;
            else obj.email = null;
            if (address) obj.address = address;
            else obj.address = null;
            if (statusValue) obj.statusValue = statusValue;
            else obj.statusValue = null;
            if (name || email || address || statusValue) {
              setFilterMsgCheck(false);
              setFilters(obj);
            } else {
              setFilterMsgCheck(true);
            }
          }}
        >
          <div className="col-md-3 ">
            <label htmlFor="searchName">Name</label>
            <input
              id="searchName"
              type="text"
              className="form-control"
              placeholder="Enter name..."
              defaultValue={filters.name}
            />
          </div>
          <div className="col-md-3 ">
            <label htmlFor="searchEmail">Email</label>
            <input
              id="searchEmail"
              type="text"
              className="form-control"
              placeholder="Enter email..."
              defaultValue={filters.email}
            />
          </div>
          <div className="col-md-3 ">
            <label htmlFor="searchAddress">Address</label>
            <input
              id="searchAddress"
              type="text"
              className="form-control"
              placeholder="Enter address..."
              defaultValue={filters.address}
            />
          </div>
          <div className="col-md-3 ">
            <lable>Status</lable>
            <select className='form-control form-select' id = "memberStatus">
                <option value={''}>Select Status</option>
                <option value={'1'}>Active</option>
                <option value={'0'}>InActive</option>
            </select>
        </div>
          <div className="col-md-3  mt-4">
            {(filters.name || filters.email || filters.address || filters.statusValue ) && (
              <button
                className="btn btn-info mr-3 btn-warning"
                type="button"
                onClick={() =>
                  setFilters({
                    name: null,
                    email: null,
                    address: null,
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
      {loader ? (
        <FullPageLoader />
      ) : (
        <Container fluid>
          <Row>
            <Col md={12}>
              <Card.Header className="mb-5 head-grid">
                <div className="d-block  d-sm-flex justify-content-between align-items-center">
                  <Card.Title as="h4">Filter</Card.Title>
                  <Button
                    onClick={() => {
                      setFilterCheck(!filterCheck);
                      setFilterMsgCheck(false);
                    }}
                    className="yellow-bg m-1"
                  >
                    <span>Filters</span>
                    <span className="pl-1 ">
                      <FontAwesomeIcon icon={faFilter} />
                    </span>
                  </Button>
                </div>

                <div>
                  <div className="container-fluid">{rendFilters()}</div>
                </div>
              </Card.Header>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Card className="table-big-boy">
                <div className="d-block  d-sm-flex justify-content-between align-items-center register-users">
                  <Card.Title as="h4">Coaches</Card.Title>
                  { userAuthenticData?.permissionId?.coachingCreate === true ? 
                    <Button
                    onClick={() => {
                      setAddShow(true);
                    }}
                    className="yellow-bg m-0"
                  >
                    <span>Coach</span>
                    <span className="pl-1">
                      <FontAwesomeIcon icon={faUserPlus} />
                    </span>
                  </Button> : ""}
                </div>
                <Card.Body className="table-full-width">
                  <div className=" table-responsive">
                    <Table className="table-striped w-full">
                      <thead>
                        <tr>
                          <th className="text-center td-start">#</th>
                          <th className="td-image">Image</th>
                          <th className="td-name">COACHNAME</th>
                          <th className="td-email">Email</th>
                          <th className="td-email">MemberShip</th>
                          <th className="td-address">Address</th>
                          <th className="td-status">Status</th>
                          <th className="td-created">Created At</th>
                          {userAuthenticData?.permissionId?.coachingView||userAuthenticData?.permissionId?.coachingEdit||userAuthenticData?.permissionId?.coachingDelete?<th className="td-actions">Action</th>:""}
                        </tr>
                      </thead>
                      <tbody>
                        { coaches && coaches.length ? (
                          coaches.map((user, index) => {
                            return (
                              <tr key={index}>
                                <td className="td-start text-center">
                                  {pagination &&
                                    pagination.limit * pagination.page -
                                    pagination.limit +
                                    index +
                                    1}
                                </td>

                                <td className="td-image">
                                  <div className="user-image">
                                    <img
                                      src={
                                        !user?.profileImage ? imagePlaceholder : `${ENV.Backend_Img_Url}${user.profileImage}`
                                      }
                                      alt="userImage"
                                      className="img-fluid"
                                    ></img>
                                  </div>
                                </td>
                                <td className="td-name">{user?.username} {userId = user?._Id}</td>
                                <td className="td-email">{user?.email}</td>
                                <td className="td-email">{user?.membershipData?.title ? user?.membershipData?.title : "N/A"}</td>
                                <td className="td-resident">{user?.address}</td>
                                <td className="td-status">
                                <span className={`status p-1  ${user.status ? `bg-success` : `bg-danger`}`}>
                                  {user.status ? "active" : "inactive"}
                                </span>
                                </td>
                                <td className="td-created">
                                  {user.createdAt ? moment(user.createdAt).format('DD-MM-YYYY HH:MM:SS') : 'N/A'}
                                </td>
                                <td className="td-actions">
                                  <div className="d-flex">
                                  {userAuthenticData?.permissionId?.coachingView === true ?
                                    <OverlayTrigger overlay={
                                      <Tooltip id="tooltip-436082023">
                                        View
                                      </Tooltip> }
                                    >
                                    
                                    <Button
                                      className="btn-link btn-xs"
                                      type="button"
                                      variant="warning"
                                      onClick={() => history.push(`/schedular/view/${user?._id}`)}>
                                      <i className="fas fa-eye"></i>
                                    </Button>
                                    </OverlayTrigger>:""
                                  }
                                  { userAuthenticData?.permissionId?.coachingEdit === true ? 
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
                                          profileImage: user?.profileImage,
                                          username: user?.username,
                                          email: user?.email,
                                          phone: user?.phone,
                                          address: user?.address,
                                          status: user?.status,
                                          _id: user?._id,
                                          membershipId:user?.membershipData?._id ? user?.membershipData?._id : "",
                                        });
                                        setEditShow(true);
                                      }}
                                    >
                                      <i className="fas fa-edit"></i>
                                    </Button>
                                    </OverlayTrigger> :""
                                  }
                                  { userAuthenticData?.permissionId?.coachingDelete === true ?
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip id="tooltip-481441726">
                                          Remove
                                        </Tooltip>
                                      }
                                    >
                                      <Button
                                        className="btn-link btn-xs"
                                        onClick={() => {
                                          setDelModalCheck(true);
                                          selDelId(user?._id);
                                        }}
                                        variant="danger"
                                      >
                                        <i className="fas fa-times"></i>
                                      </Button>
                                    </OverlayTrigger> : "" }
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (

                          <tr>
                            <td colSpan="8" className="text-center">
                              <span className="no-data-found d-block">No Users found</span>
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
      )}

      {/* /////////// */}
      {addShow && (
        <Modal
          show={addShow}
          onHide={() => {
            setAddShow(false);
          }}
        >
          <Form
            onSubmit={(e) => {
              addCoach(e);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="yellow-color">Add Coach</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Name <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  value={addForm.username}
                  onChange={(e) => {
                    setAddForm({ ...addForm, username: e.target.value });
                  }}
                // required
                />
                <span style={{ color: "red" }}>{addForm.username === ''? errors["username"] : ""}</span>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email <span style={{ color: "red" }}>*</span> </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={addForm.email}
                  onChange={(e) => {
                    setAddForm({ ...addForm, email: e.target.value });
                  }}
                // required
                />
                <span style={{ color: "red" }}>{addForm.email === ''? errors["email"] : ""}</span>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password <span style={{ color: "red" }}>*</span> </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  value={addForm.password}
                  onChange={(e) => {
                    setAddForm({ ...addForm, password: e.target.value });
                  }}
                // required
                />
                 <span style={{ color: "red" }}>{addForm.password === ''? errors["password"] : ""}</span>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  rows={3}
                  name="address"
                  value={addForm.address}
                  defaultValue={"ArrhamSoft Johar Town"}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                  <Form.Label>
                      Select Coach MemberShip
                  </Form.Label>
                  <select className='form-control form-select' onChange={(e) => {
                      setAddForm({ ...addForm,membershipId:e.target.value })
                  }}>
                      <option value={'6267a1f73c83b53058d5436f'}>Please Select</option>
                      { props.coachMemberships.coachMembershipList &&  props.coachMemberships.coachMembershipList.length ?
                          props.coachMemberships.coachMembershipList.map((data,i) => {
                          return (
                                  <option key={i} value={data?._id} required>{data.title}</option>
                              );
                          })
                          :
                          "No membership founds"
                      }
                  </select>
                  <span style={{ color: "red" }}>{addForm.membershipId === '' ? errors["membershipId"] : ""}</span>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image <span style={{ color: "red" }}>*</span> </Form.Label>
                <div className="mb-2">
                  <img
                    src={!addForm.profileImage ? userDefaultImg : pic.image}
                    style={{ height: 100, width: 100, objectFit: "contain" }}
                  />
                </div>
                <Form.Control type="file" onChange={addPhotoChange} />
              </Form.Group>
              <Form.Group className="switch-wrapper mb-3">
                <span className="d-block mb-2">Status</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="status"
                    checked={addForm.status ? true : false}
                    onChange={(e) => {
                      setAddForm({ ...addForm, status: e.target.checked });
                    }}
                  />
                  <span className="slider round"></span>
                </label>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={(e) => {
                  setAddShow(false);
                }}
              >
                Close
              </Button>
              <Button variant="primary" type="submit" className="yellow-bg">
                Add Coach
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}

      {/* ///////// */}

      {editShow && (
        <Modal
          show={editShow}
          onHide={() => {
            setEditShow(false);
          }}
        >
          <Form
            onSubmit={(e) => {
              submitEdit(e);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="yellow-color">Update Coach</Modal.Title>
            </Modal.Header>
            <Tabs>
                <TabList>
                  <Tab >Basic Profile</Tab>
                  <Tab onClick={() => history.push(`/schedular/edit/${editForm?._id}`)}>Schedular</Tab>
                </TabList>
            </Tabs>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  value={editForm.username}
                  onChange={(e) => {
                    setEditForm({ ...editForm, username: e.target.value });
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  value={editForm.email}
                  onChange={(e) => {
                    setEditForm({ ...editForm, email: e.target.value });
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  rows={3}
                  name="description"
                  value={editForm.address}
                  onChange={(e) => {
                    setEditForm({ ...editForm, address: e.target.value });
                  }}
                  disabled
                />
                <Form.Label> Select Member Membership  </Form.Label>
                  <select className='form-control form-select' Value={editForm?.membershipId} onChange={(e) => {
                      setEditForm({ ...editForm,membershipId:e.target.value })
                  }}>
                    { props.coachMemberships.coachMembershipList &&  props.coachMemberships.coachMembershipList.length ?
                        props.coachMemberships.coachMembershipList.map((data,i) => {
                        return (
                              <option key={i} value={data?._id} selected={data?._id === editForm?.membershipId ? 'selected' : ''} required>{data.title}</option>
                            );
                        })
                        :
                        "No permission founds"
                    }
                  </select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <div className="mb-2">
                  <img
                    src={editForm?.profileImage ? typeof editForm?.profileImage === 'string' ? `${ENV.Backend_Img_Url}${editForm?.profileImage}` : URL.createObjectURL(editForm?.profileImage) : imagePlaceholder}
                    style={{ height: 100, width: 100, objectFit: "contain" }}
                  />
                </div>
                <Form.Control type="file" onChange={editPhotoChange} />
              </Form.Group>
              <Form.Group className="switch-wrapper mb-3">
                <span className="d-block mb-2">Status</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="status"
                    checked={editForm.status ? true : false}
                    onChange={(e) => {
                      setEditForm({ ...editForm, status: e.target.checked });
                    }}
                  />
                  <span className="slider round"></span>
                </label>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={(e) => {
                  setEditShow(false);
                }}
              >
                Close
              </Button>
              <Button variant="primary" type="submit" className="yellow-bg">
                Update Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}

      {delModalCheck && (
        <Modal show={delModalCheck} onHide={() => setDelModalCheck(false)}>
          <Modal.Header closeButton>
            <Modal.Title className="yellow-color delete-tag mb-5">
              Are you sure you want to delete this Coach?
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer className='d-flex justify-content-center'>
            <Button className="save-btn mr-3" variant="danger" onClick={() => setDelModalCheck(false)}>
              No
            </Button>
            <Button  variant="primary" onClick={delUser} className="yellow-bg save-btn">
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  coach: state.coaches,
  error: state.error,
  coachMemberships: state.coachMemberships,
});

export default connect(mapStateToProps, {
  createCoach,
  listCoach,
  beforeCoach,
  updateCoach,
  deleteCoach,
  listCoachMemberships,
})(Coaches);
