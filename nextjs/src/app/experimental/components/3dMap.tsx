import "maplibre-gl/dist/maplibre-gl.css";
import {
  Layer as LayerType,
  ShaderLayer,
  useMapContext,
} from "@/reducers/mapReducer";
import { DeckGL, MapView } from "deck.gl";
import { createTileLayer } from "../layers/2dLayers";
import { createTerrainLayer } from "../layers/3dLayers";
// import { generateEffects } from "../layers/effects";
import { useMemo } from "react";
import { shaderTilelayer } from "../layers/shaderTileLayer";
import shaderLookup from "../shaders/shaderLookup";

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

const generateShaderLayers = (
  shaderLayers: ShaderLayer[],
  threeDimensions: boolean
) => {
  return shaderLayers.map((shader) => {
    const shaderProps: { [key: string]: number } = {};
    Object.keys(shader.sliders).forEach((key) => {
      shaderProps[key] = shader.sliders[key].value;
    });

    return shaderTilelayer({
      threeDimensions,
      id: shader.id,
      shaderProps,
      visible: shader.active,
      shader: shaderLookup[shader.id],
    });
  });

  // return [SlopeTileLayer(threeDimensions)];
};

const MapComponent = () => {
  const { map } = useMapContext();

  const twodController = new MapView({
    controller: {
      doubleClickZoom: true,
      inertia: true,
      touchRotate: true,
      dragMode: "pan",
      dragRotate: true,
    },
  });

  const threedController = new MapView({
    controller: {
      doubleClickZoom: true,
      inertia: true,
      touchRotate: true,
      dragMode: "rotate",
      dragRotate: true,
    },
  });

  const dataLayers = useMemo(() => {
    return [
      ...generateData(
        map.baseMap,
        map.activeLayers,
        map.effectsState.threeDimensions
      ),
    ];
  }, [map.baseMap, map.activeLayers, map.effectsState.threeDimensions]);

  const shaderLayers = useMemo(() => {
    return generateShaderLayers(
      map.activeShaders,
      map.effectsState.threeDimensions
    );
  }, [map.activeShaders, map.effectsState.threeDimensions]);

  console.log(shaderLayers);

  return (
    <DeckGL
      initialViewState={map.meta}
      views={
        map.effectsState.threeDimensions ? threedController : twodController
      }
      // effects={generateEffects(map)}
      layers={[...dataLayers, ...shaderLayers]}
    ></DeckGL>
  );
};

export default MapComponent;
