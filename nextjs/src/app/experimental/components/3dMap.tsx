import "maplibre-gl/dist/maplibre-gl.css";
import { Layer as LayerType, useMapContext } from "@/reducers/mapReducer";
import { DeckGL, MapView } from "deck.gl";
import { createTileLayer } from "../layers/2dLayers";
import { createTerrainLayer } from "../layers/3dLayers";
import { generateEffects } from "../layers/effects";
import { useMemo } from "react";

const generateData = (
  baseMap: LayerType[],
  activeLayers: LayerType[],
  threeDimensions: boolean
) => {
  const layerFunction = threeDimensions ? createTerrainLayer : createTileLayer;

  const coreTiles = baseMap.map((layer) => {
    return layerFunction(layer);
  });

  const allLayers = [
    ...coreTiles,
    ...activeLayers.map((layer) => layerFunction(layer)),
  ];

  return allLayers;
};

const MapComponent = () => {
  const { map } = useMapContext();

  const twodController = new MapView({
    controller: {
      doubleClickZoom: true,
      inertia: true,
      touchRotate: false,
      dragMode: "pan",
      dragRotate: false,
    },
  });

  const threedController = new MapView({
    controller: {
      doubleClickZoom: true,
      inertia: true,
      touchRotate: true,
      dragMode: "pan",
      dragRotate: true,
    },
  });

  const dataLayers = useMemo(() => {
    return generateData(
      map.baseMap,
      map.activeLayers,
      map.effectsState.threeDimensions
    );
  }, [map.baseMap, map.activeLayers, map.effectsState.threeDimensions]);

  return (
    <DeckGL
      initialViewState={map.meta}
      views={
        map.effectsState.threeDimensions ? threedController : twodController
      }
      effects={generateEffects(map)}
      layers={[...dataLayers]}
    ></DeckGL>
  );
};

export default MapComponent;
