import { maptilerUrlBuilder } from "@/reducers/mapReducer";
import { _TerrainExtension as TerrainExtension } from "@deck.gl/extensions";
import { TileLayer } from "deck.gl";
import { slopeModule } from "../shaders/slopeShader";
import { CustomBitmapLayer } from "./customBitmapLayer";

function getMetersPerPixel(
  latitude: number,
  zoom: number,
  tileSize = 512
): number {
  const EARTH_CIRCUMFERENCE = 40075016.686; // meters at equator
  return (
    (EARTH_CIRCUMFERENCE * Math.cos((latitude * Math.PI) / 180)) /
    (Math.pow(2, zoom) * tileSize)
  );
}

// TODO Have to pass in adjustable params as props which might make this hard to generalize?
// Maybe generalize hte tile layer and customise the subLayers
// luckily all mt shaders need most of hte same data, opacity, cutoffElevation etc so can
// probably keep the one namepsaced injected uniform object
export const shaderTilelayer = ({
  threeDimensions,
  id,
  shader,
  shaderProps,
  visible,
}: {
  id: string;
  threeDimensions: boolean;
  shader: (shaderProps: { [key: string]: number }) => string;
  shaderProps: { [key: string]: number };
  visible: boolean;
}) => {
  return new TileLayer({
    id: id,
    data: maptilerUrlBuilder("terrain-rgb-v2", "webp"),
    minZoom: 0,
    maxZoom: 14,
    opacity: 1,
    tileSize: 512,
    color: [255, 255, 255],
    visible,
    extensions: threeDimensions ? [new TerrainExtension()] : [],
    renderSubLayers: ({ tile, data, id }) => {
      if (!data) return null;
      const { boundingBox: bb } = tile;
      const tileWidth = data?.width ?? 512;
      const tileHeight = data?.height ?? 512;
      const [[, minLat], [, maxLat]] = bb;
      const centerLat = (minLat + maxLat) / 2;
      const metersPerPixel = getMetersPerPixel(centerLat, tile.zoom); // rough, assumes near equator
      return new CustomBitmapLayer({
        id,
        image: data,
        extensions: threeDimensions ? [new TerrainExtension()] : [],
        customUniforms: {
          pixelSize: [metersPerPixel, metersPerPixel],
          textureSize: [tileWidth, tileHeight],
          opacity: shaderProps.opacity,
          cutoffElevation: shaderProps.cutoffElevation,
          cutoffAngle: shaderProps.cutoffAngle,
        },
        bounds: [bb[0][0], bb[0][1], bb[1][0], bb[1][1]],
        module: slopeModule,
        shader: shader(shaderProps),
      });
    },
  });
};
