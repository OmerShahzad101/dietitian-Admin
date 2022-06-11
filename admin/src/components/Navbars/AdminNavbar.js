import React, {useEffect} from "react";
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import {
  Button,
  Dropdown,
  Form,
  Navbar,
  Nav,
  Container
} from "react-bootstrap";
import { beforeAdmin } from "views/Admin/Admin.action";

function AdminNavbar(props) {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const history = useHistory();
  return (
    <>
      <Navbar expand="lg">
        <Container fluid>
          <div className="navbar-wrapper">
            <div className="navbar-minimize">
              <Button
                className="btn-fill btn-round btn-icon d-none d-lg-block yellow-bg"
                variant="dark"
                onClick={() => document.body.classList.toggle("sidebar-mini")}
              >
                <i className="fas fa-ellipsis-v visible-on-sidebar-regular"></i>
                <i className="fas fa-bars visible-on-sidebar-mini"></i>
              </Button>
              <Button
                className="btn-fill btn-round btn-icon d-block d-lg-none yellow-bg"
                variant="dark"
                onClick={() =>
                  document.documentElement.classList.toggle("nav-open")
                }
              >
                <i className="fas fa-ellipsis-v visible-on-sidebar-regular"></i>
                <i className="fas fa-bars visible-on-sidebar-mini"></i>
              </Button>
            </div>
          </div>
          <div className=" d-flex">
            <Nav className="nav mr-auto" navbar>
              <Form
                className="navbar-form navbar-left navbar-search-form ml-3 ml-lg-0"
                role="search"
              >
              </Form>
            </Nav>

              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle
                  as={Nav.Link}
                  id="dropdown-41471887333"
                  variant="default"
                >
                  <i className="nc-icon nc-bullet-list-67"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  alignRight
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <Dropdown.Item
                    href="/profile"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push("/profile")
                    }}
                  >
                    <NavLink to="/profile">
                      <i className="nc-icon nc-settings-90"></i>
                      Profile
                    </NavLink>
                  </Dropdown.Item>
                  <div className="divider"></div>
                  <Dropdown.Item
                    className="text-danger"
                    href="/login"
                    onClick={() => {
                      props.beforeAdmin();
                      localStorage.removeItem("accessToken");
                      localStorage.removeItem("adminId");
                      localStorage.removeItem("encuse");
                    }}
                  >
                    <NavLink to="/login">
                      <i className="nc-icon nc-button-power"></i>
                      Log out
                    </NavLink>
                  </Dropdown.Item>

                </Dropdown.Menu>
              </Dropdown>

            <button
              className="navbar-toggler navbar-toggler-right border-0"
              type="button"
              onClick={() => setCollapseOpen(!collapseOpen)}
            >
              <span className="navbar-toggler-bar burger-lines"></span>
              <span className="navbar-toggler-bar burger-lines"></span>
              <span className="navbar-toggler-bar burger-lines"></span>
            </button>
            <Navbar.Collapse in={collapseOpen}> </Navbar.Collapse>
          </div>

        </Container>
      </Navbar>
    </>
  );
}


export default connect(null, { beforeAdmin })(AdminNavbar);
