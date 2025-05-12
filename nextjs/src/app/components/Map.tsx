"use client";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

const LINZ_API_KEY = "7aba637a120d4fe085fdd0835e7ca96d";
const TOPO_250 = "50798";
const TOPO_50 = "50767";
const TOPO_LINES = "50768";

const mapMeta = {
  ubdomains: "abcd",
  crossOrigin: true,
  attribution:
    "<a href=“http://data.linz.govt.nz”>Sourced from LINZ. CC BY 4.0</a>",
};

const urlBuilder = (layerId: string) => {
  return `http://tiles-{s}.tiles-cdn.koordinates.com/services;key=${LINZ_API_KEY}/tiles/v4/layer=${layerId}/EPSG:3857/{z}/{x}/{y}.png`;
};

const Map = () => {
  const [map, setMap] = useState<L.Map | null>();
  //   const [zoomLevel, setZoomLevel] = useState(10);

  useEffect(() => {
    setMap(
      L.map("map", {
        center: L.latLng(-44.6943, 169.1417),
        zoom: 9,
      })
    );
  }, []);

  useEffect(() => {
    if (map) {
      const outerLayer = L.tileLayer(urlBuilder(TOPO_250), mapMeta);

      const innerLayer = L.tileLayer(urlBuilder(TOPO_50), mapMeta);

      const topoLines = L.tileLayer(urlBuilder(TOPO_LINES), mapMeta);

      // map.addLayer(outerLayer);
      map.addLayer(topoLines);

      // map.on("zoomend", () => {
      //   const zoom = map.getZoom();
      //   console.log(zoom);
      //   if (zoom > 11 && map.hasLayer(outerLayer)) {
      //     map.addLayer(innerLayer);
      //     map.removeLayer(outerLayer);
      //   } else if (map.hasLayer(innerLayer)) {
      //     map.addLayer(outerLayer);
      //     map.removeLayer(innerLayer);
      //   }
      // });
    }
  }, [map]);

  return <div id="map" className="w-full h-full" />;
};

export default Map;
