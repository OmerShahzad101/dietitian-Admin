import React, { PureComponent }  from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LineChart from '../Charts/LineChart'
import { Line} from 'react-chartjs-2'

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  // Tooltip,
} from "react-bootstrap";

import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ENV } from "../../config/config";

import { listdashboard } from "./Dashboard.action";
import { useHistory, useLocation } from "react-router";
import moment from "moment";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import PermissionsArray from "views/PermissionsArray/PermissionsArray";

function Dashboard(props) {
  var data = {}
  const history = useHistory();
  const location = useLocation();
  const [boardData, setBoardData] = useState(null);
  const [memberGraph, setMemberGraph]  = useState(null);
  const [coachGraph, setCoachGraph] = useState(null);
  const [memberMembershipsGraph, setMemberMembershipsGraph] = useState(null);
  const [coachMembershipsGraph, setCoachMembershipsGraph] = useState(null);
  const [userAuthenticData, setUserAuthenticData] = useState(null)
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    toast.dismiss();
    window.scroll(0, 0);
    props.listdashboard();
  }, []);

  useEffect(() => {
    if (props.dashboard.dashboardListAuth) {
      const { dashboardList,} = props.dashboard;
      setBoardData(dashboardList);
    }
  }, [props.dashboard.dashboardListAuth, props.dashboard.dashboardList]);

  useEffect(() => {
    if( props.dashboard.membersGraphAuth) {
      const { membersGraph } = props.dashboard;
      setMemberGraph(membersGraph);
    }
  },[props.dashboard.membersGraphAuth, props.dashboard.membersGraph]);   

  useEffect(() => {
    if( props.dashboard.coachesGraphAuth) {
      const { coachesGraph } = props.dashboard;
      setCoachGraph(coachesGraph);
    }
  },[props.dashboard.coachesGraphAuth, props.dashboard.coachesGraph]) ;

  useEffect(() => {
    if(props.dashboard.memberMembershipsGraphAuth) {
      const { memberMembershipsGraph } = props.dashboard;
      setMemberMembershipsGraph(memberMembershipsGraph);
    }
  },[props.dashboard.memberMembershipsGraphAuth, props.dashboard.memberMembershipsGraph]) 

  useEffect(() => {
    if(props.dashboard.coachMembershipsGraphAuth) {
      const { coachMembershipsGraph } = props.dashboard;
      setCoachMembershipsGraph(coachMembershipsGraph);
    }
  },[props.dashboard.coachMembershipsGraphAuth, props.dashboard.memberMembershipsGraph]) 

  useEffect(() => {
    if (boardData ) {
      setLoader(false);
    }
  }, [boardData,]);

  useEffect(() => {
    if (memberGraph ) {
      setLoader(false);
    }
  }, [memberGraph,]);
  
  useEffect(() => {
    if (coachGraph) {
      setLoader(false);
    }
  }, [coachGraph]);

  useEffect(() => {
    if (memberMembershipsGraph) {
      setLoader(false);
    }
  }, [memberMembershipsGraph]);

  useEffect(() => {
    if (coachMembershipsGraph) {
      setLoader(false);
    }
  }, [coachMembershipsGraph]);

  useEffect(() => {
    if (ENV.getUserKeys("encuse")) {
      let obj = ENV.getUserKeys();
      setUserAuthenticData(obj)
      data = obj?.permissionId;
    }
  }, [])

  useEffect(() => {
      if (userAuthenticData) {
          setLoader(false)
      }
  }, [userAuthenticData])

  return (
    <>
      <Container fluid>
        <Row>
          <Col xl="3" sm="6">
            <span onClick={() => history.push(`/staff`)}>
            <Card className="card-stats">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-chart text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Staff</p>
                      <Card.Title as="h4">{boardData?.totaladmin ? boardData.totaladmin : "0" }</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            </span>
          </Col>
          <Col xl="3" sm="6">
            <span onClick={() => history.push(`/members`)}>
            <Card className="card-stats">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-light-3 text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Members</p>
                      <Card.Title as="h4">{boardData?.totalmember ? boardData.totalmember : "0" }</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              {/* <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  Last day
                </div>
              </Card.Footer> */}
            </Card>
            </span>
          </Col>
          <Col xl="3" sm="6">
           <span onClick={() => history.push(`/coaches`)}>
           <Card className="card-stats">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Coaches</p>
                      <Card.Title as="h4">{boardData?.totalcoach ? boardData.totalcoach: "0"}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              {/* <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock-o mr-1"></i>
                  In the last hour
                </div>
              </Card.Footer> */}
            </Card>
           </span>
          </Col>
          <Col xl="3" sm="6">
            <span  onClick={() => history.push(`/coachmembership`)}>
            <Card className="card-stats">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category"> Coach Memberships</p>
                      <Card.Title as="h4">{boardData?.totalCoachMemberships ? boardData.totalCoachMemberships : "0" }</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            </span>
          </Col>
          <Col xl="3" sm="6">
            <span  onClick={() => history.push(`/membermembership`)}>
            <Card className="card-stats">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category"> Member Memberships</p>
                      <Card.Title as="h4">{boardData?.totalMemberMemberships ? boardData.totalMemberMemberships : "0" }</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            </span>
          </Col>
        </Row>
        <Row>
          <Col xl="6" sm="6">
          <h4>Members</h4>
            <ResponsiveContainer width="100%" aspect={3}>
              <AreaChart  data = {memberGraph}>
                <CartesianGrid strokeDasharray="3 3" horizontal = "" vertical = "" />
                <XAxis dataKey="_id"  />
                <YAxis dataKey="Count"  type="number" ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}/>
                <Tooltip />
                <Area type="monotone" dataKey="Count" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Col>

          <Col xl="6" sm="6">
          <h4>Coaches</h4>
          <ResponsiveContainer width="100%" aspect={3}>
              <AreaChart  data = {coachGraph}>
                <CartesianGrid strokeDasharray="3 3" horizontal = "" vertical = "" />
                <XAxis dataKey="_id"  />
                <YAxis dataKey="Count"  type="number" ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
                <Tooltip />
                <Area type="monotone" dataKey="Count" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Col>
        </Row>
        <Row>
          <Col xl="6" sm="6">
            <h4> Coach Memberships</h4>
            <ResponsiveContainer width="100%" aspect={3}>
              <AreaChart  data = {coachMembershipsGraph}>
                <CartesianGrid strokeDasharray="3 3" horizontal = "" vertical = "" />
                <XAxis dataKey="_id"  />
                <YAxis dataKey="Count"  type="number" ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}/>
                <Tooltip />
                <Area type="monotone" dataKey="Count" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Col>
        
          <Col xl="6" sm="6">
            <h4>Member Memberships</h4>
            <ResponsiveContainer width="100%" aspect={3}>
              <AreaChart  data = {memberMembershipsGraph}>
                <CartesianGrid strokeDasharray="3 3" horizontal = "" vertical = "" />
                <XAxis dataKey="_id"  />
                <YAxis dataKey="Count"  type="number" ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}/>
                <Tooltip />
                <Area type="monotone" dataKey="Count" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </Container>
    </>
  );
}

const mapStateToProps = (state) => ({
  dashboard: state.dashboard,
  error: state.error,
});

export default connect(mapStateToProps, {
  listdashboard,
})(Dashboard);

