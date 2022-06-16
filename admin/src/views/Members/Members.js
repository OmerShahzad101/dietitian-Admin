import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import { ENV } from "../../config/config";
import {
  createMember,
  getMembers,
  beforeMember,
  updateMember,
  deleteMember,
} from "./Members.action";
import {listMemberships} from '../Memberships/Memberships.action';
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
import { useHistory, useLocation } from "react-router";
import moment from "moment";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faPlus } from "@fortawesome/free-solid-svg-icons";
import userDefaultImg from "../../assets/img/placeholder.png";
import { ENV } from "../../config/config";

const Members = (props) => {
  
  var calledFunction = true;
  
  const history = useHistory();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);
  const [errors, setErrors] = useState({});
  const [members, setMembers] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loader, setLoader] = useState(true);
  const [addShow, setAddShow] = useState(false);
  const [addForm, setAddForm] = useState({
    profileImage: "",
    status: true,
    type: 1,
    address: "Arhamsoft johar Town",
    membershipId:""
  });
  const [editShow, setEditShow] = useState(false);
  const [editForm, setEditForm] = useState({
    profileImage: "",
  });
  const [delModalCheck, setDelModalCheck] = useState(false);
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
  const[userMembershipData, setUserMembershipData] = useState({
    userId:"",
    membershipId:"",
    membershipData:{},
  });

  const [pic, setPic] = useState({
    image: null,
    _id:'',
  });

  useEffect(() => {
    toast.dismiss();
    window.scroll(0, 0);
    props.getMembers();
    props.listMemberships(calledFunction)
  }, []);

  useEffect(() => {
    if ( props.user.getRegisteredMembers ) {
      const { registeredMembers, pagination } = props.user;
      setMembers(registeredMembers);
      setPagination(pagination);
    }
  }, [ props.user.getRegisteredMembers, props.user.registeredMembers ]);

  useEffect(() => {
    if (members) {
      setLoader(false);
    }
  }, [members]);
   
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
    if (props.user.updatedMemberAuth) {
      const { user } = props.user.updatedMember;
      setMembers(
        members.map((item) => {
          if (item._id === user._id) {
            if (user.username) item.username = user.username;
            if (user.profileImage) item.profileImage = user.profileImage;
            if (user.email) item.email = user.email;
            if (user.address) item.address = user.address;
            if (user.status !== undefined) item.status = user.status;
            item["membershipData"] = user.membershipData;
          }
          return item;
        })
      );
      props.beforeMember();
      setLoader(false);
    }
  }, [props.user.updatedMemberAuth]);

  const onPageChange = async (page) => {
    const params = {};
    if (filters.name) params.name = filters.name;
    if (filters.email) params.email = filters.email;
    if (filters.address) params.address = filters.address;
    if (filters.statusValue) params.statusValue = filters.statusValue;
    setLoader(true);
    const qs = ENV.objectToQueryString({ ...params, page });
    props.getMembers(qs);
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
      props.updateMember(formData);
      setEditShow(false);
      setLoader(false);
  };

  const delMember = () => {
    setDelModalCheck(false);
    props.deleteMember(delId);
    setLoader(true);
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

  const addMember = (e) => {
    e.preventDefault();
    if(addForm.username === ''){
      setErrors({...errors, username : 'username is required'})
    } else if (addForm.email === '') {
      setErrors({ ...errors, email: "Valid Email is required" });
    } else if (addForm.password === '') {
      setErrors({ ...errors, password: "password is required" });
    }  else if (addForm.membershipId === '') {
      setErrors({ ...errors, membershipId: "membershipId is required" });
    } else {
      let formData = new FormData()
    for (const key in addForm)
      formData.append(key, addForm[key])
    props.createMember(formData);
    setAddForm({
      profileImage: "",
      status: true,
      type: 1,
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
          <div className="col-md-3">
            <label htmlFor="searchEmail">Email</label>
            <input
              id="searchEmail"
              type="text"
              className="form-control"
              placeholder="Enter email..."
              defaultValue={filters.email}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="searchAddress">Address</label>
            <input
              id="searchAddress"
              type="text"
              className="form-control"
              placeholder="Enter address..."
              defaultValue={filters.address}
            />
          </div>
          <div className="col-md-3">
            <lable>Status</lable>
            <select className='form-control form-select' id = "memberStatus">
                <option value={''}>Select Status</option>
                <option value={'1'}>Active</option>
                <option value={'0'}>InActive</option>
            </select>
        </div>
          <div className="col-md-3 mt-4 p-0">
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
                    <span className="pl-1">
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
                  <Card.Title as="h4">Clients Management</Card.Title>
                  {/* {
                    userAuthenticData?.permissionId?.userCreate === true ? 
                    <Button
                    onClick={() => {
                      setAddShow(true);
                    }}
                    className="yellow-bg m-0"
                  >
                    <span>ADD</span>
                    <span className="pl-1">
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                  </Button> : ""

                  } */}
                  
                </div>

                <Card.Body className="table-full-width">
                  <div className=" table-responsive">
                    <Table className="table-striped w-full">
                      <thead>
                        <tr>
                          <th className="text-center td-start">#</th>
                          <th className="td-image">Image</th>
                          <th className="td-name">USERNAME</th>
                          <th className="td-email">Email</th>
                          
                          <th className="td-resident">Address</th>
                          <th className="td-status">Status</th>
                          <th className="td-created">Created At</th>
                          { userAuthenticData?.permissionId?.userEdit || userAuthenticData?.permissionId?.userDelete ?<th className="td-actions">Action</th> : ""}
                        </tr>
                      </thead>
                      <tbody>
                        { members && members.length ? (
                          members.map((member, index) => {
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
                                        !member.profileImage ? imagePlaceholder : `${ENV.Backend_Img_Url}${member.profileImage}`
                                      }
                                      alt="userImage"
                                      className="img-fluid"
                                    ></img>
                                  </div>
                                </td>
                                <td className="td-name">{member?.username}</td>
                                <td className="td-email">{member?.email}</td>
                                
                                <td className="td-resident">{member?.address}</td>
                                <td className="td-status">
                                  <span
                                    className={`status p-1 ${member.status ? `bg-success` : `bg-danger`
                                      }`}
                                  >
                                    {member.status ? "active" : "inactive"}
                                  </span>
                                </td>
                                <td className="td-created">
                                  {member.createdAt
                                    ? moment(member.createdAt).format(
                                      "DD-MM-YYYY HH:MM:SS"
                                    )
                                    : "N/A"}
                                </td>
                                <td className="td-actions">
                                  <div className="d-flex">
                                    {
                                      userAuthenticData?.permissionId?.userEdit === true ? 
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
                                          setEditForm({
                                            ...editForm,
                                            profileImage: member.profileImage,
                                            username: member.username,
                                            email: member.email,
                                            address: member.address,
                                            status: member.status,
                                            _id: member._id,
                                            membershipId:member?.membershipData?._id ? member?.membershipData?._id : "",
                                          });
                                          setEditShow(true);
                                        }}
                                      >
                                        <i className="fas fa-edit"></i>
                                      </Button>
                                    </OverlayTrigger> : ""
                                    }
                                    {
                                      userAuthenticData?.permissionId?.userDelete === true ? 
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
                                          selDelId(member._id);
                                        }}
                                        variant="danger"
                                      >
                                        <i className="fas fa-times"></i>
                                      </Button>
                                    </OverlayTrigger> : ""
                                    }
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center">
                              <span className="no-data-found d-block">No clients found</span>
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
      { addShow && (
        <Modal  show={addShow}   onHide={() => {  setAddShow(false);    }} >
          <Form  onSubmit={(e) => { addMember(e);   }}  >
            <Modal.Header closeButton>
              <Modal.Title className="yellow-color">Add Member</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label> 
                  <Form.Control  type="text"   placeholder="Enter name"  name="name" value={addForm.username}
                    onChange={(e) => { setAddForm({ ...addForm, username: e.target.value }) }} required
                  />
                  <span style={{ color: "red" }}>{addForm.username === ''? errors["username"] : ""}</span>
              </Form.Group>

              <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control  type="email" placeholder="Enter email"  name="email" value={addForm.email}
                    onChange={(e) => {
                      setAddForm({ ...addForm, email: e.target.value });
                    }}
                  />
                  <span style={{ color: "red" }}>{addForm.email === '' ? errors["email"] : ""}</span>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control  type="password"  placeholder="Enter password"  name="password"  value={addForm.password}
                  onChange={(e) => {
                    setAddForm({ ...addForm, password: e.target.value });
                  }}  // required
                />
                <span style={{ color: "red" }}>{addForm.password === '' ? errors["password"] : ""}</span>
              </Form.Group>

              <Form.Group className="mb-3">
                  <Form.Label>
                      Select Member MemberShip
                  </Form.Label>
                  <select className='form-control form-select' onChange={(e) => {
                      setAddForm({ ...addForm,membershipId:e.target.value })
                  }}>
                      <option value={'623d51205fa9260fb80d172a'}>Please Select</option>
                      { props.memberships.membershipList &&  props.memberships.membershipList.length ?
                          props.memberships.membershipList.map((data,i) => {
                          return (
                                  <option key={i} value={data?._id} required>{data.title}</option>
                              );
                          })
                          :
                          "No permission founds"
                      }
                  </select>
                  <span style={{ color: "red" }}>{addForm.membershipId === '' ? errors["membershipId"] : ""}</span>
              </Form.Group>
              <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control  type="text" rows={3}    name="address"  value={addForm.address}  defaultValue={"ArrhamSoft Johar Town"}
                    disabled
                  />
              </Form.Group>
              
              <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <div className="mb-2">
                    <img
                      src={!addForm.profileImage ? userDefaultImg : pic.image}
                      style={{ height: 100, width: 100, objectFit: "contain" }}
                    />
                  </div>
                  <Form.Control className='image-upload'  type="file" onChange={addPhotoChange} />
              </Form.Group>
              <Form.Group className="switch-wrapper mb-3">
                <span className="d-block mb-2">Status</span>
                <label className="switch">
                  <input   type="checkbox"  name="status"  checked={addForm.status ? true : false}
                     onChange={(e) => {
                      setAddForm({ ...addForm, status: e.target.checked });
                    }}
                  />
                  <span className="slider round"></span>
                </label>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger"  onClick={(e) => {
                setAddShow(false);
                }}
              >
                Close
              </Button>
              <Button variant="primary" type="submit" className="yellow-bg">
                Add User
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}

      {/* ///////// */}

      {editShow && (
          <Modal show={editShow} onHide={() => { setEditShow(false);  }} >
            <Form onSubmit={(e) => { submitEdit(e);   }} >
                <Modal.Header closeButton>
                  <Modal.Title className="yellow-color">Update Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control  type="text"  placeholder="Enter name"  name="name" value={editForm.username}
                      onChange={(e) => {
                        setEditForm({ ...editForm, username: e.target.value });
                      }}  
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control  type="text"    placeholder="Enter name"  name="name"   value={editForm.email}
                      onChange={(e) => {
                        setEditForm({ ...editForm, email: e.target.value });
                      }}
                    />
                  </Form.Group>
                  
                  <Form.Label> Select Member Membership  </Form.Label>
                  <select className='form-control form-select' Value={editForm.membershipId} onChange={(e) => {
                      setEditForm({ ...editForm,membershipId:e.target.value })
                  }}>
                    { props.memberships.membershipList &&  props.memberships.membershipList.length ?
                        props.memberships.membershipList.map((data,i) => {
                        return (
                            <option key={i} value={data?._id} selected={data?._id === editForm.membershipId ? 'selected' : ''} required>{data.title}</option>
                            );
                        })
                        :
                        "No membership founds"
                    }
                  </select>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text"  rows={3} name="description"  value={editForm.address}
                      onChange={(e) => {
                        setEditForm({ ...editForm, address: e.target.value });
                      }}  disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <div className="mb-2">
                      <img
                        src={editForm.profileImage ? typeof editForm.profileImage === 'string' ? `${ENV.Backend_Img_Url}${editForm.profileImage}` : URL.createObjectURL(editForm.profileImage) : imagePlaceholder}
                        style={{ height: 100, width: 100, objectFit: "contain" }}
                      />
                    </div>
                    <Form.Control type="file" onChange={editPhotoChange} />
                  </Form.Group>

                  <Form.Group className="switch-wrapper mb-3">
                    <span className="d-block mb-2">Status</span>
                    <label className="switch">
                      <input  type="checkbox"  name="status"  checked={editForm.status ? true : false}
                        onChange={(e) => {
                          setEditForm({ ...editForm, status: e.target.checked });
                        }}
                      />
                      <span className="slider round"></span>
                    </label>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button  variant="danger"  onClick={(e) => {
                    setEditShow(false);  }}
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
              Are you sure you want to delete this user?
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer className="d-flex justify-content-center">
            <Button className="save-btn mr-3" variant="danger" onClick={() => setDelModalCheck(false)}>
              No
            </Button>
            <Button variant="primary" onClick={delMember} className="yellow-bg save-btn">
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  error: state.error,
  memberships: state.memberships,
});
  export default connect(mapStateToProps, { createMember, getMembers,  
    beforeMember, updateMember,  deleteMember,  listMemberships })(Members)
