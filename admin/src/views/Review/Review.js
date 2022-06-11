import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeReview, listReview, updateReview, deleteReview } from './Review.action'
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { useHistory, useLocation } from 'react-router';
import moment from "moment";
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import ReactStars from "react-rating-stars-component";

const Review = (props) => {
    const history = useHistory();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search);
    const [reviews, setReviews] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [loader, setLoader] = useState(true);
    const [editShow, setEditShow] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [delModalCheck, setDelModalCheck] = useState(false);
    const [delId, selDelId] = useState(null);
    const [filterCheck, setFilterCheck] = useState(false);
    const [filterMsgCheck, setFilterMsgCheck] = useState(false);
    const [stars, setStars] = useState(null);
    const [filters, setFilters] = useState({
        reviewBy: searchQuery.get("reviewBy"),
        reviewTo: searchQuery.get("reviewTo"),
        score: searchQuery.get("score"),
        status: searchQuery.get("status"),
    });

    useEffect(() => {
        toast.dismiss();
        window.scroll(0, 0);
        props.beforeReview();
        props.listReview()
    }, [])

    useEffect(() => {
        if (props.review.reviewListAuth) {
            const { reviewList, pagination } = props.review
            setReviews(reviewList)
            setPagination(pagination)
            // props.beforeReview()
        }
    }, [props.review.reviewListAuth, props.review.reviewList])

    useEffect(() => {
        if (reviews) {
            setLoader(false)
        }
    }, [reviews])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    useEffect(() => {
        onPageChange(1);
    }, [filters, props.review.delReviewAuth])

    useEffect(() => {
        if (props.review.updateReviewAuth) {
            const { review } = props.review
            setReviews(
                reviews.map((item) => {
                    if (item._id == review._id) {
                        item["status"] = review?.status;
                        item["score"] = review?.score
                    }
                    return (item)
                })
            )
            console.log(`reviews after edit`, reviews)
            props.beforeReview()
            setLoader(false)
        }
    }, [props.review.updateReviewAuth, props.review.review])

    useEffect(() => {
        if (props.review.delReviewAuth) {
            const { success } = props.review.delReview
            if (success) {
                props.beforeReview()
                setReviews(
                    reviews.filter((item) => {
                        if (item._id !== delId) {
                            return (item)
                        }
                    })
                )
            }
            setLoader(false)
        }
    }, [props.review.delReviewAuth])

    const onPageChange = async (page) => {
        const params = {};
        if (filters.reviewBy)
            params.reviewBy = filters.reviewBy;
        if (filters.reviewTo)
            params.reviewTo = filters.reviewTo;
        if (filters.score)
            params.score = filters.score;
        if (filters.statusValue)
            params.statusValue = filters.statusValue;
        setLoader(true);
        const qs = ENV.objectToQueryString({ ...params, page });
        props.listReview(qs);
        history.replace({
            pathname: location.pathname, search: ENV.objectToQueryString(params)
        });
    }
    const submitEdit = (e) => {
        e.preventDefault()
        let data = { ...editForm, reviewBy: editForm.reviewBy._id, reviewTo: editForm.reviewTo._id }
        props.updateReview(data)
        setEditShow(false)
        setLoader(true)
    }
    const delUser = () => {
        setDelModalCheck(false)
        props.deleteReview(delId)
        setLoader(true)
    }

    var dummyStars = {
        isHalf:true,
        size:16,
        value:stars,
        onChange:(newValue) => {
            setStars(newValue)
        }
    }
    const rendFilters = () => {
        if (filterCheck) {
            return (
                <Form className="row mt-4" onSubmit={(e) => {
                    e.preventDefault();
                    const reviewBy = document.getElementById("searchReviewby").value.trim();
                    const reviewTo = document.getElementById("searchReviewTo").value.trim();
                    const score = stars;
                    var select = document.getElementById('searchStatus');
                    var statusValue = select.options[select.selectedIndex].value;
                    const obj = { ...filters };
                    if (reviewBy)
                        obj.reviewBy = reviewBy;
                    else
                        obj.reviewBy = null;
                    if (reviewTo)
                        obj.reviewTo = reviewTo;
                    else
                        obj.reviewTo = null;
                    if (score)
                        obj.score = score;
                    else
                        obj.score = null;
                    if (statusValue)
                        obj.statusValue = statusValue;
                    else
                        obj.statusValue = null;
                    if (reviewBy || reviewTo || score || statusValue) {
                        setFilterMsgCheck(false)
                        setFilters(obj);
                    }
                    else {
                        setFilterMsgCheck(true)
                    }
                }}>
                    <div className="col-md-3 p-0">
                        <label htmlFor="searchReviewby">Review By</label>
                        <input id="searchReviewby" type="text" className="form-control" placeholder="Enter name..." defaultValue={filters.reviewby} />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="searchReviewTo">Review To</label>
                        <input id="searchReviewTo" type="text" className="form-control" placeholder="Enter name..." defaultValue={filters.reviewTo} />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="searchRating">Rating</label>
                       <div className='form-control'><ReactStars {...dummyStars}/></div>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="searchStatus">Status</label>
                        <select id='searchStatus' className="form-control" name='status'>
                        <option value={''}>Select Status</option>
                            <option value={'1'}>Active</option>
                            <option value={'0'}>InActive</option>
                        </select>
                    </div>
                    <div className="col-md-3 mt-4 p-0">
                        {(filters.reviewBy || filters.reviewTo || filters.score || filters.statusValue) && <button className="btn btn-info mr-3 btn-warning" type="button" onClick={() => setFilters({
                            reviewBy: null,reviewTo: null, score: null, statusValue: null
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
                                    <div className='d-flex justify-content-between align-items-center'>

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
                                        <div className=' table-responsive'>
                                            <Table className="table-striped table-hover w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center td-start">#</th>
                                                        <th className="td-name">REVIEW BY</th>
                                                        <th className="td-name">REVIEW TO</th>
                                                        <th className="td-email">Rating</th>
                                                        <th className="td-address">Comment</th>
                                                        <th className="td-status">Status</th>
                                                        <th className="td-created">Created At</th>
                                                        <th className="td-actions">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        reviews && reviews.length ?
                                                            reviews.map((review, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="td-start text-center">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>

                                                                        <td className="td-name">
                                                                            {review?.reviewByData.username}
                                                                        </td>
                                                                        <td className="td-name">
                                                                            {review?.reviewToData.username}
                                                                        </td>
                                                                        <td className="td-email">
                                                                           { <ReactStars value={review?.score} isHalf={true} edit={false} size={17} /> }
                                                                        </td>
                                                                        <td className="td-address">
                                                                            {review?.comment}
                                                                        </td>
                                                                        <td className="td-status">
                                                                            <span
                                                                                className={`status p-1 ${review.status ? `bg-success` : `bg-danger`
                                                                                }`}
                                                                            >
                                                                                {review.status ? "active" : "inactive"}
                                                                            </span>
                                                                        </td>
                                                                        <td className="td-created">
                                                                            {review.createdAt ? moment(review.createdAt).format('DD-MM-YYYY HH:MM:SS') : 'N/A'}
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <div className='d-flex'>
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
                                                                                                score: review.score,
                                                                                                status: review.status,
                                                                                                reviewBy: review.reviewByData,
                                                                                                reviewTo: review.reviewToData,
                                                                                                comment: review.comment,
                                                                                                _id: review._id
                                                                                            })
                                                                                            setEditShow(true)
                                                                                        }}
                                                                                    >
                                                                                        <i className="fas fa-edit"></i>
                                                                                    </Button>
                                                                                </OverlayTrigger>
                                                                                <OverlayTrigger
                                                                                    overlay={
                                                                                        <Tooltip id="tooltip-481441726">Remove</Tooltip>
                                                                                    }
                                                                                >
                                                                                    <Button
                                                                                        className="btn-link btn-xs"
                                                                                        onClick={() => {
                                                                                            setDelModalCheck(true)
                                                                                            selDelId(review._id)
                                                                                        }}
                                                                                        variant="danger"
                                                                                    >
                                                                                        <i className="fas fa-times"></i>
                                                                                    </Button>
                                                                                </OverlayTrigger>
                                                                            </div>

                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="8" className="text-center">
                                                                    <span className="no-data-found d-block">No Reviews found</span>
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
                            <Modal.Title className="yellow-color">Update Review</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Review By
                                </Form.Label>
                                <Form.Control type="text" placeholder="Enter name" name="reviewBy" value={editForm.reviewBy.username} onChange={(e) => { setEditForm({ ...editForm, reviewBy: e.target.value }) }} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Review To
                                </Form.Label>
                                <Form.Control type="text" placeholder="Enter name" name="reviewTo" value={editForm.reviewTo.username} onChange={(e) => { setEditForm({ ...editForm, reviewTo: e.target.value }) }} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Rating
                                </Form.Label>
                                <ReactStars value={editForm?.score} isHalf={true} size={17} onChange ={(newValue) => { setEditForm({...editForm, score:newValue})}} />
                             </Form.Group>
                            <Form.Group className="switch-wrapper mb-3">
                                <Form.Label>
                                    Status
                                </Form.Label>
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
                delModalCheck && <Modal show={delModalCheck} onHide={() => setDelModalCheck(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title className='yellow-color delete-tag mb-5'>Are you sure you want to delete this Review?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setDelModalCheck(false)}>
                            No
                        </Button>
                        <Button variant="primary" onClick={delUser} className="yellow-bg">
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
            }

        </>
    )
}

const mapStateToProps = state => ({
    review: state.review,
    error: state.error
});

export default connect(mapStateToProps, { beforeReview, listReview, deleteReview, updateReview })(Review);