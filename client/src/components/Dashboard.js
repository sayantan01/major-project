import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Search from "./Search";
import { fetchLocations } from "../actions/creators";
import Map from "./Map";

function Dashboard(props) {
  useEffect(() => {
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
    <div className="container align-content-center justify-content-center my-3">
      {props.token === null && <Redirect to="/Login" />}
      <Helmet>
        <style>{"body { background-color: rgb(0, 30, 60); }"}</style>
      </Helmet>
      <h2 id="heading">Get the predictions here</h2>
      <Row className="my-5">
      <Col lg={6}>
      <Row className="my-5">
        <Search
          options={warehouses}
          warehouse={1}
          title="search by warehouse"
        />
      </Row>
      <Row className="my-5">
        <Search options={zones} warehouse={0} title="search by zone"/>
      </Row>
      </Col>
      <Col lg={6}>
      <Row className="my-5 mx-auto">
        <Map />
      </Row>
      </Col>
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
