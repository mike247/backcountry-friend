import {
  maptilerUrlBuilder,
  Layer as LayerType,
  ELEVATION_DECODER,
} from "@/reducers/mapReducer";
import { TerrainLayer } from "deck.gl";

export const createTerrainLayer = (layer: LayerType) => {
  return new TerrainLayer({
    id: layer.id + "3d",
    visible: layer.active,
    minZoom: layer.meta.minNativeZoom || layer.meta.minZoom,
    maxZoom: layer.meta.maxNativeZoom || layer.meta.maxZoom,
    elevationDecoder: ELEVATION_DECODER,
    elevationData: maptilerUrlBuilder(
      "01970637-6934-727b-8da9-53393cfd4b5d",
      "png"
    ),
    texture: layer.url,
    wireframe: false,
    opacity: layer.meta.opacity === 1 ? 1 : 0.2,
    operation: "terrain+draw",
    pickable: false,
    color: [255, 255, 255],
  });
};
