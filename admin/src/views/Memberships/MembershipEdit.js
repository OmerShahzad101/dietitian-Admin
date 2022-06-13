import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button, Container, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import {beforeMembership, updateMembership, getMembership} from './Memberships.action'
import { toast } from 'react-toastify';
import {  Row, Col} from "react-bootstrap";

const EditMembership = (props) => {
    let id = props.match.params.id;
    const [editUserMembership, setEditUserMembership] = useState(null);
    const [loader, setLoader] = useState(true);
    const [errors, setErrors] = useState({});
    const history = useHistory();

    useEffect(() => {
        toast.dismiss();
        window.scroll(0, 0);
        props.getMembership(id);
    }, [])

    useEffect(() => {
        if (props.memberships.getMembershipAuth) {
            let membership = props.memberships.getMembership;
            setEditUserMembership(membership)
            setLoader(false)
        }
    }, [props.memberships.getMembershipAuth])

    const submitEdit = (e) => {
        e.preventDefault();
        props.updateMembership(editUserMembership);
        setEditUserMembership(null)
        props.beforeMembership()
        history.push('/membermembership')
    }

    return (
        <Container>
            {
                loader ? <FullPageLoader /> :
                <Form  onSubmit={(e) => { submitEdit(e) }}>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Title</Form.Label>
                <Form.Control type="text" placeholder="Enter Title" name="title" value={editUserMembership?.title} onChange={(e) => { setEditUserMembership({ ...editUserMembership, title: e.target.value }) }} />
                <span style={{ color: "red" }}>{editUserMembership?.title === ''? errors["title"] : ""}</span>
            </Form.Group>
            <Form.Group>
            <Form.Label>Description</Form.Label>
            <CKEditor
                    editor={ClassicEditor}
                    data={editUserMembership?.description}
                    description={editUserMembership?.description}
                    onReady={editor => {
                        // You can store the "editor" and use when it is needed.
                        // console.log( 'Editor is ready to use!', editor );
                        const data = editor.getData();
                        // console.log('DATA: ', data)
                        setEditUserMembership({ ...editUserMembership, description: data })
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setEditUserMembership({ ...editUserMembership, description: data })
                    }}
                    onBlur={(event, editor) => {
                        // console.log( 'Blur.', editor );
                    }}
                    onFocus={(event, editor) => {
                        // console.log( 'Focus.', editor );
                    }}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Group Coachings</Form.Label>
                <Form.Control type="number" placeholder="No of times" min="0" name="groupCoaching" value={editUserMembership?.groupCoaching} onChange={(e) => { setEditUserMembership({ ...editUserMembership, groupCoaching: e.target.value }) }} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Personal Coach Chats</Form.Label>
                <Form.Control type="number" placeholder="No of times" min="0" name="personalCoachChat" value={editUserMembership?.personalCoachChat} onChange={(e) => { setEditUserMembership({ ...editUserMembership, personalCoachChat: e.target.value }) }} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Micro-Habit Lifestyle Prescriptions®</Form.Label>
                <Form.Control type="number" placeholder="No of times" min="0" name="microHabitLifestyle" value={editUserMembership?.microHabitLifestyle} onChange={(e) => { setEditUserMembership({ ...editUserMembership, microHabitLifestyle: e.target.value }) }} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Personal Root-Cause Health Coaching Consultations</Form.Label>
                <Form.Control type="number" placeholder="No of times" min="0" name="rootCauseHealthCoaching" value={editUserMembership?.rootCauseHealthCoaching} onChange={(e) => { setEditUserMembership({ ...editUserMembership, rootCauseHealthCoaching: e.target.value }) }} />
            </Form.Group>
           
            <Form.Group className="mb-3">
            <Form.Label className='mb-3'>Membership management</Form.Label>
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>Health, Longevity & Wealth educational content included</Form.Label>
                        <input type="checkbox" checked={editUserMembership?.healthyWealthy ? true : false}
                            onChange={(e) => {
                        setEditUserMembership({...editUserMembership, healthyWealthy:e.target.checked})
                        }} />
                    </div>
                </Row>
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>For Coach</Form.Label>
                        <input type="checkbox" checked={editUserMembership?.forCoach ? true : false}
                            onChange={(e) => {
                        setEditUserMembership({...editUserMembership, forCoach:e.target.checked})
                        }} />
                    </div>
                </Row>
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>Personal Package</Form.Label>
                        <input type="checkbox" checked={editUserMembership?.personalPackage ? true : false}
                            onChange={(e) => {
                            setEditUserMembership({...editUserMembership, personalPackage:e.target.checked})
                        }} />
                    </div>
                </Row>
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>Family Package</Form.Label>
                        <input type="checkbox" checked={editUserMembership?.familyPackage ? true : false}
                            onChange={(e) => {
                            setEditUserMembership({...editUserMembership, familyPackage:e.target.checked})
                        }} />
                    </div>
                </Row>
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>Teams Package</Form.Label>
                        <input type="checkbox" checked={editUserMembership?.teamsPackage ? true : false}
                            onChange={(e) => {
                            setEditUserMembership({...editUserMembership, teamsPackage:e.target.checked})
                        }} />
                    </div>
                </Row>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Price (USD)</Form.Label>
                <Form.Control type="number" placeholder="USD" min="0" name="price In USD" value={editUserMembership?.priceInUSD} onChange={(e) => { setEditUserMembership({ ...editUserMembership, priceInUSD: e.target.value }) }} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Price (RxHEAL)</Form.Label>
                <Form.Control type="number" placeholder="RxHEAL" min="0" name="price In RxHEAL" value={editUserMembership?.priceInCrypto} onChange={(e) => { setEditUserMembership({ ...editUserMembership, priceInCrypto: e.target.value }) }} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Consultation Extention Cost (USD Per minute)</Form.Label>
                <Form.Control type="number" placeholder="USD" min="0" name="price In USD" value={editUserMembership?.consultationExtentionCostUSD} onChange={(e) => { setEditUserMembership({ ...editUserMembership, consultationExtentionCostUSD: e.target.value }) }} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Consultation Extention Cost (RxHEAL Per minute)</Form.Label>
                <Form.Control type="number" placeholder="RxHEAL" min="0" name="price In RxHEAL" value={editUserMembership?.consultationExtentionCostCrypto} onChange={(e) => { setEditUserMembership({ ...editUserMembership, consultationExtentionCostCrypto: e.target.value }) }} />
            </Form.Group>
            <Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Session Extend Price</Form.Label>
                <Form.Control type="number"  min="0" name="price of seesion" value={editUserMembership?.sessionExtendPrice} onChange={(e) => { setEditUserMembership({ ...editUserMembership, sessionExtendPrice: e.target.value }) }}/>
            </Form.Group>
            <Form.Label className="mr-4">Membership Period (Months)</Form.Label>
                <Form.Control type="number" placeholder="Enter Months..." min="1" name="membership Period" value={editUserMembership?.period} onChange={(e) => { 
                    setEditUserMembership({ ...editUserMembership, period:e.target.value }) }} />
            </Form.Group>
           
            <Form.Group>
            <Form.Label>Consultations</Form.Label>
                <select className='form-control form-select' onChange={(e) => {
                    setEditUserMembership({ ...editUserMembership, consultations:e.target.value })
                    }}>
                        <option value={1} selected={editUserMembership?.consultations === 1 ? 'selected' : ''}>1</option>
                        <option value={2} selected={editUserMembership?.consultations === 2 ? 'selected' : ''}>2</option>
                        <option value={3} selected={editUserMembership?.consultations === 3 ? 'selected' : ''}>3</option>
                        <option value={4} selected={editUserMembership?.consultations === 4 ? 'selected' : ''}>4</option>
                        <option value={5} selected={editUserMembership?.consultations === 5 ? 'selected' : ''}>5</option>
                </select>
            </Form.Group>
            <Form.Group className="switch-wrapper mb-3">
                <span className="d-block mb-2">Status</span>
                <label style={{margin:0}} className="switch m-0">
                    <input type="checkbox" name="status" checked={editUserMembership?.status ? true : false} onChange={(e) => {
                        setEditUserMembership({ ...editUserMembership, status: e.target.checked })
                    }} />
                    <span className="slider round"></span>
                </label>
            </Form.Group>
            <Button variant="primary" type="submit" className="yellow-bg">
                Edit Member Membership
            </Button>
        </Form>}
        </Container>
    )
}
const mapStateToProps = state => ({
    memberships: state.memberships,
    error: state.error
})

export default connect(mapStateToProps, {beforeMembership, updateMembership, getMembership})(EditMembership)