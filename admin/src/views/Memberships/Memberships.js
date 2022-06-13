import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeMembership, createMembership, listMemberships, deleteMembership } from './Memberships.action';
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
const Membership = (props) => {
    const history = useHistory();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search);
    const [memberships, setmemberships] = useState([])
    const [pagination, setPagination] = useState(null);
    const [loader, setLoader] = useState(true);
    const [delModalCheck, setDelModalCheck] = useState(false);
    const [delId, selDelId] = useState(null);
    const [filterCheck, setFilterCheck] = useState(false);
    const [filterMsgCheck, setFilterMsgCheck] = useState(false);
    const [userAuthenticData, setUserAuthenticData] = useState(null)
    const [filters, setFilters] = useState({
        title: searchQuery.get("title"),
        statusValue: searchQuery.get("statusValue"),
    });
    useEffect(() => {
        toast.dismiss();
        props.beforeMembership()
        window.scroll(0, 0);
        props.listMemberships()
    }, [])

    useEffect(() => {
        if (props.memberships.membershipListAuth) {
            const { membershipList, pagination } = props.memberships
            setmemberships(membershipList)
            setPagination(pagination)
        }
    }, [props.memberships.membershipListAuth, props.memberships.membershipList])

    useEffect(() => {
        if (memberships) {
            setLoader(false)
        }
    }, [memberships])

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
        if (filters.title)
            params.title = filters.title;
        if (filters.statusValue)
            params.statusValue = filters.statusValue;    
        setLoader(true);
        const qs = ENV.objectToQueryString({ ...params, page });
        props.listMemberships(qs);
        history.replace({
            pathname: location.pathname, search: ENV.objectToQueryString(params)
        });
    }

    const delMembership = () => {
        setDelModalCheck(false)
        props.deleteMembership(delId)
        setLoader(true)
    }

    const rendFilters = () => {
        if (filterCheck) {
            return (
                <Form className="row mt-3" onSubmit={(e) => {
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
                        setFilterMsgCheck(false)
                        setFilters(obj);
                    }
                    else {
                        setFilterMsgCheck(true)
                    }
                }}>
                    <div className="col-md-3">
                        <label htmlFor="searchTitle ">Title</label>
                        <input id="searchTitle" type="text" className="form-control" placeholder="Enter Title..." defaultValue={filters.title} />
                    </div>
                    <div className="col-md-3">
                        <label>Status</label>
                        <select className='form-control form-select mb-3' id = "memberStatus">
                            <option value={''}>Select Status</option>
                            <option value={'1'}>Active</option>
                            <option value={'0'}>InActive</option>
                        </select>
                    </div>
                    <div className="col-md-3 d-flex justify-content-end align-items-center p-0">
                        {(filters.title || filters.statusValue) && <button className="btn btn-info mr-3 btn-warning" type="button" onClick={() => setFilters({
                            title: null, statusValue:null,
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
                    <FullPageLoader /> :
                    <Container fluid>
                        <Row>
                            <Col md={12}>
                                <Card.Header className="mb-5 head-grid">
                                    <div className='d-block  d-sm-flex justify-content-between align-items-center'>
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
                                    <div className="d-block  d-sm-flex justify-content-between align-items-center register-users">
                                        <Card.Title as="h4">Member Memberships</Card.Title>
                                        { userAuthenticData?.permissionId?.userMemberShipCreate === true ? 
                                            <Button className="yellow-bg m-0">
                                                <span onClick={() => history.push(`/membermembership/create/`)}>
                                                    Member Membership
                                                </span>
                                                <span className="pl-1">
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </span>
                                            </Button>  : ""
                                        }
                                    </div>
                                    <Card.Body className="table-full-width">
                                        <div className=' table-responsive'>
                                            <Table className="table-striped w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center td-start">#</th>
                                                        <th className="td-address">TITLE</th>
                                                        <th className="td-name">DESCRIPTION</th>
                                                        <th className="td-name">GROUP COACHINGS</th>
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
                                                        {userAuthenticData?.permissionId?.userMemberShipView||userAuthenticData?.permissionId?.userMemberShipEdit||userAuthenticData?.permissionId?.userMemberShipDelete?<th className="td-actions">Action</th>:""}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        memberships && memberships.length ?
                                                            memberships.map((data, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="td-start text-center">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>

                                                                        <td className="td-title-detail">
                                                                            {data?.title}
                                                                        </td>
                                                                        <td className="td-description ">
                                                                            <div dangerouslySetInnerHTML={{ __html: data?.description }} />
                                                                        </td>
                                                                        <td className="td-address text-center">
                                                                            {data?.groupCoaching}
                                                                        </td>
                                                                        <td className="td-address text-center">
                                                                            {data?.personalCoachChat}
                                                                        </td>
                                                                        <td className="td-periods">
                                                                            {data?.microHabitLifestyle} 
                                                                        </td>
                                                                        <td className="td-periods text-center">
                                                                            { data?.rootCauseHealthCoaching}
                                                                        </td>
                                                                        <td className="td-tags">
                                                                            {data?.healthyWealthy ? <span className='lable-info'>Health, Longevity & Wealth educational content included</span> : ""} 
                                                                            {data?.personalPackage ? <span className='lable-info'> Personal Package</span> : ""} 
                                                                            {data?.familyPackage ? <span className='lable-info'> Family Package</span>: ""} 
                                                                            {data?.teamsPackage ? <span className='lable-info'> Teams Package </span>: ""} 
                                                                            {
                                                                               !(data?.["healthyWealthy"] || data?.["personalPackage"]
                                                                               || data?.["familyPackage"] || data?.["teamsPackage"])
                                                                                && "N/A" 
                                                                            }
                                                                        </td>
                                                                        <td className="td-periods text-center">
                                                                            { data?.priceInUSD}
                                                                        </td>
                                                                        <td className="td-periods text-center">
                                                                            { data?.priceInCrypto}
                                                                        </td>
                                                                        <td className="td-periods text-center">
                                                                            { data?.period/30}
                                                                        </td>
                                                                        <td className="td-periods text-center">
                                                                            { data?.consultations}
                                                                        </td>
                                                                        <td className="td-periods text-center">
                                                                            { data?.consultationExtentionCostUSD}
                                                                        </td>
                                                                        <td className="td-periods text-center">
                                                                            { data?.consultationExtentionCostCrypto}
                                                                        </td>
                                                                        <td className="td-periods text-center">
                                                                            { data?.sessionExtendPrice ? data?.sessionExtendPrice  : "N/A" }
                                                                        </td>
                                                                        <td className="td-status text-center">
                                                                            <span className={`status p-1 ${data.status ? `bg-success` : `bg-danger`}`}>
                                                                                {data.status ? "active" : "inactive"}
                                                                            </span>
                                                                        </td>

                                                                        <td className="td-actions">
                                                                            <div className='d-flex'>
                                                                                {
                                                                                    userAuthenticData?.permissionId?.userMemberShipView === true ?
                                                                                    <OverlayTrigger
                                                                                    overlay={
                                                                                        <Tooltip id="tooltip-436082023">
                                                                                            View
                                                                                        </Tooltip>
                                                                                        }
                                                                                    >
                                                                                        <Button
                                                                                            className="btn-link btn-xs"
                                                                                            type="button"
                                                                                            variant="warning"
                                                                                            onClick={() => history.push(`/membermembership/view/${data._id}`)}>
                                                                                            <i className="fas fa-eye"></i>
                                                                                        </Button>
                                                                                    </OverlayTrigger>  : ""
                                                                                }
                                                                                {
                                                                                    userAuthenticData?.permissionId?.userMemberShipEdit === true ?
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
                                                                                            onClick={() => history.push(`/membermembership/edit/${data._id}`)}>
                                                                                            <i className="fas fa-edit"></i>
                                                                                        </Button>
                                                                                    </OverlayTrigger> : ""
                                                                                }
                                                                                
                                                                                {
                                                                                    userAuthenticData?.permissionId?.userMemberShipDelete === true ?
                                                                                    <OverlayTrigger
                                                                                    overlay={
                                                                                        <Tooltip id="tooltip-481441726">Remove</Tooltip>
                                                                                        }
                                                                                    >
                                                                                        <Button
                                                                                            className="btn-link btn-xs"
                                                                                            onClick={() => {
                                                                                                setDelModalCheck(true)
                                                                                                selDelId(data._id)
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
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="11" className="text-center">
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
                delModalCheck && <Modal show={delModalCheck} onHide={() => setDelModalCheck(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title className='yellow-color delete-tag mb-5'>Are you sure you want to delete this cms?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer className="d-flex justify-content-center">
                        <Button className='save-btn mr-3' variant="danger" onClick={() => setDelModalCheck(false)}>
                            No
                        </Button>
                        <Button variant="primary" onClick={delMembership} className="yellow-bg save-btn">
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    )
}

const mapStateToProps = state => ({
    memberships: state.memberships,
    error: state.error
})

export default connect(mapStateToProps, { beforeMembership, createMembership, listMemberships, deleteMembership })(Membership)