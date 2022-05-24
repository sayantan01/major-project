import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import jwt_decode from "jwt-decode";
import { Container, Nav, Navbar } from "react-bootstrap";
import { connect } from "react-redux";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";
import Prediction from "./components/Prediction";
import User from "./components/User";
import NotFound from "./components/NotFound";
import Analytics from "./components/Analytics";
import Models from "./components/Models";
import Footer from "./components/Footer";
import References from "./components/References";
import { logoutUser } from "./actions/actionUtils";

import "./App.css";

function App(props) {
  useEffect(() => {
    try {
      const token = jwt_decode(props.token);
      const exp = token.exp;
      if (exp < Date.now() / 1000) {
        props.dispatch(logoutUser());
      }
    } catch (err) {
      console.log("no token");
    }
  }, [props]);
  return (
    <div>
      <Navbar bg="dark" sticky="top" variant="dark" expand="md" id="nav">
        <Container>
          <Navbar.Brand href="/home"><img
          alt=""
          src="logo.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{' '}CoviPred</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/signup">Signup</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/dashboard">Vaccine-predictor</Nav.Link>
              <Nav.Link href="/analytics">Data-analytics</Nav.Link>
              <Nav.Link href="/models">Case-predictor</Nav.Link>
              <Nav.Link href="/references">References</Nav.Link>
              {props.token !== null && (
                <Nav.Item>
                  <User />
                </Nav.Item>
              )}
              {props.token !== null && <Logout />}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/prediction" component={Prediction} />
          <Route exact path="/analytics" component={Analytics} />
          <Route exact path="/models" component={Models} />
          <Route exact path="/references" component={References} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps)(App);
