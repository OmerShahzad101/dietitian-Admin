import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button, Container, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { beforeCoachMembership, getCoachMembership } from './CoachMembership.action'
import { toast } from 'react-toastify';
import { Row, Col } from "react-bootstrap";

const CoachMembershipView = (props) => {
    let id = props.match.params.id;

    const [editCoachMembership, setEditCoachMembership] = useState(null);
    const [loader, setLoader] = useState(true);
    const history = useHistory();

    useEffect(() => {
        toast.dismiss();
        window.scroll(0, 0);
        props.getCoachMembership(id);
    }, [])

    useEffect(async () => {
        if (props.coachMemberships.getCoachMembershipAuth) {
            let coachMembership = await props.coachMemberships.getCoachMembership;
            setEditCoachMembership(coachMembership)
            setLoader(false)
        }
    }, [props.coachMemberships.getCoachMembershipAuth])

    const submitEdit = (e) => {
        e.preventDefault();
        history.push('/coachmembership')
    }

    return (
        <Container>
            {
                loader ? <FullPageLoader /> :
                    <Form onSubmit={(e) => { submitEdit(e) }}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter Title" name="title" value={editCoachMembership?.title} disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <CKEditor disabled
                                editor={ClassicEditor}
                                data={editCoachMembership?.description}
                                description={editCoachMembership?.description}
                                onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    // console.log( 'Editor is ready to use!', editor );
                                    const data = editor.getData();
                                    // console.log('DATA: ', data)
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
                            <Form.Label>Coach Membership Management</Form.Label>
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>All-In-One Business/Practice Platform</Form.Label>
                                    <input type="checkbox" checked={editCoachMembership?.businessPractise ? true : false}
                                       disabled />
                                </div>
                            </Row>
                            <Row>
                            <div className='chbox-div'>
                                <Form.Label> Free onboarding training </Form.Label>
                                <input type="checkbox" checked={editCoachMembership?.onBoardTraining ? true : false}
                                    disabled/>
                            </div>
                            </Row>    
                            
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>Platform, marketing & health coaching training with certification </Form.Label>
                                    <input type="checkbox" checked={editCoachMembership?.healthMarketing ? true : false}
                                       disabled/>
                                </div>
                            </Row>        
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>Personal platform link & page (like .healthiwealthi.io/ID) </Form.Label>
                                    <input type="checkbox" checked={editCoachMembership?.personalPlatform ? true : false}
                                       disabled/>
                                </div>
                            </Row> 
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label> One page dashboard</Form.Label>
                                    <input type="checkbox" checked={editCoachMembership?.onePageDashboard ? true : false}
                                       disabled />
                                </div>
                            </Row> 
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>Client access list (with icons to chat, talk or email each client easily)  </Form.Label>
                                    <input type="checkbox" checked={editCoachMembership?.clientAccessList ? true : false}
                                       disabled />
                                </div>
                            </Row> 
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label>HIPAA compliant video/audio/chat (for personal consultations) </Form.Label>
                                    <input type="checkbox" checked={editCoachMembership?.HipaaSocial ? true : false}
                                        disabled />
                                </div>
                            </Row> 
                            <Row>
                                <div className='chbox-div'>
                                    <Form.Label> HIPAA compliant group coaching video/audio/chat (for large groups) </Form.Label>
                                    <input type="checkbox" checked={editCoachMembership?.hipaaGroupCoaching ? true : false}
                                       disabled />
                                </div>
                            </Row>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price (USD)</Form.Label>
                            <Form.Control type="number" placeholder="USD" min="0" name="price In USD" value={editCoachMembership?.priceInUSD} disabled/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price (RxHEAL)</Form.Label>
                            <Form.Control type="number" placeholder="Crypto" min="0" name="price In Crypto" value={editCoachMembership?.priceInCrypto} disabled/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Session Extend Price</Form.Label>
                            <Form.Control type="number" placeholder="USD" min="0" name="session extend price" value={editCoachMembership?.sessionExtendPrice} disabled />
                        </Form.Group>
                        <Form.Group>
                        <Form.Label>Membership Period </Form.Label>
                        <Form.Control type="number" placeholder="Enter Months..." min="1" name="membership Period" value={editCoachMembership?.period} disabled/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Consultations</Form.Label>
                            <select className='form-control form-select' disabled>
                                <option value={1} selected={editCoachMembership.consultations === 1 ? 'selected' : ''}>1</option>
                                <option value={2} selected={editCoachMembership.consultations === 2 ? 'selected' : ''}>2</option>
                                <option value={3} selected={editCoachMembership.consultations === 3 ? 'selected' : ''}>3</option>
                                <option value={4} selected={editCoachMembership.consultations === 4 ? 'selected' : ''}>4</option>
                                <option value={5} selected={editCoachMembership.consultations === 5 ? 'selected' : ''}>5</option>
                            </select>
                        </Form.Group>
                        <Form.Group className="switch-wrapper mb-3">
                            <span className="d-block mb-2">Status</span>
                            <label className="switch">
                                <input type="checkbox" name="status" checked={editCoachMembership.status ? true : false} disabled />
                                <span className="slider round"></span>
                            </label>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="yellow-bg">
                            Go back
                        </Button>
                    </Form>}
        </Container>
    )
}

const mapStateToProps = state => ({
    coachMemberships: state.coachMemberships,
    error: state.error
})

export default connect(mapStateToProps, { beforeCoachMembership, getCoachMembership })(CoachMembershipView)