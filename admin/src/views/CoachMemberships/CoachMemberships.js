import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ENV } from "../../config/config";
import {
  beforeCoachMembership,
  createCoachMembership,
  listCoachMemberships,
  deleteCoachMembership,
} from "./CoachMembership.action";
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
const CoachMembership = (props) => {
  const history = useHistory();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);
  const [coachMemberships, setCoachMemberships] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loader, setLoader] = useState(true);
  const [delModalCheck, setDelModalCheck] = useState(false);
  const [delId, selDelId] = useState(null);
  const [filterCheck, setFilterCheck] = useState(false);
  const [filterMsgCheck, setFilterMsgCheck] = useState(false);
  const [userAuthenticData, setUserAuthenticData] = useState(null);
  const [filters, setFilters] = useState({
    title: searchQuery.get("title"),
    statusValue: searchQuery.get("statusValue"),
  });
  useEffect(() => {
    toast.dismiss();
    props.beforeCoachMembership();
    window.scroll(0, 0);
    props.listCoachMemberships();
  }, []);

  useEffect(() => {
    if (props.coachMemberships.coachMembershipListAuth) {
      const { coachMembershipList, pagination } = props.coachMemberships;
      setCoachMemberships(coachMembershipList);
      setPagination(pagination);
    }
  }, [
    props.coachMemberships.coachMembershipListAuth,
    props.coachMemberships.coachMembershipList,
  ]);

  useEffect(() => {
    if (coachMemberships) {
      setLoader(false);
    }
  }, [coachMemberships]);

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

  useEffect(() => {
    onPageChange(1);
  }, [filters]);

  const onPageChange = async (page) => {
    const params = {};
    if (filters.title) params.title = filters.title;
    if (filters.statusValue) params.statusValue = filters.statusValue;
    setLoader(true);
    const qs = ENV.objectToQueryString({ ...params, page });
    props.listCoachMemberships(qs);
    history.replace({
      pathname: location.pathname,
      search: ENV.objectToQueryString(params),
    });
  };
  const delCoachMembership = () => {
    setDelModalCheck(false);
    props.deleteCoachMembership(delId);
    setLoader(true);
  };

  const rendFilters = () => {
    if (filterCheck) {
      return (
        <Form
          className="row mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            const title = document.getElementById("searchTitle").value.trim();
            var select = document.getElementById("memberStatus");
            var statusValue = select.options[select.selectedIndex].value;
            const obj = { ...filters };
            if (title) obj.title = title;
            else obj.title = null;
            if (statusValue) obj.statusValue = statusValue;
            else obj.statusValue = null;
            if (title || statusValue) {
              setFilterMsgCheck(false);
              setFilters(obj);
            } else {
              setFilterMsgCheck(true);
            }
          }}
        >
          <div className="col-md-3">
            <label htmlFor="searchTitle ">Title</label>
            <input
              id="searchTitle"
              type="text"
              className="form-control"
              placeholder="Enter Title..."
              defaultValue={filters.title}
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
            {(filters.title || filters.statusValue) && (
              <button
                className="btn btn-info mr-3 btn-warning"
                type="button"
                onClick={() =>
                  setFilters({
                    title: null,
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
                  <Card.Title as="h4">Dietitian Memberships</Card.Title>
                  {userAuthenticData?.permissionId?.coachMemberShipCreate ? (
                    <Button className="yellow-bg m-0">
                      <span
                        onClick={() =>{
                            debugger;
                            history.push(`/dietitianmembership/create`)}}
                      >
                        ADD
                      </span>
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
                          <th className="td-address">TITLE</th>
                          <th className="td-name">DESCRIPTION</th>
                          <th className="td-name">MEMBERSHIP INFORMATION</th>
                          <th className="td-description text-center">
                            {" "}
                            MEMBERSHIP PERIOD (Months)
                          </th>
                          <th className="td-name">PRICE IN USD</th>
                          <th className="td-status">STATUS</th>
                          {userAuthenticData?.permissionId
                            ?.coachMemberShipView ||
                          userAuthenticData?.permissionId
                            ?.coachMemberShipEdit ||
                          userAuthenticData?.permissionId
                            ?.coachMemberShipDelete ? (
                            <th className="td-actions ">ACTION</th>
                          ) : (
                            ""
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {coachMemberships && coachMemberships.length ? (
                          coachMemberships.map((data, index) => {
                            return (
                              <tr key={index}>
                                <td className="td-start text-center">
                                  {pagination &&
                                    pagination.limit * pagination.page -
                                      pagination.limit +
                                      index +
                                      1}
                                </td>

                                <td className="td-title-detail">
                                  {data?.title}
                                </td>
                                <td className="td-description ">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: data?.description,
                                    }}
                                  />
                                </td>
                                <td className="td-tags">
                                  {data?.businessPractise ? (
                                    <span className="lable-info">
                                      All-In-One Business/Practice Platform
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                  {data?.onBoardTraining ? (
                                    <span className="lable-info">
                                      {" "}
                                      Free onboarding training
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                  {data?.healthMarketing ? (
                                    <span className="lable-info">
                                      Platform, marketing & health coaching
                                      training with certification
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                  {data?.personalPlatform ? (
                                    <span className="lable-info">
                                      Personal platform link & page (like
                                      .healthiwealthi.io/ID)
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                  {data?.onePageDashboard ? (
                                    <span className="lable-info">
                                      One page dashboard
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                  {data?.clientAccessList ? (
                                    <span className="lable-info">
                                      {" "}
                                      Client access list (with icons to chat,
                                      talk or email each client easily){" "}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                  {data?.HipaaSocial ? (
                                    <span className="lable-info">
                                      {" "}
                                      HIPAA compliant video/audio/chat (for
                                      personal consultations){" "}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                  {data?.hipaaGroupCoaching ? (
                                    <span className="lable-info">
                                      {" "}
                                      HIPAA compliant group coaching
                                      video/audio/chat (for large groups){" "}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                  {!(
                                    data?.["businessPractise"] ||
                                    data?.["onBoardTraining"] ||
                                    data?.["healthMarketing"] ||
                                    data?.["personalPlatform"] ||
                                    data?.["onePageDashboard"] ||
                                    data?.["clientAccessList"] ||
                                    data?.["HipaaSocial"] ||
                                    data?.["hipaaGroupCoaching"]
                                  ) && "N/A"}
                                </td>
                                <td className="td-periods text-center">
                                  {data?.period / 30}
                                </td>
                                <td className="td-periods text-center">
                                  {data?.priceInUSD ? data?.priceInUSD : "N/A"}
                                </td>
                                <td className="td-status text-center">
                                  <span
                                    className={`status p-1 ${
                                      data.status ? `bg-success` : `bg-danger`
                                    }`}
                                  >
                                    {data.status ? "active" : "inactive"}
                                  </span>
                                </td>

                                <td className="td-actions">
                                  <div className="d-flex">
                                    {userAuthenticData?.permissionId
                                      ?.coachMemberShipView === true ? (
                                      <OverlayTrigger
                                        overlay={
                                          <Tooltip id="tooltip-436082023">
                                            View
                                          </Tooltip>
                                        }
                                        // placement="left"
                                      >
                                        <Button
                                          className="btn-link btn-xs"
                                          type="button"
                                          variant="warning"
                                          onClick={() =>
                                            history.push(
                                              `/dietitianmembership/view/${data._id}`
                                            )
                                          }
                                        >
                                          <i className="fas fa-eye"></i>
                                        </Button>
                                      </OverlayTrigger>
                                    ) : (
                                      ""
                                    )}
                                    {userAuthenticData?.permissionId
                                      ?.coachMemberShipEdit === true ? (
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
                                          onClick={() =>
                                            history.push(
                                              `/dietitianmembership/edit/${data._id}`
                                            )
                                          }
                                        >
                                          <i className="fas fa-edit"></i>
                                        </Button>
                                      </OverlayTrigger>
                                    ) : (
                                      ""
                                    )}
                                    {userAuthenticData?.permissionId
                                      ?.coachMemberShipDelete === true ? (
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
                                            selDelId(data._id);
                                          }}
                                          variant="danger"
                                        >
                                          <i className="fas fa-times"></i>
                                        </Button>
                                      </OverlayTrigger>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="11" className="text-center">
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
              Are you sure you want to delete this membership?
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
              onClick={delCoachMembership}
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
  coachMemberships: state.coachMemberships,
  error: state.error,
});

export default connect(mapStateToProps, {
  beforeCoachMembership,
  createCoachMembership,
  listCoachMemberships,
  deleteCoachMembership,
})(CoachMembership);
