"use client";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

import { coreMaps, slopeLayers, shadeLayers, mapMeta } from "../maps/layers";

const Map = () => {
  const [map, setMap] = useState<L.Map | null>();
  const [zoomLevel, setZoomLevel] = useState(7);
  useEffect(() => {
    setMap(L.map("map", mapMeta));
  }, []);

  useEffect(() => {
    const baseMaps: { [key: string]: L.TileLayer | L.LayerGroup } = {};
    const overlayMaps: { [key: string]: L.TileLayer | L.LayerGroup } = {};

    if (map) {
      const slopeLayerGroup = L.layerGroup(
        slopeLayers.map((layer) => L.tileLayer(layer.url, layer.meta))
      );

      overlayMaps["Slope"] = slopeLayerGroup;

      shadeLayers.forEach((layer) => {
        baseMaps[layer.title] = L.tileLayer(layer.url, layer.meta);
      });

      const coreMapGroup = L.layerGroup(
        coreMaps.map((layer) => L.tileLayer(layer.url, layer.meta))
      );
      map.addLayer(coreMapGroup);

      L.control.layers(baseMaps, overlayMaps).addTo(map);
      map.on("zoomend", () => {
        const zoom = map.getZoom();
        setZoomLevel(zoom);
        console.log(zoom);
      });
    }
  }, [map]);

  return (
    <div id="map" className="w-full h-full">
      <span>{zoomLevel}</span>
    </div>
  );
};

export default Map;
