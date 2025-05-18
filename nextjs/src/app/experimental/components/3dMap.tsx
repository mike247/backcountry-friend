import * as React from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { Layer as LayerType, useMapContext } from "@/reducers/mapReducer";
import { DeckGL, BitmapLayer, TileLayer, MapViewState } from "deck.gl";

const createTileLayer = (layer: LayerType) => {
  return new TileLayer({
    id: layer.title,
    data: layer.url,
    maxZoom: layer.meta.maxZoom,
    minZoom: layer.meta.minZoom,
    opacity: layer.meta.opacity,
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
    pickable: false, // ???
  });
};

const MapComponent = () => {
  const { map } = useMapContext();
  const [zoom, setZoom] = React.useState(map.meta.zoom);
  const coreTiles = map.baseMap
    .filter((layer) => layer.meta.maxZoom >= zoom && layer.meta.minZoom < zoom) // TODO move to disopatch?
    .map((layer) => createTileLayer(layer));

  const slopeTiles = map.dataLayers.slopeLayers.layers
    .filter((layer) => layer.active)
    .map((layer) => createTileLayer(layer));

  const shadeTiles = map.dataLayers.shadeLayers.layers
    .filter((layer) => layer.active)
    .map((layer) => createTileLayer(layer));

  const layers = [coreTiles, slopeTiles, shadeTiles];
  return (
    <DeckGL
      initialViewState={{
        latitude: map.meta.center[0],
        longitude: map.meta.center[1],
        zoom: map.meta.zoom,
        maxZoom: map.meta.maxZoom,
        minZoom: map.meta.minZoom,
      }}
      onViewStateChange={({ viewState }) => {
        setZoom((viewState as MapViewState).zoom);
      }}
      controller
      layers={layers}
    ></DeckGL>
  );
};

export default MapComponent;
