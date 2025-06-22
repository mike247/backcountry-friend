import "maplibre-gl/dist/maplibre-gl.css";
import { Layer as LayerType, ShaderLayer } from "@/reducers/state";
import { Layer, MapView, TerrainLayer } from "deck.gl";
import { createTileLayer } from "../app/layers/2dLayers";
import { generateEffects } from "../app/layers/effects";
import { useEffect, useMemo, useRef, useState } from "react";
import { shaderTilelayer } from "../app/layers/shaderTileLayer";
import shaderLookup from "../app/shaders/shaderLookup";
import { DeckGL, DeckGLRef } from "@deck.gl/react";
import { CompassWidget, ZoomWidget } from "@deck.gl/widgets";
import debounce from "lodash.debounce";
import "@deck.gl/widgets/stylesheet.css";
import { Device } from "@luma.gl/core";
import { useMapContext } from "@/reducers/context";
import generateAvalancheLayers from "@/app/layers/avalancheLayers";
import { ELEVATION_DECODER, maptilerUrlBuilder } from "@/reducers/utils";

const generateBaseLayer = (baseMap: LayerType, threeDimensions: boolean) => {
  return createTileLayer(baseMap, threeDimensions);
};

const generateDataLayers = (
  activeLayers: LayerType[],
  threeDimensions: boolean
) => {
  const allLayers = [
    ...activeLayers
      .filter((layer) => !threeDimensions || !layer.hideOn3d)
      .map((layer) => createTileLayer(layer, threeDimensions)),
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
};

const MapComponent = () => {
  const { map, dispatch } = useMapContext();
  const deckRef = useRef<DeckGLRef<MapView>>(null);
  const [deckDevice, setDeckDevice] = useState<Device | null>(null);
  const [avalancheLayers, setAvalancheLayers] = useState<Layer[]>([]);
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

  useEffect(() => {
    if (deckDevice) {
      const layers = async () => {
        const data = await generateAvalancheLayers({
          threeDimensions: map.threeDimensions,
          device: deckDevice,
          avalancheLayer: map.avalancheLayer,
          forecast: map.forecast,
        });

        setAvalancheLayers(data);
      };
      layers();
    }
  }, [map.threeDimensions, deckDevice, map.avalancheLayer, map.forecast]);

  const threedController = new MapView({
    controller: {
      doubleClickZoom: true,
      inertia: true,
      touchRotate: true,
      dragMode: "rotate",
      dragRotate: true,
    },
  });

  const baseLayers = useMemo(() => {
    return [generateBaseLayer(map.activeBase, map.threeDimensions)];
  }, [map.activeBase, map.threeDimensions]);

  const dataLayers = useMemo(() => {
    return [...generateDataLayers(map.activeLayers, map.threeDimensions)];
  }, [map.activeLayers, map.threeDimensions]);

  const shaderLayers = useMemo(() => {
    return generateShaderLayers(
      map.activeShaders,
      map.shaderLayers,
      map.threeDimensions
    );
  }, [map.activeShaders, map.shaderLayers, map.threeDimensions]);

  const terrainLayer = new TerrainLayer({
    id: "3d",
    minZoom: map.meta.minZoom,
    maxZoom: map.meta.maxZoom,
    elevationDecoder: ELEVATION_DECODER,
    elevationData: maptilerUrlBuilder("terrain-rgb-v2", "webp"),
    wireframe: false,
    opacity: 1,
    operation: "terrain+draw",
    pickable: false,
    color: [255, 255, 255],
  });

  return (
    <DeckGL
      key={map.threeDimensions ? "deck-3d" : "deck-2d"} // force remount
      ref={deckRef}
      id="deckGl"
      onDeviceInitialized={(device) => setDeckDevice(device)}
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
      layers={[
        ...(map.threeDimensions ? [terrainLayer] : []),
        ...baseLayers,
        ...dataLayers,
        ...shaderLayers,
        ...(map.avalancheLayer.active ? avalancheLayers : []),
      ]}
      widgets={[new ZoomWidget({}), new CompassWidget({})]}
    ></DeckGL>
  );
  // return <>{map.threeDimensions ? experimentalMap : baseMap}</>;
};

export default MapComponent;
