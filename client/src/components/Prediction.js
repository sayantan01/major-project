import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Disqus from "disqus-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut, Pie } from "react-chartjs-2";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function TableRow(props) {
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.district}</td>
      <td>{props.ratio}</td>
      <td>{props.distance}</td>
    </tr>
  );
}

function Graph(props) {
  let vaccine_data = [];
  props.distances.map((item, i) => vaccine_data.push([item, props.ratios[i]]));
  vaccine_data.sort((x, y) => x[0] - y[0]);
  let distances = [];
  let ratios = [];
  vaccine_data.map((item, i) => {
    distances.push((item[0] / 1000).toFixed(2));
    ratios.push(item[1].toFixed(2));
    return 0;
  });

  const state = {
    labels: distances,

    datasets: [
      {
        label: "Vaccine Ratio",
        fill: true,
        lineTension: 0.5,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        data: ratios,
      },
    ],
  };

  const options = {
    responsive: true,
    tooltips: { enabled: true },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Vaccine Ratio vs Distance(in km) graph",
        color: "green",
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 3,
        },
        title: {
          display: true,
          text: "distance (in km)",
          color: "red",
          padding: 20,
          font: {
            size: 20,
          },
        },
      },
      y: {
        grid: {
          display: true,
          borderColor: "green",
          borderWidth: 3,
          circular: true,
          z: -1,
        },
        title: {
          display: true,
          text: "vaccine ratio",
          color: "red",
          padding: 20,
          font: {
            size: 20,
          },
        },
      },
    },
  };

  return (
    <div>
      <Line data={state} options={options} />
    </div>
  );
}

function DoughnutChart(props) {
  let _ratios= []
  let _names = []
  props.names.map((item, i) => {
    if(props.ratios[i] === 0)
      return
    _names.push(item.name)
    _ratios.push(props.ratios[i])
  })

  console.log(_names)
  const data = {
    labels: _names,
    datasets: [
        {
            label: 'Distribution of vaccines',
            data: _ratios,
            borderColor: "white",
            backgroundColor: "violet",
            pointBackgroundColor: 'rgba(255,206,86,0.2)',
        }

    ]
  }

  const options = {
    plugins: {
        title: {
            display: true,
            text: 'Distribution of vaccines',
            color:'white',
            font: {
                size:34
            },
            padding:{
                top:30,
                bottom:30
            },
            responsive:true,
            animation:{
                animateScale: true,
                           }
        }
    }

  }

  return (
      <div>
          <Pie data={data} options={options} />
      </div>
    )
}

function Prediction(props) {
  const [ratios, setRatios] = useState(null);
  const [distances, setDistances] = useState(null);
  const index = props.index;
  const warehouse = props.warehouse;

  const disqusShortname = "covipred";
  const disqusConfig = {
    url: "https://vaccine-scheduler-2021-app.herokuapp.com/",
    identifier: "comment-id",
    title: "discuss",
  };

  useEffect(() => {
    if (ratios !== null) return;
    (async function fetchdata() {
      try {
        const response = await axios.get(BACKEND_URL + "/api/predict", {
          params: {
            index: index,
            warehouse: warehouse,
          },
        });
        const { ratios, distances } = response.data;
        setRatios(ratios);
        setDistances(distances);
      } catch (err) {
        console.log("error!! ", err);
      }
    })();
  });

  const renderRow = () => {
    if (props.warehouses === null || ratios === null || distances === null)
      return;
    if (warehouse === 0) {
      return props.warehouses.map((item, i) => {
        if (ratios[i] === 0) return;
        return (
          <TableRow
            key={i}
            name={item.name}
            district={item.district}
            ratio={ratios[i]}
            distance={distances[i] / 1000}
          />
        );
      });
    } else {
      return props.zones.map((item, i) => {
        if (ratios[i] === 0) return;
        return (
          <TableRow
            key={i}
            name={item.name}
            district={item.district}
            ratio={ratios[i]}
            distance={distances[i] / 1000}
          />
        );
      });
    }
  };

  return (
    <div className="container align-content-center my-3">
      {props.token === null && <Redirect to="/Login" />}
      {props.zones === null && <Redirect to="/dashboard" />}

      <Helmet>
        <style>{"body { background-color: rgb(0, 30, 60); }"}</style>
      </Helmet>
      <Row className="my-3">
        <Col>
          {props.zones !== null && (
            <div>
              <h3>
                <Row>
                  <Col xl={6} id="heading">
                    Optimal ratio of vaccines for{" "}
                    {warehouse === 1 ? "warehouse:" : "zone:"}
                  </Col>
                  <Col>
                    {warehouse === 1 ? (
                      <p id="heading2">
                        {props.warehouses != null
                          ? props.warehouses[index].name
                          : "None"}
                      </p>
                    ) : (
                      <p id="heading2">
                        {props.zones != null ? props.zones[index].name : "None"}
                      </p>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col xl={6} id="heading">District:</Col>
                  <Col>
                    {warehouse === 1 ? (
                      <p id="heading2">
                        {props.warehouses != null
                          ? props.warehouses[index].district
                          : "None"}
                      </p>
                    ) : (
                      <p id="heading2">
                        {props.zones != null
                          ? props.zones[index].district
                          : "None"}
                      </p>
                    )}
                  </Col>
                </Row>
              </h3>
            </div>
          )}
        </Col>
      </Row>
      <Row className="my-5 d-flex justify-content-center">
        <Col lg={7}>
          <table
            id="prediction"
            className="table table-dark table-striped table-hover"
          >
            <thead style={{ color: "red" }}>
              <tr>
                <td>
                  <b>{warehouse === 0 ? "warehouse" : "zone"}</b>
                </td>
                <td>
                  <b>District</b>
                </td>
                <td>
                  <b>Ratio</b>
                </td>
                <td>
                  <b>Distance (in km)</b>
                </td>
              </tr>
            </thead>
            <tbody>{renderRow()}</tbody>
          </table>
        </Col>

      </Row>
      {distances !== null && (
        <Row id="graph" className="d-flex justify-content-center">
          {<Graph distances={distances} ratios={ratios} />}
        </Row>
      )}
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
    warehouses: state.warehouses,
    zones: state.zones,
    index: state.index,
    warehouse: state.warehouse,
  };
};

export default connect(mapStateToProps)(Prediction);
