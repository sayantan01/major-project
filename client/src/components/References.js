import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Disqus from "disqus-react";


function TableRow(props) {
  return (
    <tr>
      <td>{props.first}</td>
      <td>{props.second}</td>
    </tr>
  );
}

function References(props) {
  
  const disqusShortname = "covipred";
  const disqusConfig = {
    url: "https://vaccine-scheduler-2021-app.herokuapp.com/",
    identifier: "comment-id",
    title: "discuss",
  };

  const dsources = [['Warehouses', <p>Scraped from the website: <a href="https://www.uppercareers.com/government-medical-colleges-in-west-bengal">www.uppercareers.com/government-medical-colleges-in-west-bengal</a></p>],
                    ['Zones', <p>We considered district headquarters of West Bengal as the points of receiving vaccine batches in each zone(district). Data scraped from <a href="https://en.wikipedia.org/wiki/List_of_districts_of_West_Bengal">en.wikipedia.org/wiki/List_of_districts_of_West_Bengal</a></p>],
                    ['Data on population count, infected, dead, recovered and vaccinated counts', <a href="https://data.covid19india.org">data.covid19india.org</a>],
                    ['Geographic distances between warehouses and zones', <p>calculated using <a href="https://www.mapmyindia.com">www.mapmyindia.com</a></p>]]

  const rsources = [[<p>Roy, Satyaki, Nirnay Ghosh, Nitish Uplavikar, and Preetam Ghosh. "Towards a Unified Pandemic Management Architecture: Survey, Challenges and Future Directions." arXiv preprint arXiv:2202.07448 (2022).</p>, <a href="https://arxiv.org/abs/2202.07448 
">https://arxiv.org/abs/2202.07448</a>],
[<p>Roy, Satyaki, Pratyay Dutta, and Preetam Ghosh. "Generalizable multi-vaccine distribution strategy based on demographic and behavioral heterogeneity." In 2021 IEEE International Conference on Bioinformatics and Biomedicine (BIBM), pp. 1495-1498. IEEE, 2021.</p>, <a href="https://ieeexplore.ieee.org/abstract/document/9669682/ 
">https://ieeexplore.ieee.org/abstract/document/9669682/</a>],
[<p>Roy, Satyaki, Andrii Cherevko, Sayak Chakraborty, Nirnay Ghosh, and Preetam Ghosh. "Leveraging network science for social distancing to curb pandemic spread." IEEE Access 9 (2021): 26196-26207.</p>, <a href="https://ieeexplore.ieee.org/abstract/document/9350633
">https://ieeexplore.ieee.org/abstract/document/9350633</a>],
[<p>Roy, Satyaki, Ronojoy Dutta, and Preetam Ghosh. "Optimal time-varying vaccine allocation amid pandemics with uncertain immunity ratios." IEEE Access 9 (2021): 15110-15121.</p>, <a href="https://ieeexplore.ieee.org/abstract/document/9330610">https://ieeexplore.ieee.org/abstract/document/9330610</a>]]

  const renderRow = (sources) => {
        return sources.map((item, i) => {
          return (
            <TableRow
              key={i}
              first={item[0]}
              second={item[1]}
            />
          );
        });
      };

  return (
    <div className="container align-content-center my-3">
      {props.token === null && <Redirect to="/Login" />}
      <Helmet>
        <style>{"body { background-color: rgb(0, 30, 60); }"}</style>
      </Helmet>
      <Row>
        <Col xs={5}>
          <h2 id="heading">References</h2>
        </Col>
      </Row>
      <Row className="my-5">
        <h4 id="heading">Data sources</h4>
        <Col lg={5} xs={6} style={{marginRight: 5, marginTop: 10}}>
          <table
            id="prediction"
            className="table table-dark table-striped table-hover"
          >
            <thead style={{ color: "red" }}>
              <tr>
                <td>
                  <b>Data</b>
                </td>
                <td>
                  <b>Source</b>
                </td>
              </tr>
            </thead>
            <tbody>{renderRow(dsources)}</tbody>
          </table>
        </Col>
        <div className="vr"></div>
        <Col lg={6} xs={6} style={{marginTop: 10, marginLeft: 10}}>
          <h4 id="heading">Related Papers</h4>
          <table
            id="prediction"
            className="table table-dark table-striped table-hover"
          >
            <thead style={{ color: "red" }}>
              <tr>
                <td>
                  <b>Paper</b>
                </td>
                <td>
                  <b>Link</b>
                </td>
              </tr>
            </thead>
            <tbody>{renderRow(rsources)}</tbody>
          </table>
        </Col>
      </Row>
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
    token: state.token
  };
};

export default connect(mapStateToProps)(References);
