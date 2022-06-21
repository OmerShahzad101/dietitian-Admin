import React, {useState} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useHistory } from 'react-router';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { createCoachMembership  } from './CoachMembership.action';
import { Container, Row, Col} from "react-bootstrap";
const CoachMembershipCreate = (props) => {
    const [addCoachMembership, setAddCoachMembership] = useState({
        title:'',
        description: '',
        period: "",
        onBoardTraining:false,
        businessPractise:false,
        healthMarketing:false,
        personalPlatform:false,
        clientAccessList:false,
        onePageDashboard:false,
        HipaaSocial:false,
        hipaaGroupCoaching:false,
        consultations: "",
        status: true,
        priceInUSD:"",
        priceInCrypto:"",
    });
    const [errors, setErrors] = useState({});
    const history = useHistory();

    const submitAdd = (e) => {
        e.preventDefault();
        if(addCoachMembership.title.trim() === ''){
            setErrors({...errors, title : 'title is required'})
        }else if(addCoachMembership.description.trim() === ''){
            setErrors({...errors, description : 'description is required'})
        }else if(addCoachMembership.priceInUSD === ""){
            setErrors({...errors, priceInUSD : 'priceInUSD is required'})
        }
        // else if(addCoachMembership.priceInCrypto === ""){
        //     setErrors({...errors, priceInCrypto : 'priceInCrypto is required'})
        // }
        else if(addCoachMembership.period === ""){
            setErrors({...errors, period : 'period is required'})
        }
        // else if(addCoachMembership.consultations === ""){
        //     setErrors({...errors, consultations : 'consultations is required'})
        // }
        else{
            props.createCoachMembership (addCoachMembership);
            setAddCoachMembership({
                status: true,
            })
            history.push('/dietitianmembership')
        }
    }

  return (
    <Container>
        <Form  onSubmit={(e) => { submitAdd(e) }}>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Title</Form.Label>
                <Form.Control type="text" placeholder="Enter Title" name="title" value={addCoachMembership.title} onChange={(e) => { setAddCoachMembership({ ...addCoachMembership, title: e.target.value }) }} />
                <span style={{ color: "red" }}>{addCoachMembership.title === ''? errors["title"] : ""}</span>
            </Form.Group>
            <Form.Group>
            <Form.Label className='ip-lable'>Description</Form.Label>
            <CKEditor
                    editor={ ClassicEditor }
                    data=""
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        // console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        setAddCoachMembership({...addCoachMembership, description: data })
                        // console.log( 'dataaaaaaaaaaaaaa',data );
                    } }
                    onBlur={ ( event, editor ) => {
                        // console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        // console.log( 'Focus.', editor );
                    } }
                />
                <span style={{ color: "red" }}>{addCoachMembership.description === ''? errors["description"] : ""}</span>
            </Form.Group>
            
            

            {/* <Form.Group className="mb-3">
            <Form.Label className='mb-3'>Coach Membership Management</Form.Label>
                <Row>
                    <div className='chbox-div'>
                        <Form.Label> All-In-One Business/Practice Platform</Form.Label>
                        <input type="checkbox" checked={addCoachMembership.businessPractise ? true : false}
                            onChange={(e) => {
                        setAddCoachMembership({...addCoachMembership, businessPractise:e.target.checked})
                        }} />
                    </div>
                </Row>
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>Free onboarding training </Form.Label>
                        <input type="checkbox" checked={addCoachMembership.onBoardTraining ? true : false}
                            onChange={(e) => {
                        setAddCoachMembership({...addCoachMembership, onBoardTraining:e.target.checked})
                        }} />
                    </div>
                </Row>    
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>Platform, marketing & health coaching training with certification</Form.Label>
                        <input type="checkbox" checked={addCoachMembership.healthMarketing ? true : false}
                            onChange={(e) => {
                        setAddCoachMembership({...addCoachMembership, healthMarketing:e.target.checked})
                        }} />
                    </div>
                </Row>        
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>Personal platform link & page (like .healthiwealthi.io/ID) </Form.Label>
                        <input type="checkbox" checked={addCoachMembership.personalPlatform ? true : false}
                            onChange={(e) => {
                        setAddCoachMembership({...addCoachMembership, personalPlatform:e.target.checked})
                        }} />
                    </div>
                </Row> 
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>One page dashboard</Form.Label>
                        <input type="checkbox" checked={addCoachMembership.onePageDashboard ? true : false}
                            onChange={(e) => {
                        setAddCoachMembership({...addCoachMembership, onePageDashboard:e.target.checked})
                        }} />
                    </div>
                </Row> 
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>Client access list (with icons to chat, talk or email each client easily) </Form.Label>
                        <input type="checkbox" checked={addCoachMembership.clientAccessList ? true : false}
                            onChange={(e) => {
                        setAddCoachMembership({...addCoachMembership, clientAccessList:e.target.checked})
                        }} />
                    </div>
                </Row> 
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>HIPAA compliant video/audio/chat (for personal consultations) </Form.Label>
                        <input type="checkbox" checked={addCoachMembership.HipaaSocial ? true : false}
                            onChange={(e) => {
                        setAddCoachMembership({...addCoachMembership, HipaaSocial:e.target.checked})
                        }} />
                    </div>
                </Row> 
                <Row>
                    <div className='chbox-div'>
                        <Form.Label> HIPAA compliant group coaching video/audio/chat (for large groups)</Form.Label>
                        <input type="checkbox" checked={addCoachMembership.hipaaGroupCoaching ? true : false}
                            onChange={(e) => {
                        setAddCoachMembership({...addCoachMembership, hipaaGroupCoaching:e.target.checked})
                        }} />
                    </div>
               </Row>
            </Form.Group> */}
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Price (USD)</Form.Label>
                <Form.Control type="number" placeholder="USD" min="0" name="price In USD" value={addCoachMembership.priceInUSD} onChange={(e) => { setAddCoachMembership({ ...addCoachMembership, priceInUSD: e.target.value }) }} />
                <span style={{ color: "red" }}>{addCoachMembership.priceInUSD === ''? errors["priceInUSD"] : ""}</span>
            </Form.Group>
            {/* <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Price (RxHEAL)</Form.Label>
                <Form.Control type="number" placeholder="Crypto" min="0" name="price In Crypto" value={addCoachMembership.priceInCrypto} onChange={(e) => { setAddCoachMembership({ ...addCoachMembership, priceInCrypto: e.target.value }) }} />
                <span style={{ color: "red" }}>{addCoachMembership.priceInCrypto === ''? errors["priceInCrypto"] : ""}</span>
            </Form.Group> */}
            <Form.Group>
            <Form.Label className="mr-4 ip-lable">Membership Period</Form.Label>
                <Form.Control type="number" placeholder="Enter Months..." min="1" name="membership Period" value={addCoachMembership.period} onChange={(e) => { 
                    setAddCoachMembership({ ...addCoachMembership, period:e.target.value }) }} />
                <span style={{ color: "red" }}>{addCoachMembership.period === ''? errors["period"] : ""}</span>
            </Form.Group>
            {/* <Form.Group>
            <Form.Label className='mr-4'>Consultations</Form.Label>
                <select className='form-control form-select' onChange={(e) => {
                    setAddCoachMembership({ ...addCoachMembership, consultations:e.target.value })
                    }}>
                        <option value={1}>Select Consultations</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                </select>
                <span style={{ color: "red" }}>{addCoachMembership.consultations === ''? errors["consultations"] : ""}</span>
            </Form.Group> */}
            <Form.Group className="switch-wrapper mb-3">
                <label className="d-block mb-2 ip-lable">Status</label>
                <label className="switch m-0">
                    <input type="checkbox" name="status" checked={addCoachMembership.status ? true : false} onChange={(e) => {
                        setAddCoachMembership({ ...addCoachMembership, status: e.target.checked })
                    }} />
                    <span className="slider round"></span>
                </label>
            </Form.Group>
            <Button variant="primary" type="submit" className="yellow-bg">
                Add Membership
            </Button>
        </Form>
    </Container>
  )
}

export default connect(null, { createCoachMembership })(CoachMembershipCreate)



