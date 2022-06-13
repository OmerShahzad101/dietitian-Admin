import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import imagePlaceholder from "assets/img/placeholder.png";
import { useHistory, useLocation, } from 'react-router';
import moment from "moment";
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons'
import { listUserMembership } from './UsersMemberships.action'
const UserMemberships = (props) => {
    const history = useHistory();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search);
    const [userMemberships, setUserMemberships] = useState([])
    const [pagination, setPagination] = useState(null);
    const [loader, setLoader] = useState(true);
    const [delModalCheck, setDelModalCheck] = useState(false);
    const [delId, selDelId] = useState(null);
    const [filterCheck, setFilterCheck] = useState(false);
    const [filterMsgCheck, setFilterMsgCheck] = useState(false);
    const [userAuthenticData, setUserAuthenticData] = useState(null)
    const [filters, setFilters] = useState({
        userId:searchQuery.get("userId"),
        membershipId: searchQuery.get("membershipId"),
        statusValue: searchQuery.get("statusValue"),
    });
    useEffect(() => {
        toast.dismiss();
        window.scroll(0, 0);
        props.listUserMembership()
    }, [])

    useEffect(() => {
        if (props.userMembershipState.getUserMembership) {
            const { userMembership, pagination } = props.userMembershipState
            setUserMemberships(userMembership)
            setPagination(pagination)
        }
    }, [props.userMembershipState.getUserMembership, props.userMembershipState.userMembership])

    useEffect(() => {
        if (userMemberships) {
            setLoader(false)
        }
    }, [userMemberships])

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
            setLoader(false)
    }, [props.error.error])

    ///
    useEffect(() => {
        onPageChange(1);
    }, [filters]);

    const onPageChange = async (page) => {
        const params = {};
        if (filters.userId) params.userId = filters.userId;
        if (filters.membershipId) params.membershipId = filters.membershipId;
        if (filters.statusValue) params.statusValue = filters.statusValue;
        setLoader(true);
        const qs = ENV.objectToQueryString({ ...params, page });
        props.listUserMembership(qs);
        history.replace({
            pathname: location.pathname, search: ENV.objectToQueryString(params)
        });
    }

    const rendFilters = () => {
        if (filterCheck) {
            return (
                <Form className="row mt-3" onSubmit={(e) => {
                    e.preventDefault();
                    var select1 = document.getElementById('users');
                    var userId = select1.options[select1.selectedIndex].value;
                    var select2 = document.getElementById('memberships');
                    var membershipId = select2.options[select2.selectedIndex].value;
                    var select3 = document.getElementById('memberStatus');
                    var statusValue = select3.options[select3.selectedIndex].value;
                    const obj = { ...filters };
                    if (userId) obj.userId = userId;
                    else obj.userId = null;
                    if (membershipId) obj.membershipId = membershipId;
                    else obj.membershipId = null;
                    if (statusValue) obj.statusValue = statusValue;
                    else obj.statusValue = null;
                    if (userId || membershipId || statusValue ) {
                        setFilterMsgCheck(false)
                        setFilters(obj);
                    }
                    else {
                        setFilterMsgCheck(true)
                    }
                }}>
                    <div className="col-md-3">
                        <label>User</label>
                        <select className='form-control form-select' id="users">
                            <option value={''}>Select User</option>
                            { userMemberships &&  userMemberships.length ?
                                userMemberships.map((data,i) => {
                                return (
                                        <option key={i} value={data?.userData?._id} required>{data?.userData?.username}</option>
                                    );
                                })
                                :
                                ""
                            }
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label>Membership</label>
                        <select className='form-control form-select' id = "memberships">
                            <option value={''}>Select Membership</option>
                            { userMemberships &&  userMemberships.length ?
                                userMemberships.map((data,i) => {
                                return (
                                        <option key={i} value={data?.membershipData?._id} required>{data?.membershipData?.title}</option>
                                    );
                                })
                                :
                                ""
                            }
                        </select>
                    </div>
                    <div className="col-md-3 ">
                        <label>Status</label>
                        <select className='form-control form-select mb-3' id = "memberStatus">
                            <option value={''}>Select Status</option>
                            <option value={'1'}>Active</option>
                            <option value={'0'}>InActive</option>
                        </select>
                    </div>
                    <div className="col-md-3 d-flex justify-content-end align-items-center p-0">
                        {(filters.userId || filters.membershipId || filters.statusValue) && <button className="btn btn-info mr-3 btn-warning" type="button" onClick={() => setFilters({
                            userId: null,
                            membershipId:null,
                            statusValue:null,
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
                loader ? <FullPageLoader /> :
                    <Container fluid>
                        <Row>
                            <Col md={12}>
                                <Card.Header className="mb-5 head-grid">
                                    <div className="d-block  d-sm-flex justify-content-between align-items-center">
                                        <Card.Title as="h4">Filter</Card.Title>
                                        <Button onClick={() => {
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
                                        <Card.Title as="h4">Member Memberships</Card.Title>
                                    </div>
                                    <Card.Body className="table-full-width">
                                        <div className=' table-responsive'>
                                            <Table className="table-striped w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center td-start">#</th>
                                                        <th className="text-center td-start">MEMBER NAME</th>
                                                        <th className="td-address text-center">TITLE</th>
                                                        <th className="td-name text-center">DESCRIPTION</th>
                                                        <th className="td-name text-center">GROUP COACHINGS</th>
                                                        <th className="td-name text-center">PERSONAL COACH CHATS</th>
                                                        <th className="td-name">MICRO-HABIT LIFESTYLE PRESCRIPTIONS®</th>
                                                        <th className="td-name">PERSONAL ROOT-CAUSE HEALTH COACHING CONSULTAIONS</th>
                                                        <th className="td-name">MEMBERSHIP INFORMATION</th>
                                                        <th className="td-description text-center">PRICE (USD)</th>
                                                        <th className="td-description text-center">PRICE(RxHEAL)</th>
                                                        <th className="td-description text-center">MEMBERSHIP PERIOD (Months)</th>
                                                        <th className="td-description text-center">CONSULTATION</th>
                                                        <th className="td-description text-center">CONSULTATION EXTENTION COST (USD Per minute)</th>
                                                        <th className="td-description text-center">CONSULTATION EXTENTION COST (RxHEAL Per minute)</th>
                                                        <th className="td-description text-center">SESSION EXTEND PRICE</th>
                                                        <th className="td-status">STATUS</th>
                                                        <th className="td-status">CREATED AT</th>
                                                        {userAuthenticData?.permissioId?.userMembershipRecordEdit === true ? <th className="td-actions ">ACTION</th>:""}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        userMemberships && userMemberships.length ?
                                                            userMemberships.map((data, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="td-start text-center">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="td-user text-center"> {data?.userData?.username ? data?.userData?.username : "N/A" } </td>
                                                                        <td className="td-resident text-center">  {data?.membershipData?.title ? data?.membershipData?.title : "N/A"} </td>
                                                                        <td className="td-description text-center">
                                                                            <div dangerouslySetInnerHTML={{ __html: data?.membershipData?.description ? data?.membershipData?.description : "N/A" }} />
                                                                        </td>
                                                                        <td className='td-chat text-center'>
                                                                            { data?.membershipData?.groupCoaching ? data?.membershipData?.groupCoaching : "N/A"}
                                                                        </td>
                                                                        <td className='td-chat text-center'>
                                                                            { data?.membershipData?.personalCoachChat ? data?.membershipData?.personalCoachChat : "N/A" }
                                                                        </td>
                                                                        <td className='td-details text-center'>
                                                                            {data?.membershipData?.microHabitLifestyle ? data?.membershipData?.microHabitLifestyle:"N/A" }
                                                                        </td>
                                                                        <td className='td-chat text-center'>
                                                                            { data?.membershipData?.rootCauseHealthCoaching ? data?.membershipData?.rootCauseHealthCoaching : "N/A"}
                                                                        </td>
                                                                        <td className="td-resident">
                                                                          {data?.membershipData?.healthyWealthy ?   <span className='lable-info'> Health, Longevity & Wealth educational content included</span> : ""} 
                                                                            {data?.membershipData?.personalPackage ? <span className='lable-info'> Personal Package</span> : ""} 
                                                                            {data?.membershipData?.familyPackage ? <span className='lable-info'>Family Package </span>: ""} 
                                                                            {data?.membershipData?.teamsPackage ? <span className='lable-info'>Teams Package </span>: ""}

                                                                            {
                                                                               !(data?.membershipData?.["healthyWealthy"] || data?.membershipData?.["personalPackage"]
                                                                               || data?.membershipData?.["familyPackage"] || data?.membershipData?.["teamsPackage"] )
                                                                                && "N/A" 
                                                                            }
                                                                        </td>
                                                                        <td className='td-chat text-center'>
                                                                            { data?.membershipData?.priceInUSD ? data?.membershipData?.priceInUSD : "N/A"}
                                                                        </td>
                                                                        <td className='td-chat text-center'>
                                                                            { data?.membershipData?.priceInCrypto ? data?.membershipData?.priceInCrypto : "N/A"}
                                                                        </td>
                                                                        <td className='td-periods'>
                                                                            {data?.membershipData?.period/30 }
                                                                        </td>
                                                                        <td className='text-center'>
                                                                            {data?.membershipData?.consultations ? data?.membershipData?.consultations : "N/A"  }
                                                                        </td>
                                                                        <td className='td-chat text-center'>
                                                                            { data?.membershipData?.consultationExtentionCostUSD ? data?.membershipData?.consultationExtentionCostUSD : "N/A"}
                                                                        </td>
                                                                        <td className='td-chat text-center'>
                                                                            { data?.membershipData?.consultationExtentionCostCrypto ? data?.membershipData?.consultationExtentionCostCrypto : "N/A"}
                                                                        </td>
                                                                        <td className='td-chat text-center'>
                                                                            { data?.membershipData?.sessionExtendPrice ? data?.membershipData?.sessionExtendPrice : "N/A"}
                                                                        </td>
                                                                        <td className="td-status">
                                                                            <span className={`status p-1 ${data?.status? `bg-success` : `bg-danger`
                                                                            }`}>
                                                                                {data?.status? "active" : "inactive"}
                                                                            </span>
                                                                        </td>
                                                                        <td className="td-date">
                                                                            {data.createdAt ? moment(data.createdAt).format('DD-MM-YYYY HH:MM:SS') : 'N/A'}
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            {userAuthenticData?.permissioId?.userMembershipRecordEdit === true ? 
                                                                            <OverlayTrigger overlay= {
                                                                                <Tooltip id="tooltip-436082023">
                                                                                    Edit
                                                                                </Tooltip>
                                                                            }>
                                                                            <Button
                                                                                className="btn-link btn-xs"
                                                                                type="button"
                                                                                variant="warning"
                                                                                onClick={() => history.push(`/usermembership/edit/${data?._id}`)}>
                                                                                <i className="fas fa-edit"></i>
                                                                            </Button>
                                                                            </OverlayTrigger> : ""}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="18" className="text-center">
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
    </>
    )
}
const mapStateToProps = state => ({
    userMembershipState: state.userMemberships,
    error: state.error
})

export default connect(mapStateToProps, { listUserMembership }) (UserMemberships)