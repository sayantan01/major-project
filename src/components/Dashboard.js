import React, { useRef, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Search from "./Search";
import { fetchLocations } from "../actions/creators";
import Map from './Map';

function Dashboard(props) {

  useEffect(() => {
    console.log(props.warehouses);
    if (props.token !== null && props.warehouses === null) {
      props.dispatch(fetchLocations(props.token));
    }
  });

  const warehouses = [];
  const zones = [];
  if (props.warehouses) {
    props.warehouses.forEach((w) => warehouses.push(w.name));
  }
  if (props.zones) {
    props.zones.forEach((z) => zones.push(z.name));
  }

  return (
    <div className="container align-content-center my-3">
      {props.token === null && <Redirect to="/Login" />}
      <Helmet>
        <style>{"body { background-color: whitesmoke; }"}</style>
      </Helmet>
      <h2>Get the predictions here</h2>
      <Row className="my-5">
          <Search options={warehouses} warehouse = {1} title="search by warehouse" />
      </Row>
      <Row className="my-5">
          <Search options={zones} warehouse = {0} title="search by zone" />
      </Row>
      <Row className="my-5 mx-auto">
        <Map />
      </Row>
    </div>
  );
}

const mapStateToProps = function (state) {
  return {
    token: state.token,
    warehouses: state.warehouses,
    zones: state.zones,
  };
};

export default connect(mapStateToProps)(Dashboard);
