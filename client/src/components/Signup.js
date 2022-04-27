import React, { useState } from "react";
import axios from "axios";
import { Redirect, withRouter } from "react-router";
import { connect } from "react-redux";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Signup(props) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [successful, setSuccessful] = useState(false);
  const [signuperror, setSignuperror] = useState("");
  const [passwdshow, setPasswdshow] = useState(0);
  const [namefocus, setNamefocus] = useState(false);
  const [mailfocus, setMailfocus] = useState(false);

  let passwdicon = passwdshow === 1 ? faEye : faEyeSlash;

  let mailicon = mailfocus === true ?
                <FontAwesomeIcon icon={faEnvelope} pulse /> : 
                <FontAwesomeIcon icon={faEnvelope} />

  let nameicon = namefocus === true ?
                <FontAwesomeIcon icon={faUser} pulse /> : 
                <FontAwesomeIcon icon={faUser} />

  const onChangeName = (e) => {
    e.persist();
    setValues((values) => ({
      ...values,
      name: e.target.value,
    }));
  };
  const onChangeEmail = (e) => {
    e.persist();
    setValues((values) => ({
      ...values,
      email: e.target.value,
    }));
  };
  const onChangePassword = (e) => {
    e.persist();
    setValues((values) => ({
      ...values,
      password: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userObj = {
      name: values.name,
      email: values.email,
      password: values.password,
    };
    axios
      .post(BACKEND_URL + "/api/user/signup", userObj)
      .then((res) => {
        console.log("User registered successfully!");
        setSuccessful(true);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status !== 500) setSignuperror(err.response.data.msg);
        else setSignuperror("Internal server error");
      });
  };

  return (
    <div className="container">
      {props.token !== null && <Redirect to="/dashboard" />}
      {successful === false && signuperror && (
        <Alert variant="warning" onClose={() => setSignuperror("")} dismissible>
          {signuperror}
        </Alert>
      )}
      {successful && (
        <Alert
          variant="success"
          onClose={() => setSuccessful(false)}
          dismissible
        >
          <p>
            Successfully registered. You can Now <a href="/Login">Login here</a>
          </p>
        </Alert>
      )}
      <Helmet>
        <style>{"body { background-color: rgb(0, 30, 60); }"}</style>
      </Helmet>
      <form onSubmit={onSubmit}>
        <div className="d-grid gap-2 col-6 mx-auto text-center my-4">
          <h2 className="form-title" id="heading">Create Account{' '}<img
          alt=""
          src="logo.png"
          width="40"
          height="40"
          className="d-inline-block align-top"
          id="loginbrand"
        /></h2>
        </div>
        <div className="d-grid gap-2 col-6 mx-auto my-3">
          <label style={{color: 'white'}}>
            Name<sup style={{ color: "red" }}>*</sup>
          </label>
          <div className="input-group" id="inp">
            <span className="input-group-text">
              {nameicon}
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={values.name}
              onChange={onChangeName}
              onMouseEnter={() => setNamefocus(true)}
              onMouseLeave={() => setNamefocus(false)}
              required
            />
          </div>
        </div>
        <div className="d-grid gap-2 col-6 mx-auto my-3">
          <label style={{color: 'white'}}>
            Email<sup style={{ color: "red" }}>*</sup>
          </label>
          <div className="input-group" id="inp">
            <span className="input-group-text">
              {mailicon}
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email ID"
              value={values.email}
              onChange={onChangeEmail}
              onMouseEnter={() => setMailfocus(true)}
              onMouseLeave={() => setMailfocus(false)}
              required
            />
          </div>
        </div>
        <div className="d-grid gap-2 col-6 mx-auto my-3">
          <label style={{color: 'white'}}>
            Password<sup style={{ color: "red" }}>*</sup>
          </label>
          <div className="input-group" id="inp">
            <span className="input-group-text">
              <FontAwesomeIcon
                icon={passwdicon}
                onClick={(e) => setPasswdshow(1 - passwdshow)}
              />
            </span>
            <input
              type={passwdshow === 0 ? "password" : "text"}
              className="form-control"
              placeholder="Password"
              value={values.password}
              onChange={onChangePassword}
            />
          </div>
        </div>
        <div className="d-grid gap-2 col-6 mx-auto">
          <input
            type="submit"
            className="btn btn-success"
            value="Signup"
            disabled={
              values.email.length === 0 ||
              values.name.length === 0 ||
              values.password.length === 0
                ? true
                : false
            }
          />
        </div>
      </form>
      <div className="d-grid gap-2 col-6 mx-auto my-4 text-center">
        <p style={{color: 'white'}}>
          Already have an account?{" "}
          <a href="/login" className="link-primary">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

const mapStateToProps = function (state) {
  return {
    token: state.token,
    errors: state.msg,
  };
};
export default connect(mapStateToProps)(withRouter(Signup));
