import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Tabs, Tab } from "react-bootstrap";

function AnalyticsGraph(props) {
  return (
    <div className="container my-5">
      <img
        className="img-fluid mx-auto d-block"
        src={props.path}
        alt={props.title}
      />
    </div>
  );
}

function Analytics(props) {
  return (
    <div className="container align-content-center my-3">
      {props.token === null && <Redirect to="/Login" />}
      <Helmet>
        <style>{"body { background-color: black; }"}</style>
      </Helmet>
      <h2 id="analytics_title">Data Analytics</h2>
      <div id="analytics" className="my-5">
        <Tabs
          defaultActiveKey="infected"
          id="analytics_tab"
          className="myTabs"
          style={{ backgroundColor: "whitesmoke", fontSize: 18 }}
        >
          <Tab eventKey="infected" title="Infected">
            <AnalyticsGraph path="plot_infected.png" title="Infected" />
          </Tab>
          <Tab eventKey="recovered" title="Recovered">
            <AnalyticsGraph path="plot_recovered.png" title="Recovered" />
          </Tab>
          <Tab eventKey="dead" title="Deceased">
            <AnalyticsGraph path="plot_dead.png" title="Deceased" />
          </Tab>
          <Tab eventKey="vaccinated" title="Vaccinated">
            <AnalyticsGraph path="plot_vaccinated.png" title="Vaccinated" />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

const mapStateToProps = function (state) {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps)(Analytics);
