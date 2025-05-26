import "maplibre-gl/dist/maplibre-gl.css";
import {
  Layer as LayerType,
  ShaderLayer,
  useMapContext,
} from "@/reducers/mapReducer";
import { MapView } from "deck.gl";
import { createTileLayer } from "../app/layers/2dLayers";
import { createTerrainLayer } from "../app/layers/3dLayers";
import { generateEffects } from "../app/layers/effects";
import { useEffect, useMemo, useRef, useState } from "react";
import { shaderTilelayer } from "../app/layers/shaderTileLayer";
import shaderLookup from "../app/shaders/shaderLookup";
import { DeckGL } from "@deck.gl/react";
import { CompassWidget, ZoomWidget } from "@deck.gl/widgets";
import debounce from "lodash.debounce";
import "@deck.gl/widgets/stylesheet.css";

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
    ...activeLayers
      .filter((layer) => !threeDimensions || !layer.hideOn3d)
      .map((layer) => layerFunction(layer)),
  ];

  return allLayers;
};

const generateShaderLayers = (
  activeShaders: string[],
  shaders: ShaderLayer[],
  threeDimensions: boolean
) => {
  return activeShaders.map((id) => {
    const shader = shaders.find((shader) => shader.id === id);
    if (!shader) return undefined;
    const shaderProps: { [key: string]: number } = {};
    Object.keys(shader.sliders).forEach((key) => {
      shaderProps[key] = shader.sliders[key].value;
    });

    return shaderTilelayer({
      threeDimensions,
      id: shader.id,
      minZoom: shader.meta.minZoom,
      maxZoom: shader.meta.maxZoom,
      data: shader.url,
      shaderProps,
      visible: shader.active,
      shader: shaderLookup[shader.id],
    });
  });

  // return [SlopeTileLayer(threeDimensions)];
};

const MapComponent = () => {
  const { map, dispatch } = useMapContext();
  const [viewState, setViewState] = useState(map.viewState); // stable component state
  const latestViewState = useRef(map.viewState); // track all updates

  useEffect(() => {
    latestViewState.current = map.viewState;
  }, [map.viewState]);

  // Only update `viewState` when 3D mode changes
  useEffect(() => {
    setViewState(latestViewState.current);
  }, [map.threeDimensions]);

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
      dragMode: "rotate",
      dragRotate: true,
    },
  });

  const dataLayers = useMemo(() => {
    return [
      ...generateData(map.baseMap, map.activeLayers, map.threeDimensions),
    ];
  }, [map.baseMap, map.activeLayers, map.threeDimensions]);

  const shaderLayers = useMemo(() => {
    return generateShaderLayers(
      map.activeShaders,
      map.shaderLayers,
      map.threeDimensions
    );
  }, [map.activeShaders, map.shaderLayers, map.threeDimensions]);

  return (
    <DeckGL
      key={map.threeDimensions ? "deck-3d" : "deck-2d"} // force remount
      id="twoDimensions"
      initialViewState={
        map.threeDimensions // Dimension specific view conditions
          ? { ...viewState, maxPitch: 80, pitch: 45 }
          : { ...viewState, maxPitch: 0, pitch: 0, bearing: 0 }
      }
      views={map.threeDimensions ? threedController : twodController}
      onViewStateChange={debounce(
        ({ viewState }) =>
          dispatch({ type: "updateViewState", payload: { viewState } }),
        200
      )}
      effects={generateEffects(map)}
      layers={[...dataLayers, ...shaderLayers]}
      widgets={[new ZoomWidget({}), new CompassWidget({})]}
    ></DeckGL>
  );
  // return <>{map.threeDimensions ? experimentalMap : baseMap}</>;
};

export default MapComponent;
