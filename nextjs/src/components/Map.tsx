"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import { useMapContext } from "../reducers/mapReducer";
import { Map as MapType } from "leaflet";

import "leaflet/dist/leaflet.css";
import LocateMe from "./LocateMe";
import { useEffect, useRef } from "react";

const Map = () => {
  const { map } = useMapContext();
  const mapInstance = useRef<MapType | null>(null);

  useEffect(() => {
    // Handle zooming to search, this stops the messy need to store the map container
    if (mapInstance.current && map.searchResults.center)
      mapInstance.current.setView(
        map.searchResults.center,
        map.searchResults.zoom
      );
  }, [map.searchResults.center, map.searchResults.zoom]);

  const coreTiles = map.baseMap
    .filter((layer) => layer.active)
    .map((layer) => {
      return (
        <TileLayer
          key={layer.title}
          url={layer.url}
          {...layer.meta}
          zIndex={0}
        />
      );
    });

  const satelliteTiles = map.dataLayers.satelliteLayers.layers
    .filter((layer) => layer.active)
    .map((layer) => (
      <TileLayer key={layer.title} url={layer.url} {...layer.meta} zIndex={1} />
    ));

  const slopeTiles = map.dataLayers.slopeLayers.layers
    .filter((layer) => layer.active)
    .map((layer) => (
      <TileLayer key={layer.title} url={layer.url} {...layer.meta} zIndex={2} />
    ));
  const shadeTiles = map.dataLayers.shadeLayers.layers
    .filter((layer) => layer.active)
    .map((layer) => (
      <TileLayer key={layer.title} url={layer.url} {...layer.meta} zIndex={2} />
    ));

  return (
    <div style={{ width: "100vw", height: "100%" }}>
      <MapContainer {...map.meta} ref={mapInstance}>
        {coreTiles}
        {satelliteTiles}
        {slopeTiles}
        {shadeTiles}
        <LocateMe />
      </MapContainer>
    </div>
  );
};

export default Map;
