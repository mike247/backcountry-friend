import * as React from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Layer as LayerType,
  maptilerUrlBuilder,
  useMapContext,
} from "@/reducers/mapReducer";
import {
  DeckGL,
  BitmapLayer,
  TileLayer,
  MapViewState,
  TerrainLayer,
  MapView,
} from "deck.gl";

const createTileLayer = (layer: LayerType) => {
  return new TileLayer({
    id: layer.title,
    data: layer.url,
    maxZoom: layer.meta.maxNativeZoom || layer.meta.maxZoom,
    minZoom: layer.meta.minNativeZoom || layer.meta.minZoom,
    opacity: layer.meta.opacity === 1 ? 1 : 0.2,
    pickable: true,
    renderSubLayers: (props) => {
      const { boundingBox } = props.tile;

      return new BitmapLayer(props, {
        data: undefined,
        image: props.data,
        bounds: [
          boundingBox[0][0],
          boundingBox[0][1],
          boundingBox[1][0],
          boundingBox[1][1],
        ],
      });
    },
  });
};

const ELEVATION_DECODER = {
  rScaler: 6553.6,
  gScaler: 25.6,
  bScaler: 0.1,
  offset: -10000,
};

const createTerrainLayer = (layer: LayerType) => {
  return new TerrainLayer({
    id: layer.title,
    minZoom: layer.meta.minNativeZoom || layer.meta.minZoom,
    maxZoom: layer.meta.maxNativeZoom || layer.meta.maxZoom,
    elevationDecoder: ELEVATION_DECODER,
    elevationData: maptilerUrlBuilder("terrain-rgb-v2", "webp"),
    texture: layer.url,
    wireframe: false,
    opacity: layer.meta.opacity === 1 ? 1 : 0.2,
    pickable: true,
    color: [255, 255, 255],
  });
};

const MapComponent = () => {
  const { map, dispatch } = useMapContext();

  const core3dTiles = map.baseMap
    .filter(
      (layer) =>
        layer.active &&
        layer.meta.maxZoom >= map.viewState.zoom &&
        layer.meta.minZoom < map.viewState.zoom
    ) // TODO move to disopatch?
    .map((layer) => createTerrainLayer(layer));

  const slope3dTiles = map.dataLayers.slopeLayers.layers
    .filter((layer) => layer.active)
    .map((layer) => createTerrainLayer(layer));

  const shade3dTiles = map.dataLayers.shadeLayers.layers
    .filter((layer) => layer.active)
    .map((layer) => createTerrainLayer(layer));

  const coreTiles = map.baseMap
    .filter(
      (layer) =>
        layer.active &&
        layer.meta.maxZoom >= map.viewState.zoom &&
        layer.meta.minZoom < map.viewState.zoom
    ) // TODO move to disopatch?
    .map((layer) => createTileLayer(layer));

  const slopeTiles = map.dataLayers.slopeLayers.layers
    .filter((layer) => layer.active)
    .map((layer) => createTileLayer(layer));

  const shadeTiles = map.dataLayers.shadeLayers.layers
    .filter((layer) => layer.active)
    .map((layer) => createTileLayer(layer));

  const layers3d = [core3dTiles, slope3dTiles, shade3dTiles];
  const layers2d = [coreTiles, slopeTiles, shadeTiles];
  return (
    <DeckGL
      viewState={map.viewState}
      onViewStateChange={({ viewState }) => {
        dispatch({
          type: "updateViewState",
          payload: { value: viewState as MapViewState },
        });
      }}
      views={
        new MapView({
          controller: {
            doubleClickZoom: true,
            inertia: true,
            touchRotate: true,
            dragMode: "pan",
            dragRotate: true,
          },
        })
      }
      layers={map.threeDimensions ? layers3d : layers2d}
    ></DeckGL>
  );
};

export default MapComponent;
