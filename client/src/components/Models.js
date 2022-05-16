import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Select from "react-select";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Papa from 'papaparse';
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
import { Line } from "react-chartjs-2";


function TableRow(props) {
  return (
    <tr>
      <td>{props.date}</td>
      <td>{props.predicted}</td>
      <td>{props.true}</td>
    </tr>
  );
}

function Graph(props) {
  const dates = props.data.map((item, i) => item[1])
  const actual = props.data.map((item, i) => item[3])
  const predicted = props.data.map((item, i) => item[4])

  const state = {
    labels: dates,

    datasets: [
      {
        label: "predicted",
        fill: true,
        lineTension: 0.5,
        backgroundColor: "rgb(0, 0, 100)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 3,
        data: predicted,
      },
      {
        label: "actual",
        fill: true,
        lineTension: 0.5,
        backgroundColor: "rgb(100, 0, 0)",
        borderColor: "rgb(255, 99, 0)",
        borderWidth: 2,
        data: actual,
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
        text: "Datewise prediction graph",
        color: "white",
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
          text: "dates",
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
          text: "new cases",
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

function Models(props) {
  const [dists, setDists] = useState(null);
  const [displayData, setDispData] = useState(null);
  const [inputdist, setInputdist] = useState("");
  const [show, setShow] = useState(false);
  const [smape, setSmape] = useState("");
  const [mtype, setMtype] = useState("");
  const [inputmodel, setInputmodel] = useState("");
  const models = ['Random Forest Regressor', 'GRU', 'LSTM']
  const filenames = ['rf.csv', 'gru.csv', 'lstm.csv']
  const mtypes = ['1 day prediction', '7 days prediction', '7 days prediction']

  const disqusShortname = "covipred";
  const disqusConfig = {
    url: "https://vaccine-scheduler-2021-app.herokuapp.com/",
    identifier: "comment-id",
    title: "discuss",
  };

  const getDists = () => {
    let dists_ = []
    fetch('./data/rf.csv')
      .then(res => res.text())
      .then(res => {
        let data = Papa.parse(res).data
        for(let i = 1; i < data.length && data[i][2] !== undefined ; i += 7)
          dists_.push(data[i][2])
        setDists(dists_)
      })
  }

  const getSmape = (dispd) => {
      const actual = dispd.map((item, i) => item[3])
      const predicted = dispd.map((item, i) => item[4])
      let smape = 0.0
      for(let i = 0; i < actual.length; i++)
        smape += (Math.abs(actual[i] - predicted[i]) * 2) / (Math.abs(actual[i]) + Math.abs(predicted[i]))
      smape *= 100/actual.length
      return smape
  }

  const getData = (dist, model) => {
    const ind = models.indexOf(model)
    const fname = filenames[ind]
    let results = []
    console.log('./data/' + fname)
    fetch('./data/' + fname)
      .then(res => res.text())
      .then(res => {
        let data = Papa.parse(res)
        console.log(data.data)
        let dispd = data.data.filter(v => v[2] == dist)
      
        setSmape(getSmape(dispd))
        setDispData(dispd);
        setMtype(mtypes[models.indexOf(model)]);
      })

  }

  useEffect(() => {
    if (props.token !== null && dists === null) {
      getDists();
    }
    });


  const handleSelectDist = (choice) => {
    setInputdist(choice.value);
  };

  const handleSelectModel = (choice) => {
    setInputmodel(choice.value);
  };

  const handleClick = () => {
    getData(inputdist, inputmodel);
    setShow(true);
  }

  let searchDists = []
  let searchModels = []
  if(dists !== null)  
  {
    dists.map((option, i) =>
      searchDists.push({ value: option, label: option.charAt(0).toUpperCase() + option.slice(1) })
    );
  }
  models.map((option, i) =>
      searchModels.push({ value: option, label: option })
    );


  const renderRow = () => {
      if (displayData === null)
        return;
        return displayData.map((item, i) => {
          return (
            <TableRow
              key={i}
              date={item[1]}
              predicted={parseFloat(item[4]).toFixed(2)}
              true={parseFloat(item[3]).toFixed(2)}
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
      <h2 id="heading">Case predictor</h2>
      </Col>
      {show === true && 
      <Col xs={4}>
        <h5 id="heading">Percentage error(Smape): <i>{parseFloat(smape).toFixed(4)}</i></h5>
        <h5 id="heading">Model type: <i>{mtype}</i></h5>
      </Col>
      }
      </Row>
      <Row className="my-5">
        {dists !== null && 
          <Col xs={5}>
            <Select
              options={searchDists}
              placeholder="choose a district"
              onChange={handleSelectDist}
              id="inp2"
            />
          </Col>
        }
        {inputdist !== "" && 
          <Col xs={5}>
            <Select
              options={searchModels}
              placeholder="choose a model"
              onChange={handleSelectModel}
              id="inp2"
            />
          </Col>
        }
        {inputdist !== "" && inputmodel !== "" &&
          <Col xs={2}>
            <button
            className="btn btn-success"
            onClick={handleClick}
          >
            Go
          </button>
          </Col>
        }
      </Row>
      
      {show === true && 
      <Row className="my-5">
        <Col lg={4} xs={5}>
          <table
            id="prediction"
            className="table table-dark table-striped table-hover"
          >
            <thead style={{ color: "red" }}>
              <tr>
                <td>
                  <b>Date</b>
                </td>
                <td>
                  <b>Predicted</b>
                </td>
                <td>
                  <b>Actual</b>
                </td>
              </tr>
            </thead>
            <tbody>{renderRow()}</tbody>
          </table>
        </Col>
        <Col lg={7} xs={8} className="my-5">
          {displayData !== null && <Graph data={displayData} />}
        </Col>
      </Row>}
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

export default connect(mapStateToProps)(Models);
