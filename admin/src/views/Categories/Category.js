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
import { listCategory, deleteCategory } from './Category.action'
const Category = (props) => {
    console.log(`id---,.,,.`, props)
    const history = useHistory();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search);
    const [categoryData, setCategoryData] = useState([])
    const [pagination, setPagination] = useState(null);
    const [loader, setLoader] = useState(true);
    const [delModalCheck, setDelModalCheck] = useState(false);
    const [delId, selDelId] = useState(null);
    const [filterCheck, setFilterCheck] = useState(false);
    const [filterMsgCheck, setFilterMsgCheck] = useState(false);
    const [userAuthenticData, setUserAuthenticData] = useState(null)
    const [filters, setFilters] = useState({
        name: searchQuery.get("name"),
        statusValue: searchQuery.get("statusValue"),
    });
    useEffect(() => {
        toast.dismiss();
        window.scroll(0, 0);
        props.listCategory()
    }, [])

    useEffect(() => {
        if (props.category.categoryListAuth) {
            const { categoryList, pagination } = props.category
            setCategoryData(categoryList)
            setPagination(pagination)
        }
    }, [props.category.categoryListAuth, props.category.categoryList])

    useEffect(() => {
        if (categoryData) {
            setLoader(false)
        }
    }, [categoryData])
    
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

    useEffect(() => {
        onPageChange(1);
    }, [filters]);

    const onPageChange = async (page) => {
        const params = {};
        if (filters.name)
            params.name = filters.name;
        if (filters.statusValue)
            params.statusValue = filters.statusValue;
        setLoader(true);
        const qs = ENV.objectToQueryString({ ...params, page });
        props.listCategory(qs);
        history.replace({
            pathname: location.pathname, search: ENV.objectToQueryString(params)
        });
    }

    const delCategory = () => {
        setDelModalCheck(false)
        props.deleteCategory(delId)
        setLoader(true)
    }

    const rendFilters = () => {
        if (filterCheck) {
            return (
                <Form className="row mt-3" onSubmit={(e) => {
                    e.preventDefault();
                    const name = document.getElementById("searchName").value.trim();
                    var select = document.getElementById('memberStatus');
                    var statusValue = select.options[select.selectedIndex].value;
                    const obj = { ...filters };
                    if (name)
                        obj.name = name;
                    else
                        obj.name = null;
                    if (statusValue)
                        obj.statusValue = statusValue;
                    else
                        obj.statusValue = null;    
                    if  ( name || statusValue ) {
                        setFilterMsgCheck(false)
                        setFilters(obj);
                    }
                    else {
                        setFilterMsgCheck(true)
                    }
                }}>
                    <div className="col-md-3">
                        <label htmlFor="searchName">Name</label>
                        <input id="searchName" type="text" className="form-control" placeholder="Enter name..." defaultValue={filters.name} />
                    </div>
                    <div className="col-md-3 ">
                        <label>Status</label>
                        <select className='form-control form-select' id = "memberStatus">
                            <option value={''}>Select Status</option>
                            <option value={'1'}>Active</option>
                            <option value={'0'}>InActive</option>
                        </select>
                    </div>

                    <div className="col-md-3 d-flex justify-content-end align-items-end p-0">
                        {(filters.name || filters.statusValue) && <button className="btn btn-info mr-3 btn-warning" type="button" onClick={() => setFilters({
                            name: null, 
                            statusValue: null,
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
                                    <div className='d-flex justify-content-between align-items-center'>
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
                                    <div className="d-flex justify-content-between align-items-center register-users">
                                        <Card.Title as="h4">Categories</Card.Title>
                                       {
                                           userAuthenticData?.permissionId?.categoryCreate === true ?
                                            <Button className="yellow-bg m-0">
                                            <span onClick={() => history.push(`/category/create`)}>
                                             Category
                                            </span>
                                            <span className="pl-1">
                                                <FontAwesomeIcon icon={faPlus} />
                                            </span>
                                            </Button> : ""}
                                    </div>
                                    <Card.Body className="table-full-width">
                                        <div className=' table-responsive'>
                                            <Table className="table-striped w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center td-start">#</th>
                                                        <th className="td-name">Logo</th>
                                                        <th className="td-name">NAME</th>
                                                        <th className="td-name">Description</th>
                                                        <th className="td-status">Status</th>
                                                        {userAuthenticData?.permissionId?.categoryEdit||userAuthenticData?.permissionId?.categoryDelete?<th className="td-actions">Action</th>:""}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    categoryData && categoryData.length ?
                                                    categoryData.map((data, index) => {
                                                        return (
                                                            <tr key={index}>

                                                                <td className="td-start text-center">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                <td className="td-image">
                                                                    <div className="user-image">
                                                                        <img
                                                                            src= { !data.image ? imagePlaceholder : `${ENV.Backend_Img_Url}${data.image}` }
                                                                            alt="userImage"
                                                                            className="img-fluid"
                                                                        >
                                                                        </img>
                                                                    </div>
                                                                </td>
                                                                <td className="td-name">
                                                                    {data?.title}
                                                                </td>
                                                                <td className="td-name">
                                                                    {data?.email}
                                                                </td>
                                                                <td className="td-status">
                                                                    <span className={`status p-1 ${data.status ? `bg-success` : `bg-danger`}`}>
                                                                        {data.status ? "active" : "inactive"}
                                                                    </span>
                                                                </td>
                                                                <td className="td-actions">
                                                                    
                                                                    {
                                                                        userAuthenticData?.permissionId?.categoryEdit ? 
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
                                                                            onClick={() => history.push(`/category/edit/${data._id}`)}>
                                                                            <i className="fas fa-edit"></i>
                                                                        </Button>
                                                                        </OverlayTrigger> : ""}
                                                                       {
                                                                           userAuthenticData?.permissionId?.categoryDelete ? 
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
                                                                            </OverlayTrigger> : ""}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                    :
                                                    <tr>
                                                        <td colSpan="5" className="text-center">
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
                        <Modal.Title className='yellow-color delete-tag mb-5'>Are you sure you want to delete this category?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer className='d-flex justify-content-center'>
                        <Button className='save-btn mr-3' variant="danger" onClick={() => setDelModalCheck(false)}>
                            No
                        </Button>
                        <Button variant="primary" onClick={delCategory} className="yellow-bg save-btn">
                            Yes
                        </Button>
                    </Modal.Footer>
                    </Modal>
            }
        </>
    )
}

const mapStateToProps = state => ({
    category: state.category,
    error: state.error
})

export default connect(mapStateToProps, { listCategory, deleteCategory })(Category)