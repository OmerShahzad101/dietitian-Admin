import React, { useState, useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { connect } from 'react-redux';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { getUserMembership, updateUserMembership } from './UsersMemberships.action';
import { toast } from 'react-toastify';
import {  Row, Col} from "react-bootstrap";

const UserMembershipEdit = (props) => {
    let id = props.match.params.id;
    const [editUserMembership, setEditUserMembership] = useState(null);
    const [loader, setLoader] = useState(true);

    const history = useHistory();

    useEffect(() => {
        toast.dismiss();
        window.scroll(0, 0);
        props.getUserMembership(id);
    }, [])

    useEffect(async () => {
        if (props.userMembershipState.getAuth) {
            let usermembership = await props.userMembershipState.getusermemb;
            setEditUserMembership(usermembership)
            setLoader(false)
        }
    }, [props.userMembershipState.getAuth, props.userMembershipState.getusermemb])

    const submitEdit = (e) => {
        e.preventDefault();
        props.updateUserMembership(editUserMembership);
        setEditUserMembership(null)
        // props.beforeMembership()
        history.push('/usersmemberships')
    }

    return (
        <Container>
            {
                loader ? <FullPageLoader /> :
                    <Form onSubmit={(e) => { submitEdit(e) }}>
                    
                        <Form.Group className="mb-3">
                            <Form.Label className='ip-lable'>User Name</Form.Label>
                            <Form.Control type="text" name="title" value={editUserMembership?.userData?.username ? editUserMembership?.userData?.username : "N/A"} disabled/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='ip-lable'>Membership Title</Form.Label>
                            <Form.Control type="text" name="title" value={editUserMembership?.membershipData.title} disabled />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <CKEditor disabled
                                editor={ClassicEditor}
                                data={editUserMembership?.membershipData.description}
                                description={editUserMembership?.membershipData.description}
                                onBlur={(event, editor) => {
                                    // console.log( 'Blur.', editor );
                                }}
                                onFocus={(event, editor) => {
                                    // console.log( 'Focus.', editor );
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Group Coachings</Form.Label>
                            <Form.Control type="number"  min="1" name="groupCoaching" value={editUserMembership?.membershipData?.groupCoaching} disabled />
                        </Form.Group>

                        <Form.Group className="mb-3">
                           <Form.Label>Personal Coach Chats</Form.Label>
                           <Form.Control type="number"  min="1" name="personalCoachChat" value={editUserMembership?.membershipData?.personalCoachChat} disabled />
                        </Form.Group>

                        <Form.Group className="mb-3">
                           <Form.Label>Micro-Habit Lifestyle Prescriptions®</Form.Label>
                           <Form.Control type="number"  min="1" name="microHabitLifestyle" value={editUserMembership?.membershipData?.microHabitLifestyle} disabled/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                           <Form.Label>Personal Root-Cause Health Coaching Consultations</Form.Label>
                           <Form.Control type="number"  min="1" name="rootCauseHealthCoaching" value={editUserMembership?.membershipData?.rootCauseHealthCoaching} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price In USD</Form.Label>
                            <Form.Control type="number"  min="0" name="price In USD" value={editUserMembership?.membershipData.priceInUSD} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price In Crypto</Form.Label>
                            <Form.Control type="number" min="0" name="price In Crypto" value={editUserMembership?.membershipData.priceInCrypto} disabled/>
                        </Form.Group>


                        <Form.Group className="mb-3">
                            <Form.Label>Membership management</Form.Label>
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>Health, Longevity & Wealth educational content included</Form.Label>
                                    <input type="checkbox" checked={editUserMembership?.membershipData?.healthyWealthy ? true : false}
                                    disabled />
                                </div>
                            </Row>
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>Personal Package</Form.Label>
                                    <input type="checkbox" checked={editUserMembership?.membershipData?.personalPackage ? true : false}
                                    disabled />
                                </div>
                            </Row>
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>Family Package</Form.Label>
                                    <input type="checkbox" checked={editUserMembership?.membershipData?.familyPackage? true : false}
                                    disabled />
                                </div>
                            </Row>  
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>Teams Package</Form.Label>
                                    <input type="checkbox" checked={editUserMembership?.membershipData?.teamsPackage? true : false}
                                    disabled />
                                </div>
                            </Row>   
                           
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Membership Period</Form.Label>
                            <Form.Control type="number"  value={editUserMembership?.membershipData?.period/30} disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Consultation Extention Cost (USD Per minute)</Form.Label>
                            <Form.Control type="number"  value={editUserMembership?.membershipData?.consultationExtentionCostUSD} disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Consultation Extention Cost (RxHEAL Per minute)</Form.Label>
                            <Form.Control type="number"  value={editUserMembership?.membershipData?.consultationExtentionCostCrypto} disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Consultations</Form.Label>
                                <select className='form-control form-select' disabled >
                                    <option value={1} selected={editUserMembership?.membershipData?.consultations === 1 ? 'selected' : ''}>1</option>
                                    <option value={2} selected={editUserMembership?.membershipData?.consultations === 2 ? 'selected' : ''}>2</option>
                                    <option value={3} selected={editUserMembership?.membershipData?.consultations === 3 ? 'selected' : ''}>3</option>
                                    <option value={4} selected={editUserMembership?.membershipData?.consultations === 4 ? 'selected' : ''}>4</option>
                                    <option value={5} selected={editUserMembership?.membershipData?.consultations === 5 ? 'selected' : ''}>5</option>
                                </select>
                        </Form.Group>
                        <Form.Group className="switch-wrapper mb-3">
                            <span className="d-block mb-2">Status</span>
                            <label style={{margin:0}} className="switch m-0">
                                <input type="checkbox" name="status" checked={editUserMembership?.status ? true : false} 
                                    onChange={(e) => {
                                        // let dataObj = editUserMembership;
                                        // dataObj.status =  e.target.checked;
                                            setEditUserMembership({ ...editUserMembership, status: e.target.checked  })
                                        }} />
                                <span className="slider round"></span>
                            </label>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="yellow-bg">
                            Edit Membership
                        </Button>
                    </Form>
            }
        </Container>
    )
}
const mapStateToProps = state => ({
    userMembershipState: state.userMemberships,
    error: state.error
})
export default connect(mapStateToProps, { getUserMembership, updateUserMembership  })(UserMembershipEdit)