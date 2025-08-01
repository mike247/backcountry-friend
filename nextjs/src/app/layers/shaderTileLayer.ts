import { _TerrainExtension as TerrainExtension } from "@deck.gl/extensions";
import { TileLayer } from "deck.gl";
import { slopeModule } from "../shaders/slopeShader";
import { CustomBitmapLayer } from "./customBitmapLayer";
import { Texture } from "@luma.gl/core";
import { COORDINATE_SYSTEM } from "@deck.gl/core";
import { lngLatToWorld } from "@math.gl/web-mercator";
import { AvalancheUniformProps } from "../shaders/uniforms";

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
  minZoom,
  maxZoom,
  shaderProps,
  data,
  visible,
  texture = null,
  maskBounds = null,
  avalancheUniforms,
}: {
  id: string;
  threeDimensions: boolean;
  shader: (shaderProps: { [key: string]: number }) => string;
  minZoom: number;
  maxZoom: number;
  data: string;
  shaderProps: { [key: string]: number };
  visible: boolean;
  maskBounds?: [number, number, number, number] | null;
  texture?: null | Texture;
  avalancheUniforms?: AvalancheUniformProps | undefined;
}) => {
  return new TileLayer({
    id: id + threeDimensions,
    data,
    minZoom,
    maxZoom,
    opacity: 1,
    tileSize: 512,
    color: [256, 256, 256],
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

      const tileBounds: [number, number, number, number] = [
        ...lngLatToWorld(bb[0]),
        ...lngLatToWorld(bb[1]),
      ];
      if (maskBounds) {
        const intersects =
          tileBounds[0] < maskBounds[2] &&
          tileBounds[2] > maskBounds[0] &&
          tileBounds[1] < maskBounds[3] &&
          tileBounds[3] > maskBounds[1];
        if (!intersects) return null;
      }

      return new CustomBitmapLayer({
        id,
        _imageCoordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        image: data,
        extensions: threeDimensions ? [new TerrainExtension()] : [],
        customUniforms: {
          pixelSize: [metersPerPixel, metersPerPixel],
          textureSize: [tileWidth, tileHeight],
          opacity: shaderProps.opacity,
          cutoffElevation: shaderProps.cutoffElevation,
          cutoffAngle: shaderProps.cutoffAngle,
          tileBounds,
          maskBounds: maskBounds ? maskBounds : [0, 0, 0, 0],
        },
        avalancheUniforms,
        texture,
        bounds: [bb[0][0], bb[0][1], bb[1][0], bb[1][1]],
        module: slopeModule,
        shader: shader(shaderProps),
      });
    },
  });
};
