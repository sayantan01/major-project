import React from "react";
import { Row, Carousel } from "react-bootstrap";

function Home() {
  return (
    <div className="container-fluid" style={{ backgroundColor: "#1b1b1b" }}>
      <h1 id="title" className="text-center py-2">
        Vaccination Scheduler
      </h1>
      <h4 className="text-center py-2" style={{ color: "grey" }}>
        Predict the distribution of vaccines optimally
      </h4>
      <Row xl={3} lg={2} md={2} sm={1}>
        <Carousel
          style={{ width: 800, height: 500, margin: "auto", marginTop: 50 }}
        >
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="homepage1.png"
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="homepage2.jpg"
              alt="Second slide"
            />
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src="homepage3.jpeg"
              alt="Third slide"
            />
          </Carousel.Item>
        </Carousel>
      </Row>
    </div>
  );
}

export default Home;
