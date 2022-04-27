import React, { useState } from "react";
import Select from "react-select";
import { Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { getPrediction } from "../actions/actionUtils";

function Search(props) {
  console.log(props);
  const history = useHistory();
  const [inputval, setInputval] = useState("");

  const handleSelect = (choice) => {
    console.log(choice.value, choice.label);
    setInputval(choice.value);
  };

  const handleClick = (e) => {
    props.dispatch(getPrediction(inputval, props.warehouse));
    history.push("/prediction");
  };

  let searchNames = [];
  props.options.map((option, i) =>
    searchNames.push({ value: i, label: option })
  );

  return (
    <div>
      <Row>
        <Col xs={6}>
          <Select
            options={searchNames}
            placeholder={props.title}
            onChange={handleSelect}
            id="inp2"
          />
        </Col>
        <Col xs={4}>
          <button
            className="btn btn-success"
            onClick={handleClick}
            disabled={inputval === "" ? true : false}
          >
            Go
          </button>
        </Col>
      </Row>
    </div>
  );
}

const mapStateToProps = function (state) {
  return {};
};

export default connect(mapStateToProps)(Search);
