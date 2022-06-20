import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { useHistory, useLocation } from 'react-router';
import moment from "moment";
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Select from "react-dropdown-select";
import { ENV } from '../../config/config';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { updateSettings, getSettings } from './Settings.action'

const Settings = (props) => {
    const history = useHistory();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search);
    const [loader, setLoader] = useState(false);
    const [editShow, setEditShow] = useState(true);
    const [editForm, setEditForm] = useState({});
    const [stateData, setStateData] = useState(null);
    
    useEffect(() => {
        toast.dismiss();
        window.scroll(0, 0);
        props.getSettings()
    }, []);
   
    useEffect(() => {
       if( props.settings.getSettingsAuth){
           const {getSettings} = props.settings;
           let Data = getSettings[0];
           setStateData(Data);
           setLoader(false)
       }
    }, [props.settings.getSettingsAuth, props.settings.getSettings]);

    // useEffect(() => {
    //     if( props.settings.updatedSettingsAuth){
    //         const {updatedSettings} = props.settings;
    //         // setStateData(getSettings);
    //         setLoader(false)
    //     }
    //  }, [props.settings.updatedSettingsAuth]);

    const submitEdit = (e) => {
        e.preventDefault()
        let obj = {};
        obj.email = stateData.email;
        obj.phone = stateData.phone;
        obj.mobile = stateData.mobile;
        obj.address = stateData.address;
        obj.twitter = stateData.twitter;
        obj.telegram = stateData.telegram;
        obj.facebook = stateData.facebook;
        obj.desc = stateData.desc;
        obj.discord = stateData.discord;
        obj.api = stateData.api;
        obj.domain = stateData.domain;
        props.updateSettings(obj)
        setEditShow(false)
        props.history.push('/settings')
    }
    return (
        <> 
           {
                loader ?
                    <FullPageLoader />
                    :
                    <Container>
                        <Form className="form" onSubmit={(e) => submitEdit(e)}>
                            <Row>
                            <Col md="12" sm="5">
                                <Card className="pb-4">
                                    <Card.Header>
                                    <Card.Header className="pl-0">
                                        <Card.Title as="h4" className="yellow-color">Social Data</Card.Title>
                                    </Card.Header>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Email</label>
                                                    <Form.Control placeholder='Email' value={stateData?.email} type="email" onChange={(e) => {
                                                        setStateData({...stateData, email:e.target.value})
                                                    }}></Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col className="pl-3" md="6">
                                                <Form.Group>
                                                    <label>Phone</label>
                                                    <Form.Control value={stateData?.phone}  placeholder="Phone" type='text' 
                                                    onChange={(e) => {
                                                        setStateData({...stateData, phone:e.target.value})
                                                    }}></Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Mobile</label>
                                                    <Form.Control value={stateData?.mobile}  placeholder="Mobile" type="mobile"   onChange={(e) => {
                                                        setStateData({...stateData, mobile:e.target.value})
                                                    }} ></Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Description</label>
                                                    <Form.Control value={stateData?.desc} placeholder="Description" onChange={(e) => {
                                                        setStateData({...stateData, desc:e.target.value})
                                                    }}  type="text">
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Address</label>
                                                    <Form.Control value={ stateData?.address }  onChange={(e) => {
                                                        setStateData({...stateData, address:e.target.value})
                                                    }} placeholder="Address" type="text">
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Linkedin</label>
                                                    <Form.Control placeholder="Linkedin" value={stateData?.discord} onChange={(e) => 
                                                        setStateData({ ...stateData, discord: e.target.value })}type="text">
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Facebook</label>
                                                    <Form.Control value={stateData?.facebook}  onChange={(e) => {
                                                        setStateData({...stateData, facebook:e.target.value})
                                                    }} placeholder="Facebook" type="text">
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Instagram</label>
                                                    <Form.Control placeholder="Instagram" value={stateData?.telegram} onChange={(e) => 
                                                        setStateData({ ...stateData, telegram: e.target.value })}type="text">
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Twitter</label>
                                                    <Form.Control value={stateData?.twitter}  onChange={(e) => {
                                                        setStateData({...stateData, twitter:e.target.value})
                                                    }} placeholder="Facebook" type="text">
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            </Row>
                            {/* <Row>
                                <Col md="11" sm="6">
                                    <Card className="pb-4">
                                        <Card.Body>
                                            <Row>
                                                <Col md="6">
                                                    <Form.Group>
                                                        <label>Mailgun Domain<span className="text-danger">*</span></label>
                                                        <Form.Control value={stateData?.domain}  placeholder="Mailgun Domain" type="text" onChange={(e) => 
                                                        setStateData({ ...stateData, domain: e.target.value })}></Form.Control>
                                                    </Form.Group>
                                                </Col>
                                                <Col md="6">
                                                    <Form.Group>
                                                        <label>Mailgun Api<span className="text-danger">*</span></label>
                                                        <Form.Control value={stateData?.api}  placeholder="Mailgun Api" type="text" onChange={(e) => 
                                                        setStateData({ ...stateData, api: e.target.value })}></Form.Control>
                                                    </Form.Group>
                                                </Col>
                                        </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row> */}
                            <Button className="btn-fill pull-right yellow-bg" type="submit" variant="info" >
                                Update Changes
                            </Button>
                        </Form>
                    </Container>
            }
        </>
    )
}
const mapStateToProps = state => ({
    settings:state.settings
});
export default connect( mapStateToProps, { updateSettings, getSettings })(Settings);