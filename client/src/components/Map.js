import ReactDOM from "react-dom";
import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { getPrediction } from "../actions/actionUtils";
import { Row, Col } from "react-bootstrap";

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

mapboxgl.accessToken = process.env.REACT_APP_ACCESSTOKEN;

const Popup = ({ feature, dispatch, history }) => {
  const { id, name, description, index, warehouse } = feature.properties;

  const handleClick = (e) => {
    dispatch(getPrediction(index, warehouse));
    history.push("/prediction");
  };

  return (
    <div id={`popup-${id}`}>
      <Row>
        <Col>
          <h6 style={{ color: "red" }}>{name}</h6>
        </Col>
      </Row>
      <Row>
        <Col>
          <p style={{ fontSize: 15 }}>{description}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <button className="btn btn-success" onClick={handleClick}>
            Get Prediction
          </button>
        </Col>
      </Row>
    </div>
  );
};

function MapC(props) {
  const mapContainerRef = useRef(null);
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));
  const history = useHistory();

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [88.3639, 22.5726],
      zoom: 5,
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    map.on("load", () => {
      map.addSource("random-points-data", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.addLayer({
        id: "random-points-layer",
        source: "random-points-data",
        type: "symbol",
        layout: {
          "icon-image": "bar-15",
          "icon-padding": 0,
          "icon-allow-overlap": true,
        },
      });
    });

    map.on("moveend", async () => {
      try {
        const geojson_data = [];
        if (props.warehouses !== null && props.zones !== null) {
          props.warehouses.map((w, i) => {
            return geojson_data.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [w.longitude, w.latitude],
              },
              properties: {
                id: i,
                name: w.name,
                description: "warehouse",
                index: i,
                warehouse: 1,
              },
            });
          });
          props.zones.map((z, i) => {
            return geojson_data.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [z.longitude, z.latitude],
              },
              properties: {
                id: props.warehouses.length + i,
                name: z.name,
                description: "zone",
                index: i,
                warehouse: 0,
              },
            });
          });
        }

        const results = {
          type: "FeatureCollection",
          features: geojson_data,
        };
        map.getSource("random-points-data").setData(results);
      } catch {
        console.log("initializing...");
      }
    });

    map.on("mouseenter", "random-points-layer", (e) => {
      if (e.features.length) {
        map.getCanvas().style.cursor = "pointer";
      }
    });

    map.on("mouseleave", "random-points-layer", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("click", "random-points-layer", (e) => {
      if (e.features.length) {
        const feature = e.features[0];
        const popupNode = document.createElement("div");
        ReactDOM.render(
          <Popup
            feature={feature}
            dispatch={props.dispatch}
            history={history}
          />,
          popupNode
        );
        popUpRef.current
          .setLngLat(feature.geometry.coordinates)
          .setDOMContent(popupNode)
          .addTo(map);
      }
    });

    return () => map.remove();
  });

  return (
    <div
      className="map-container"
      ref={mapContainerRef}
      style={{ width: "50vw" }}
    />
  );
}

const mapStateToProps = function (state) {
  return {
    warehouses: state.warehouses,
    zones: state.zones,
  };
};

export default connect(mapStateToProps)(MapC);
