import React from "react";
import {Card, Container, Row, Col} from "react-bootstrap";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ENV } from "../../config/config";
import { listdashboard } from "./Dashboard.action";
import { useHistory, useLocation } from "react-router";
import { toast } from "react-toastify";


function Dashboard(props) {
  var data = {}
  const history = useHistory();
  const location = useLocation();
  const [boardData, setBoardData] = useState(null);
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
    if (boardData) {
      setLoader(false);
    }
  }, [boardData,]);


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
                      <p className="card-category">Clients</p>
                      <Card.Title as="h4">{boardData?.totalmember ? boardData.totalmember : "0" }</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
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
                      <p className="card-category">Dietitian</p>
                      <Card.Title as="h4">{boardData?.totalcoach ? boardData.totalcoach: "0"}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
           </span>
          </Col>
          <Col xl="3" sm="6">
            <span  onClick={() => history.push(`/`)}>
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
                      <p className="card-category">Sessions held</p>
                      <Card.Title as="h4">0</Card.Title>
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
                    <i className="nc-icon nc-paper-2 text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Blogs</p>
                      <Card.Title as="h4">{boardData?.totalBlogs ? boardData.totalBlogs: "0"}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            </span>
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

