"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import { coreMaps, mapMeta, slopeLayers, shadeLayers } from "../maps/layers";
import { MapContext } from "../context/mapContext";
import { Map as MapType } from "leaflet";

import "leaflet/dist/leaflet.css";
import { useContext, useEffect, useRef } from "react";
import LocateMe from "./LocateMe";

const Map = () => {
  const { showSlope, activeShade, setMap } = useContext(MapContext);
  const map = useRef<MapType | null>(null);
  useEffect(() => {
    setMap(map);
  });
  const coreTiles = coreMaps.map((layer) => {
    return <TileLayer key={layer.title} url={layer.url} {...layer.meta} />;
  });

  const slopeTiles = slopeLayers.layers.map((layer) => (
    <TileLayer key={layer.title} url={layer.url} {...layer.meta} />
  ));
  const shadeTiles = shadeLayers.layers.map((layer) => (
    <TileLayer key={layer.title} url={layer.url} {...layer.meta} />
  ));

  return (
    <div style={{ width: "100vw", height: "100%" }}>
      <MapContainer {...mapMeta} ref={map}>
        {coreTiles}
        {showSlope && slopeTiles}
        {shadeTiles[activeShade]}
        <LocateMe />
      </MapContainer>
    </div>
  );
};

export default Map;
