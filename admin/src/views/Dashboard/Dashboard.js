import React, { PureComponent }  from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LineChart from '../Charts/LineChart'
import { Line} from 'react-chartjs-2'

// react-bootstrap components
import {
  Card,
  Container,
  Row,
  Col,
  // Tooltip,
} from "react-bootstrap";

import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ENV } from "../../config/config";

import { listdashboard } from "./Dashboard.action";
import { useHistory, useLocation } from "react-router";
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
  const [blogsGraph, setblogsGraph] = useState(null);
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
    if(props.dashboard.blogsGraphAuth) {
      const { blogsGraph } = props.dashboard;
      console.log(blogsGraph , "blogGraph")
      setblogsGraph(blogsGraph);
    }
  },[props.dashboard.blogsGraphAuth, props.dashboard.memberMembershipsGraph]) 

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
    if (blogsGraph) {
      setLoader(false);
    }
  }, [blogsGraph]);

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
            <span onClick={() => history.push(`/clients`)}>
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
                      <p className="card-category">Clients</p>
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
           <span onClick={() => history.push(`/dietitian`)}>
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
                      <p className="card-category">Dietitians</p>
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
            <span  onClick={() => history.push(`/dietitianmembership`)}>
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
                      <p className="card-category"> Sessions Held</p>
                      <Card.Title as="h4">{"0" }</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            </span>
          </Col>
          <Col xl="3" sm="6">
            <span  onClick={() => history.push(`/blogs`)}>
            <Card className="card-stats">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                    <i className="fab fa-blogger-b text-info"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Blog Articles</p>
                      <Card.Title as="h4">{boardData?.totalBlogs ? boardData.totalBlogs: "0"}</Card.Title>
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
          <h4>Clients</h4>
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
          <h4>Dietitians</h4>
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
            <h4> Blog Articles</h4>
            <ResponsiveContainer width="100%" aspect={3}>
              <AreaChart  data = {blogsGraph}>
                <CartesianGrid strokeDasharray="3 3" horizontal = "" vertical = "" />
                <XAxis dataKey="_id"  />
                <YAxis dataKey="Count"  type="number" ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}/>
                <Tooltip />
                <Area type="monotone" dataKey="Count" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Col>
        
          <Col xl="6" sm="6">
            <h4>Sessoins Held</h4>
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

