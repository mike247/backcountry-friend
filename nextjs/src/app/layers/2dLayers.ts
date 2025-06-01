import { BitmapLayer, TileLayer } from "deck.gl";
import { Layer as LayerType } from "@/reducers/mapReducer";

export const createTileLayer = (layer: LayerType) => {
  return new TileLayer({
    id: layer.id,
    // visible: layer.active,
    data: layer.url,
    maxZoom: layer.meta.maxNativeZoom || layer.meta.maxZoom,
    minZoom: layer.meta.minNativeZoom || layer.meta.minZoom,
    opacity: layer.meta.opacity === 1 ? 1 : 0.2,
    pickable: false,
    zoomOffset: 1,
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
