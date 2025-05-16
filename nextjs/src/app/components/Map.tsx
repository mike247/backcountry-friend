"use client";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import { coreMaps, mapMeta, slopeLayers, shadeLayers } from "../maps/layers";
import { MapContext } from "../context/mapContext";

import "leaflet/dist/leaflet.css";
import { useContext } from "react";

const Map = () => {
  const { showSlope, activeShade } = useContext(MapContext);
  // if (typeof window === "undefined") return <></>;
  const coreTiles = coreMaps.map((layer) => (
    <TileLayer key={layer.title} url={layer.url} {...layer.meta} />
  ));
  const slopeTiles = slopeLayers.map((layer) => (
    <TileLayer key={layer.title} url={layer.url} {...layer.meta} />
  ));
  const shadeTiles = shadeLayers.map((layer) => (
    <TileLayer key={layer.title} url={layer.url} {...layer.meta} />
  ));

  return (
    <div style={{ width: "100vw", height: "100%" }}>
      <MapContainer {...mapMeta}>
        {coreTiles}
        {showSlope && slopeTiles}
        {shadeTiles[activeShade]}
      </MapContainer>
    </div>
  );
};

export default Map;
