import { Layer as LayerType } from "@/reducers/state";
import { ELEVATION_DECODER, maptilerUrlBuilder } from "@/reducers/utils";
import { TerrainLayer } from "deck.gl";

export const createTerrainLayer = (layer: LayerType) => {
  return new TerrainLayer({
    id: layer.id + "3d",
    minZoom: layer.meta.minNativeZoom || layer.meta.minZoom,
    maxZoom: layer.meta.maxNativeZoom || layer.meta.maxZoom,
    elevationDecoder: ELEVATION_DECODER,
    elevationData: maptilerUrlBuilder("terrain-rgb-v2", "webp"),
    texture: layer.url,
    wireframe: false,
    opacity: layer.meta.opacity === 1 ? 1 : 0.2,
    operation: "terrain+draw",
    pickable: false,
    color: [255, 255, 255],
  });
};
