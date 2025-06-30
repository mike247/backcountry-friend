import { BitmapLayer, TileLayer } from "deck.gl";
import { Layer as LayerType } from "@/reducers/state";
import { _TerrainExtension as TerrainExtension } from "@deck.gl/extensions";

export const createTileLayer = (layer: LayerType, threeDimensions: boolean) => {
  return new TileLayer({
    id: layer.id + threeDimensions,
    data: layer.url,
    maxZoom: layer.meta.maxNativeZoom || layer.meta.maxZoom,
    minZoom: layer.meta.minNativeZoom || layer.meta.minZoom,
    opacity: layer.meta.opacity === 1 ? 1 : 0.2,
    pickable: false,
    zoomOffset: 1,
    extensions: threeDimensions ? [new TerrainExtension()] : [],
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
