import React, { useState, useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { connect } from 'react-redux';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { getCoachMembership, updateCoachMembership  } from './CoachMembershipRecord.action';
import { toast } from 'react-toastify';
import {  Row, Col} from "react-bootstrap";

const CoachMembershipEditRecord = (props) => {
    let id = props.match.params.id;
    const [editUserMembership, setEditUserMembership] = useState(null);
    const [loader, setLoader] = useState(true);
    const history = useHistory();

    useEffect(() => {
        toast.dismiss();
        window.scroll(0, 0);
        props.getCoachMembership(id);
    }, [])

    useEffect(async () => {
        if (props.coachRecord.getAuth) {
            let coachMembership = await props.coachRecord.getCoachmemb;
            setEditUserMembership(coachMembership)
            setLoader(false)
        }
    }, [props.coachRecord.getAuth, props.coachRecord.getCoachmemb])

    const submitEdit = (e) => {
        e.preventDefault();
        props.updateCoachMembership(editUserMembership);
        setEditUserMembership(null)
        history.push('/coachrecord')
    }

    return (
        <Container>
            {
                loader ? <FullPageLoader /> :
                    <Form onSubmit={(e) => { submitEdit(e) }}>
                    
                        <Form.Group className="mb-3">
                            <Form.Label className='ip-lable'>Coach Name</Form.Label>
                            <Form.Control type="text" name="title" value={editUserMembership?.userData?.username} disabled />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='ip-lable'>Membership Title</Form.Label>
                            <Form.Control type="text" name="title" value={editUserMembership?.membershipData.title} disabled  />
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
                            <Form.Label>Membership Management</Form.Label>
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>Health, Longevity & Wealth educational content included</Form.Label>
                                    <input type="checkbox" checked={editUserMembership?.membershipData.healthyWealthy ? true : false}
                                    disabled />
                                </div>
                            </Row>
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>Personal Package</Form.Label>
                                    <input type="checkbox" checked={editUserMembership?.membershipData.forCoach ? true : false}
                                    disabled />
                                </div>
                            </Row>
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>Onboarding Training </Form.Label>
                                    <input type="checkbox" checked={editUserMembership?.membershipData.onBoardTraining ? true : false}
                                    disabled />
                                </div>
                            </Row>    
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>Business/Practice Platform</Form.Label>
                                    <input type="checkbox" checked={editUserMembership?.membershipData.businessPractise ? true : false}
                                    disabled />
                                </div>
                            </Row>
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>Platform, marketing & health coaching training with certification </Form.Label>
                                    <input type="checkbox" checked={editUserMembership?.membershipData.healthMarketing ? true : false}
                                    disabled />
                                </div>
                            </Row>        
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>Personal platform link & page </Form.Label>
                                    <input type="checkbox" checked={editUserMembership?.membershipData.personalPlatform ? true : false}
                                    disabled />
                                </div>
                            </Row> 
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>One page dashboard content </Form.Label>
                                    <input type="checkbox" checked={editUserMembership?.membershipData.onePageDashboard ? true : false}
                                    disabled />
                                </div>
                            </Row> 
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label> Client access list  </Form.Label>
                                    <input type="checkbox" checked={editUserMembership?.membershipData.clientAccessList ? true : false}
                                    disabled />
                                </div>
                            </Row> 
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>HIPAA compliant video/audio/chat  </Form.Label>
                                    <input type="checkbox" checked={editUserMembership?.membershipData.HipaaSocial ? true : false}
                                    disabled />
                                </div>
                            </Row> 
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>HIPAA compliant group coaching video/audio/chat  </Form.Label>
                                    <input type="checkbox" checked={editUserMembership?.membershipData.hipaaGroupCoaching ? true : false}
                                    disabled />
                                </div>
                            </Row>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Membership Period(Months)</Form.Label>
                            <Form.Control type="number"  value={editUserMembership?.membershipData?.period/30} disabled/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Consultations</Form.Label>
                                <select className='form-control form-select' disabled >
                                    <option value={1} selected={editUserMembership?.membershipData.consultations === 1 ? 'selected' : ''}>1</option>
                                    <option value={2} selected={editUserMembership?.membershipData.consultations === 2 ? 'selected' : ''}>2</option>
                                    <option value={3} selected={editUserMembership?.membershipData.consultations === 3 ? 'selected' : ''}>3</option>
                                    <option value={4} selected={editUserMembership?.membershipData.consultations === 4 ? 'selected' : ''}>4</option>
                                    <option value={5} selected={editUserMembership?.membershipData.consultations === 5 ? 'selected' : ''}>5</option>
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
                            Edit Coach Membership
                        </Button>
                    </Form>
            }
        </Container>
    )
}
const mapStateToProps = state => ({
    coachRecord: state.coachRecord,
    error: state.error
})
export default connect(mapStateToProps, { getCoachMembership, updateCoachMembership  })(CoachMembershipEditRecord)