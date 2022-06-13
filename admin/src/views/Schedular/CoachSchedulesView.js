import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, } from 'react-router';
import { connect } from 'react-redux';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { toast } from 'react-toastify';
import AvailableTimes from "react-available-times";
import { beforeSchedluar, getCoachSchedular } from './CoachSchedular.action'
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons'
import { ENV } from '../../config/config';
import imagePlaceholder from "assets/img/placeholder.png";
import userDefaultImg from "../../assets/img/placeholder.png";

const CoachSchedulesView = (props) => {
    let coachId = props.match.params.id;
    const history = useHistory();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search);
    const [ coachSchedules, setCoachSchedules ] = useState([]);
    const [ coachData, setCoachData ] = useState([]);
    const [loader, setLoader] = useState(false);
   
    useEffect(() => {
      toast.dismiss();
      window.scroll(0, 0);
      props.beforeSchedluar()
      props.getCoachSchedular(coachId);
    }, [])

    useEffect(async () => {
      if (props.coachSchedules.getSchedularAuth) {
        let {selections} = await props.coachSchedules.getSchedular;
        setCoachSchedules(selections)
        let coachData = await props.coachSchedules.getSchedular
        setCoachData(coachData)
      }
  }, [props.coachSchedules.getSchedularAuth, props.coachSchedules.selections])

  useEffect(() => {
    if ( coachSchedules ) {
      setLoader(false)
    }
  }, [coachSchedules])

    return (
        <>
        {
            loader ?
                <FullPageLoader /> :
                <Container>
                <Row>
                <Col md="8" sm="6">
                <Card className="table-big-boy">
                    <div className="d-block  d-sm-flex justify-content-between align-items-center register-users">
                        <Card.Title as="h4">Schedules</Card.Title>
                        <Button className="yellow-bg m-0">
                            <span onClick={() => history.push(`/dietitian`)}>
                                GoBack
                            </span>
                            <span className="pl-1">
                                <FontAwesomeIcon icon={faArrowRight} />
                            </span>
                        </Button>
                    </div>
                        <Card.Body className="table-full-width">
                            <div className=' table-responsive'>
                                    <Table className="table-striped w-full">
                                        <thead>
                                          <tr>
                                              <th className="td-name">From</th>
                                              <th className="td-actions">To</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                coachSchedules && coachSchedules.length ?
                                                    coachSchedules.map((data, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td className="td-name">
                                                                    {data?.start}
                                                                </td>
                                                                <td className="td-name">
                                                                    {data?.end}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                    :
                                                    <tr>
                                                        <td colSpan="5" className="text-center">
                                                            <span className="no-data-found d-block">No Record found</span>
                                                        </td>
                                                    </tr>
                                            }
                                        </tbody>
                                    </Table>
                            </div> 
                        </Card.Body>       
                </Card>
                </Col>

                  <Col md="4">
                    <Card className="card-user">
                      <Card.Header className="no-padding">
                        <div className="card-image">
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <div className="author">
                          <img
                            alt="..."
                            className="avatar border-gray"
                            src={coachData.profileImage ? coachData.profileImage.includes('data:image') ? coachData.profileImage : `${ENV.Backend_Img_Url}${coachData.profileImage}` : userDefaultImg}
                          ></img>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Coach Name</Form.Label>
                            <Form.Control type="text"  name="coachName" value={coachData?.username} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text"  name="coachEmail" value={coachData?.email} disabled />
                        </Form.Group>
                      </Card.Body>
                      <Card.Footer>
                        <div className="pb-2"></div>
                      </Card.Footer>
                    </Card>
                  </Col>
                </Row>
              </Container>
        }

    </>
      
    );
}
const mapStateToProps = state => ({
  coachSchedules: state.coachSchedules,
  error: state.error
})

export default connect(mapStateToProps, { beforeSchedluar, getCoachSchedular })(CoachSchedulesView)