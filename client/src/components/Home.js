import React from "react";
import { Row, Carousel, Button, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import logo from './logo.png';
import MediaCard from './Cards';

function Home() {

  const history = useHistory();

  const handleClick = () => {
    history.push("/dashboard");
  }

  return (
    <div>
      <div className="container-fluid text-center" style={{ backgroundColor: "rgb(0, 30, 60)" }}>
        <h1 id="title" className="text-center py-2">
          CoviPred
        </h1>
        <h4 className="text-center py-2" style={{ color: "grey" }}>
          Intelligent prediction system for covid
        </h4>
        <Button variant="primary" onClick={handleClick}>
          Get started here
        </Button>
        <header className="App-header my-5">
            <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>

      <div className="my-3 d-flex justify-content-center" >
        <Row>
        <Col lg={4} xs={8} mx-auto className="my-3">
          <MediaCard image="card1.jpg" title="Vaccine ratio predictor" text="Predict vaccine ratio Zone and Warehouse wise. Several epidemiological factors considered." url="/dashboard"/>
        </Col>
        <Col lg={4} xs={8} className="my-3">
          <MediaCard image="card2.jpg" title="Covid cases predictor" text="Predict new covid cases districtwise. Several ML models deployed." url="/models"/>
        </Col>
        <Col lg={4} xs={8} className="my-3">
          <MediaCard image="card3.png" title="Data analyzer" text="Analyze trends in covid data through various graphs and charts" url="/analytics"/>
        </Col>
        </Row>
      </div>
    </div>
  );
}

export default Home;
