import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Tabs, Tab, Row, Col } from "react-bootstrap";
import Disqus from "disqus-react";

function AnalyticsGraph(props) {
  return (
    <div className="container my-5">
      <img
        className="img-fluid mx-auto d-block"
        src={props.path}
        alt={props.title}
        id="nimg"
      />
    </div>
  );
}

function MobilityGraph(props) {
  return (
    <div>
      <Row className="my-5 mx-3">
          <Col lg={6} xs={12} mx-auto className="my-3">
            <img
              className="img-fluid mx-auto d-block"
              src={props.path[0]}
              alt={props.title[0]}
              id="mimg"
            />        
          </Col>
          <Col lg={6} xs={12} mx-auto className="my-3">
            <img
              className="img-fluid mx-auto d-block"
              src={props.path[1]}
              alt={props.title[1]}
              id="mimg"
            />        
          </Col>
      </Row>
      <Row className="my-5 mx-3">
          <Col lg={6} xs={12} mx-auto className="my-3">
            <img
              className="img-fluid mx-auto d-block"
              src={props.path[2]}
              alt={props.title[2]}
              id="mimg"
            />        
          </Col>
          <Col lg={6} xs={12} mx-auto className="my-3">
            <img
              className="img-fluid mx-auto d-block"
              src={props.path[3]}
              alt={props.title[3]}
              id="mimg"
            />        
          </Col>
      </Row>
      <Row className="my-5 mx-3">
          <Col lg={6} xs={12} mx-auto className="my-3">
            <img
              className="img-fluid mx-auto d-block"
              src={props.path[4]}
              alt={props.title[4]}
              id="mimg"
            />        
          </Col>
      </Row>
    </div>

  );
}

function Analytics(props) {
  const disqusShortname = "covipred";
  const disqusConfig = {
    url: "https://vaccine-scheduler-2021-app.herokuapp.com/",
    identifier: "comment-id",
    title: "discuss",
  };

  return (
    <div className="container align-content-center my-3">
      {props.token === null && <Redirect to="/Login" />}
      <Helmet>
        <style>{"body { background-color: rgb(0, 30, 60); }"}</style>
      </Helmet>
      <h2 id="heading">Data Analytics</h2>
      <div id="analytics" className="my-5">
        <Tabs
          defaultActiveKey="infected"
          className="myTabs"
          style={{ backgroundColor: 'darkblue', borderRadius: 25 }}
          variant = 'pills'
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
          <Tab eventKey="mobility" title="Mobility">
            <MobilityGraph path={["retail.png", "grocery.png", "parks.png", "transit.png", "workplaces.png"]} title={["retail", "grocery", "parks", "transit", "workplaces"]}/>
          </Tab>
        </Tabs>
      </div>
      <div className="my-5">
        <Disqus.DiscussionEmbed
          shortname={disqusShortname}
          config={disqusConfig}
        />
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
