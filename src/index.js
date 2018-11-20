import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";

import "./styles.css";

function App() {
  return <Map />;
}

class Map extends React.Component {
  state = {
    rawData: []
  };

  componentDidMount() {
    this.initializeMapbox();
    this.intializeIDMCData();
  }

  initializeMapbox() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaWRtY2RhIiwiYSI6ImNqY2JyNDZzazBqa2gycG8yNTh2eHM4dGYifQ.EOazpb8QxCCEKhhtrVjnYA";
    this.map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/idmcda/cjasa8fvu6hp92spaeobt52k6", // stylesheet location
      center: [0, 0], // starting position [lng, lat]
      zoom: 2 // starting zoom
    });
  }

  intializeIDMCData() {
    const url = "https://backend.idmcdb.org/data/idus_view_flat";

    fetch(url)
      .then(response => response.json())
      .then(json => {
        this.setState({
          rawData: json
        });
      })
      .then(x => this.insertDataIntoMap());
  }

  insertDataIntoMap() {
    this.geojson = {
      type: "FeatureCollection",
      features: this.state.rawData.map(x => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [x.longitude, x.latitude]
        }
      }))
    };

    this.map.on("load", () => {
      // Add a single point to the map
      this.map.addSource("point", {
        type: "geojson",
        data: this.geojson
      });

      this.map.addLayer({
        id: "point",
        type: "circle",
        source: "point",
        paint: {
          "circle-radius": 10,
          "circle-color": "#3887be"
        }
      });
    });
  }

  render() {
    return <div id="map" />;
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
