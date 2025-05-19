import { maptilerUrlBuilder, Layer as LayerType } from "@/reducers/mapReducer";
import { TerrainLayer } from "deck.gl";

const ELEVATION_DECODER = {
  rScaler: 6553.6,
  gScaler: 25.6,
  bScaler: 0.1,
  offset: -10000,
};

export const createTerrainLayer = (layer: LayerType) => {
  return new TerrainLayer({
    id: layer.id + "3d",
    visible: layer.active,
    minZoom: layer.meta.minNativeZoom || layer.meta.minZoom,
    maxZoom: layer.meta.maxNativeZoom || layer.meta.maxZoom,
    elevationDecoder: ELEVATION_DECODER,
    elevationData: maptilerUrlBuilder("terrain-rgb-v2", "webp"),
    texture: layer.url,
    wireframe: false,
    opacity: layer.meta.opacity === 1 ? 1 : 0.2,
    pickable: false,
    color: [255, 255, 255],
  });
};
