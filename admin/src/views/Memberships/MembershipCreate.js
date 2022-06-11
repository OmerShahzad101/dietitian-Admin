import React, {useState} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useHistory } from 'react-router';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import {createMembership} from './Memberships.action';
import { Container, Row, Col} from "react-bootstrap";
const CreateMembership = (props) => {
    const [addMembership, setAddMembership] = useState({
        title:'',
        description: '',
        period: "",
        groupCoaching:"",
        personalCoachChat:"",
        microHabitLifestyle:"",
        rootCauseHealthCoaching:"",
        healthyWealthy:false,
        forCoach:false,
        consultations: "",
        consultationExtentionCostUSD:"",
        consultationExtentionCostCrypto:"",
        personalPackage:false,
        familyPackage:false,
        teamsPackage:false,
        level:"",
        status: true,
        priceInUSD:"",
        priceInCrypto:"",
        sessionExtendPrice:"",
    });
    const [errors, setErrors] = useState({});
    const history = useHistory();

    const submitAdd = (e) => {
        e.preventDefault();
        if(addMembership.title.trim() === ''){
            setErrors({...errors, title : 'title is required'})
        }else if(addMembership.description.trim() === ''){
            setErrors({...errors, description : 'description is required'})
        }else if(addMembership.groupCoaching === ""){
            setErrors({...errors, groupCoaching : 'groupCoaching is required'})
        }else if(addMembership.personalCoachChat === ""){
            setErrors({...errors, personalCoachChat : 'personalCoachChat is required'})
        }else if(addMembership.microHabitLifestyle === ""){
            setErrors({...errors, microHabitLifestyle : 'microHabitLifestyle is required'})
        }else if(addMembership.rootCauseHealthCoaching === ""){
            setErrors({...errors, rootCauseHealthCoaching : 'RootCauseHealthCoaching is required'})
        }else if(addMembership.period === ""){
            setErrors({...errors, period : 'period is required'})
        }else if(addMembership.priceInUSD === ""){
            setErrors({...errors, priceInUSD : 'priceInUSD is required'})
        }else if(addMembership.priceInCrypto === ""){
            setErrors({...errors, priceInCrypto : 'priceInCrypto is required'})
        }else if(addMembership.consultations === ""){
            setErrors({...errors, consultations : 'consultations is required'})
        }
        else{
            props.createMembership(addMembership);
            setAddMembership({
                status: true,
            })
            history.push('/membermembership')
        }
    }
  return (
    <Container>
        <Form  onSubmit={(e) => { submitAdd(e) }}>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Title</Form.Label>
                <Form.Control type="text" placeholder="Enter Title" name="title" value={addMembership.title} onChange={(e) => { setAddMembership({ ...addMembership, title: e.target.value }) }} />
                <span style={{ color: "red" }}>{addMembership.title === ''? errors["title"] : ""}</span>
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
                        setAddMembership({...addMembership, description: data })
                        // console.log( 'dataaaaaaaaaaaaaa',data );
                    } }
                    onBlur={ ( event, editor ) => {
                        // console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        // console.log( 'Focus.', editor );
                    } }
                />
                <span style={{ color: "red" }}>{addMembership.description === ''? errors["description"] : ""}</span>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Group Coachings</Form.Label>
                <Form.Control type="number" placeholder="No of times" min="0" name="groupCoaching" value={addMembership.groupCoaching} onChange={(e) => { setAddMembership({ ...addMembership, groupCoaching: e.target.value }) }} />
                <span style={{ color: "red" }}>{addMembership.groupCoaching === ''? errors["groupCoaching"] : ""}</span>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Personal Coach Chats</Form.Label>
                <Form.Control type="number" placeholder="No of times" min="0" name="personalCoachChat" value={addMembership.personalCoachChat} onChange={(e) => { setAddMembership({ ...addMembership, personalCoachChat: e.target.value }) }} />
                <span style={{ color: "red" }}>{addMembership.personalCoachChat === ''? errors["personalCoachChat"] : ""}</span>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Micro-Habit Lifestyle Prescriptions®</Form.Label>
                <Form.Control type="number" placeholder="No of times" min="0" name="microHabitLifestyle" value={addMembership.microHabitLifestyle} onChange={(e) => { setAddMembership({ ...addMembership, microHabitLifestyle: e.target.value }) }} />
                <span style={{ color: "red" }}>{addMembership.microHabitLifestyle === ''? errors["microHabitLifestyle"] : ""}</span>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Personal Root-Cause Health Coaching Consultations</Form.Label>
                <Form.Control type="number" placeholder="No of times" min="0" name="rootCauseHealthCoaching" value={addMembership.rootCauseHealthCoaching} onChange={(e) => { setAddMembership({ ...addMembership, rootCauseHealthCoaching: e.target.value }) }} />
                <span style={{ color: "red" }}>{addMembership.rootCauseHealthCoaching === ''? errors["rootCauseHealthCoaching"] : ""}</span>
            </Form.Group>
           
            <Form.Group className="mb-3">
            <Form.Label className='mb-3'>Membership management</Form.Label>
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>Health, Longevity & Wealth educational content included</Form.Label>
                        <input type="checkbox" checked={addMembership.healthyWealthy ? true : false}
                            onChange={(e) => {
                        setAddMembership({...addMembership, healthyWealthy:e.target.checked})
                        }} />
                    </div>
                </Row>
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>For Coach</Form.Label>
                        <input type="checkbox" checked={addMembership.forCoach ? true : false}
                            onChange={(e) => {
                        setAddMembership({...addMembership, forCoach:e.target.checked})
                        }} />
                    </div>
                </Row>
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>Personal Package</Form.Label>
                        <input type="checkbox" checked={addMembership.personalPackage ? true : false}
                            onChange={(e) => {
                        setAddMembership({...addMembership, personalPackage:e.target.checked})
                        }} />
                    </div>
                </Row>
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>Family Package</Form.Label>
                        <input type="checkbox" checked={addMembership.familyPackage ? true : false}
                            onChange={(e) => {
                        setAddMembership({...addMembership, familyPackage:e.target.checked})
                        }} />
                    </div>
                </Row>
                <Row>
                    <div className='chbox-div'>
                        <Form.Label>Teams Package</Form.Label>
                        <input type="checkbox" checked={addMembership.teamsPackage ? true : false}
                            onChange={(e) => {
                        setAddMembership({...addMembership, teamsPackage:e.target.checked})
                        }} />
                    </div>
                </Row>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Price (USD)</Form.Label>
                <Form.Control type="number" placeholder="USD" min="0" name="price In USD" value={addMembership.priceInUSD} onChange={(e) => { setAddMembership({ ...addMembership, priceInUSD: e.target.value }) }} />
                <span style={{ color: "red" }}>{addMembership.priceInUSD === ''? errors["priceInUSD"] : ""}</span>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Price (RxHEAL)</Form.Label>
                <Form.Control type="number" placeholder="RxHEAL" min="0" name="price In RxHEAL" value={addMembership.priceInCrypto} onChange={(e) => { setAddMembership({ ...addMembership, priceInCrypto: e.target.value }) }} />
                <span style={{ color: "red" }}>{addMembership.priceInCrypto === ''? errors["priceInCrypto"] : ""}</span>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Consultation Extention Cost (USD Per minute)</Form.Label>
                <Form.Control type="number" placeholder="USD" min="0" name="price In USD" value={addMembership.consultationExtentionCostUSD} onChange={(e) => { setAddMembership({ ...addMembership, consultationExtentionCostUSD: e.target.value }) }} />
                {/* <span style={{ color: "red" }}>{addMembership.consultationExtentionCostUSD === ''? errors["priceInCrypto"] : ""}</span> */}
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>Consultation Extention Cost (RxHEAL Per minute)</Form.Label>
                <Form.Control type="number" placeholder="RxHEAL" min="0" name="price In RxHEAL" value={addMembership.consultationExtentionCostCrypto} onChange={(e) => { setAddMembership({ ...addMembership, consultationExtentionCostCrypto: e.target.value }) }} />
                {/* <span style={{ color: "red" }}>{addMembership.consultationExtentionCostCrypto === ''? errors["priceInCrypto"] : ""}</span> */}
            </Form.Group>
            <Form.Group>
            <Form.Label className="mr-4">Membership Period (Months)</Form.Label>
                <Form.Control type="number" placeholder="Enter Months..." min="1" name="membership Period" value={addMembership.period} onChange={(e) => { 
                    setAddMembership({ ...addMembership, period:e.target.value }) }} />
                <span style={{ color: "red" }}>{addMembership.period === ''? errors["period"] : ""}</span>
            </Form.Group>
            <Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className='ip-lable'>session Extend Price</Form.Label>
                <Form.Control type="number" placeholder="USD" min="0" name="price In USD" value={addMembership.sessionExtendPrice} onChange={(e) => { setAddMembership({ ...addMembership, sessionExtendPrice: e.target.value }) }} />
                {/* <span style={{ color: "red" }}>{addMembership.consultationExtentionCostUSD === ''? errors["priceInCrypto"] : ""}</span> */}
            </Form.Group>
            <Form.Label className='mr-4'>Consultations</Form.Label>
                <select className='form-control form-select' onChange={(e) => {
                    setAddMembership({ ...addMembership, consultations:e.target.value })
                    }}>
                        <option value={1}>Select Consultations</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                </select>
                <span style={{ color: "red" }}>{addMembership.consultations === ''? errors["consultations"] : ""}</span>
            </Form.Group>
            <Form.Group className="switch-wrapper mb-3">
                <span className="d-block mb-2">Status</span>
                <label className="switch m-0">
                    <input type="checkbox" name="status" checked={addMembership.status ? true : false} onChange={(e) => {
                        setAddMembership({ ...addMembership, status: e.target.checked })
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

export default connect(null, {createMembership})(CreateMembership)