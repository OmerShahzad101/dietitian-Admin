import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ENV } from "../../config/config";
import {
  beforeBlog,
  createBlog,
  listBlog,
  updateBlog,
  deleteBlog,
} from "./Blogs.action";
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
const Blog = (props) => {
  const history = useHistory();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);
  const [blog, setBlog] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loader, setLoader] = useState(true);
  const [delModalCheck, setDelModalCheck] = useState(false);
  const [delId, selDelId] = useState(null);
  const [filterCheck, setFilterCheck] = useState(false);
  const [filterMsgCheck, setFilterMsgCheck] = useState(false);
  const [userAuthenticData, setUserAuthenticData] = useState(null);
  const [filters, setFilters] = useState({
    name: searchQuery.get("name"),
    statusValue: searchQuery.get("name"),
  });
  useEffect(() => {
    toast.dismiss();
    props.beforeBlog();
    window.scroll(0, 0);
    props.listBlog();
  }, []);

  useEffect(() => {
    if (props.blog.blogListAuth) {
      const { blogList, pagination } = props.blog;
      console.log(props, "props");
      setBlog(blogList);
      setPagination(pagination);
    }
  }, [props.blog.blogListAuth, props.blog.blogList]);

  useEffect(() => {
    if (blog) {
      setLoader(false);
    }
  }, [blog]);

  useEffect(() => {
    if (ENV.getUserKeys("encuse")) {
      let obj = ENV.getUserKeys();
      setUserAuthenticData(obj);
    }
  }, []);

  useEffect(() => {
    if (userAuthenticData) {
      setLoader(false);
    }
  }, [userAuthenticData]);

  // when an error is received
  useEffect(() => {
    if (props.error.error) setLoader(false);
  }, [props.error.error]);

  ///
  useEffect(() => {
    onPageChange(1);
  }, [filters]);

  const onPageChange = async (page) => {
    const params = {};
    if (filters.name) params.name = filters.name;
    if (filters.statusValue) params.statusValue = filters.statusValue;
    setLoader(true);
    const qs = ENV.objectToQueryString({ ...params, page });
    props.listBlog(qs);
    history.replace({
      pathname: location.pathname,
      search: ENV.objectToQueryString(params),
    });
  };

  const delBlog = () => {
    setDelModalCheck(false);
    props.deleteBlog(delId);
    setLoader(true);
  };

  const rendFilters = () => {
    if (filterCheck) {
      return (
        <Form
          className="row mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            const name = document.getElementById("searchName").value.trim();
            var select = document.getElementById("memberStatus");
            var statusValue = select.options[select.selectedIndex].value;
            const obj = { ...filters };
            if (name) obj.name = name;
            else obj.name = null;
            if (statusValue) obj.statusValue = statusValue;
            else obj.statusValue = null;
            if (name || statusValue) {
              setFilterMsgCheck(false);
              setFilters(obj);
            } else {
              setFilterMsgCheck(true);
            }
          }}
        >
          <div className="col-md-3">
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
            <label>Status</label>
            <select className="form-control form-select mb-3" id="memberStatus">
              <option value={""}>Select Status</option>
              <option value={"1"}>Active</option>
              <option value={"0"}>InActive</option>
            </select>
          </div>
          <div className="col-md-3 d-flex justify-content-end align-items-center p-0">
            {(filters.name || filters.statusValue) && (
              <button
                className="btn btn-info mr-3 btn-warning"
                type="button"
                onClick={() =>
                  setFilters({
                    name: null,
                    statusValue: null,
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
                  {/* <Button className="yellow-bg m-0">
                                        <span onClick={() => history.push(`/blog/create/`)}>
                                            CMS
                                        </span>
                                        <span className="pl-1">
                                            <FontAwesomeIcon icon={faPlus} />
                                        </span> 
                                    </Button> */}

                  <Button
                    onClick={() => {
                      setFilterCheck(!filterCheck);
                      setFilterMsgCheck(false);
                    }}
                    className="yellow-bg m-0"
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
                  <Card.Title as="h4">Blogs Management</Card.Title>
                  {userAuthenticData?.permissionId?.blogCreate ? (
                    <Button
                      onClick={() => history.push(`/blog/create`)}
                      className="yellow-bg m-0"
                    >
                      <span>ADD</span>
                      <span className="pl-1">
                        <FontAwesomeIcon icon={faPlus} />
                      </span>
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
                <Card.Body className="table-full-width">
                  <div className=" table-responsive">
                    <Table className="table-striped w-full">
                      <thead>
                        <tr>
                          <th className="text-center td-start">#</th>
                          <th className="td-name">Image</th>
                          <th className="td-name">NAME</th>
                          <th className="td-name">Category</th>
                          <th className="td-status">Excerpt</th>
                          <th className="td-name">Status</th>
                          {userAuthenticData?.permissionId?.blogEdit ||
                          userAuthenticData?.permissionId?.blogDelete ? (
                            <th className="td-actions">Action</th>
                          ) : (
                            ""
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {blog && blog.length ? (
                          blog.map((blog, index) => {
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
                                        !blog?.image
                                          ? imagePlaceholder
                                          : `${ENV.Backend_Img_Url}${blog?.image}`
                                      }
                                      alt="userImage"
                                      className="img-fluid"
                                    ></img>
                                  </div>
                                </td>
                                <td className="td-name">{blog?.title}</td>
                                <td className="td-name">
                                  {blog?.categorylist?.title}
                                </td>
                                <td className="td-name">{blog?.excerpt}</td>
                                <td className="td-status">
                                  <span
                                    className={`status p-1 ${
                                      blog?.status ? `bg-success` : `bg-danger`
                                    }`}
                                  >
                                    {blog?.status ? "active" : "inactive"}
                                  </span>
                                </td>
                                <td className="td-actions">
                                  {userAuthenticData?.permissionId?.blogEdit ===
                                  true ? (
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
                                        onClick={() =>
                                          history.push(`/blog/edit/${blog._id}`)
                                        }
                                      >
                                        <i className="fas fa-edit"></i>
                                      </Button>
                                    </OverlayTrigger>
                                  ) : (
                                    ""
                                  )}
                                  {userAuthenticData?.permissionId
                                    ?.blogDelete === true ? (
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
                                          selDelId(blog._id);
                                        }}
                                        variant="danger"
                                      >
                                        <i className="fas fa-times"></i>
                                      </Button>
                                    </OverlayTrigger>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              <span className="no-data-found d-block">
                                No Users found
                              </span>
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

      {delModalCheck && (
        <Modal show={delModalCheck} onHide={() => setDelModalCheck(false)}>
          <Modal.Header closeButton>
            <Modal.Title className="yellow-color delete-tag mb-5">
              Are you sure you want to delete this blog?
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer className="d-flex justify-content-center">
            <Button
              className="save-btn mr-3"
              variant="danger"
              onClick={() => setDelModalCheck(false)}
            >
              No
            </Button>
            <Button
              variant="primary"
              onClick={delBlog}
              className="yellow-bg save-btn"
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  blog: state.blog,
  error: state.error,
});

export default connect(mapStateToProps, {
  beforeBlog,
  createBlog,
  listBlog,
  updateBlog,
  deleteBlog,
})(Blog);
