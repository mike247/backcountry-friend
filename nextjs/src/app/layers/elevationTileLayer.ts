import { maptilerUrlBuilder } from "@/reducers/mapReducer";
import { BitmapLayer, BitmapLayerProps } from "@deck.gl/layers";
import {
  elevationThresholdModule,
  ElevationUniformProps,
  elevationUniformsModule,
} from "../shaders/dratShaders";
import { TileLayer } from "deck.gl";

interface SlopeBitmapLayerProps extends BitmapLayerProps {
  pixelSize: [number, number];
  textureSize: [number, number];
}

class SlopeBitmapLayer extends BitmapLayer<SlopeBitmapLayerProps> {
  draw(opts: unknown) {
    const { model } = this.state;
    if (model) {
      const elevationUniformProps: ElevationUniformProps = {
        pixelSize: this.props.pixelSize,
      };

      model.shaderInputs.setProps({
        elevation: elevationUniformProps,
      });
      super.draw(opts);
    }
  }

  getShaders(): {
    vs: string;
    fs: string;
    modules: (typeof elevationThresholdModule)[];
  } {
    const shaders = super.getShaders();
    return {
      ...shaders,
      modules: [
        ...(shaders.modules || []),
        elevationUniformsModule,
        elevationThresholdModule,
      ],
      fs: `#version 300 es
      precision highp float;

      in vec2 vTexCoord;
      out vec4 fragColor;

      uniform sampler2D bitmapTexture;

    void main() {
        float dx =  1.0 / 512.0;
        float dy =  1.0 / 512.0;

        vec3 center = texture(bitmapTexture, vTexCoord).rgb;
        vec3 left   = texture(bitmapTexture, vTexCoord + vec2(-dx, 0.0)).rgb;
        vec3 right  = texture(bitmapTexture, vTexCoord + vec2(dx, 0.0)).rgb;
        vec3 up     = texture(bitmapTexture, vTexCoord + vec2(0.0, -dy)).rgb;
        vec3 down   = texture(bitmapTexture, vTexCoord + vec2(0.0, dy)).rgb;

        float zc = decodeElevation(center);
        float zx = decodeElevation(right) - decodeElevation(left);
        float zy = decodeElevation(down) - decodeElevation(up);

        const float metersPerPixel = 5.0; // adjust as needed
        float aspectDeg = computeAspect(-zx, zy);

        float slope = degrees(atan(sqrt(
          pow(zx / elevation.pixelSize.x, 2.0) + 
          pow(zy / elevation.pixelSize.y, 2.0)
        )));

        // Color red only for north-facing slopes: 315°–360° or 0°–45°
        bool isNorthFacing = aspectDeg >= 180.0 || aspectDeg <= 0.0;
        bool isAbove2000 =  2000.0 >= zc && zc >= 200.0;
        // fragColor = (isNorthFacing && isAbove2000) ? vec4(1.0, 0.0, 0.0, 0.5) : vec4(0.0, 0.0, 0.0, 0.0); // transparent elsewhere

        fragColor = slopeColor(slope);

        // fragColor = vec4(elevation.pixelSize.x / 300.0, elevation.pixelSize.y / 300.0, 0.0, 1.0);
    }

          `,
    };
  }
}

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

export const SlopeTileLayer2 = new TileLayer({
  id: "slope-gpu-tiles",
  data: maptilerUrlBuilder("terrain-rgb-v2", "webp"),
  minZoom: 0,
  maxZoom: 14,
  opacity: 1,
  tileSize: 512,
  color: [255, 255, 255],
  // extensions: [new TerrainExtension()],
  renderSubLayers: ({ tile, data, id }) => {
    if (!data) return null;
    const { boundingBox: bb } = tile;
    const tileWidth = data?.width ?? 512;
    const tileHeight = data?.height ?? 512;

    const [[, minLat], [, maxLat]] = bb;
    const centerLat = (minLat + maxLat) / 2;

    const metersPerPixel = getMetersPerPixel(centerLat, tile.zoom); // rough, assumes near equator

    return new SlopeBitmapLayer({
      id,
      image: data,
      // extensions: [new TerrainExtension()],
      pixelSize: [metersPerPixel, metersPerPixel],
      textureSize: [tileWidth, tileHeight],
      bounds: [bb[0][0], bb[0][1], bb[1][0], bb[1][1]],
    });
  },
});

// export const GpuSlope3d = new TerrainLayer({
//   id: "GPU_SLOPE" + "3d",
//   minZoom: 0,
//   maxZoom: 14,
//   elevationDecoder: ELEVATION_DECODER,
//   elevationData: maptilerUrlBuilder("terrain-rgb-v2", "webp"),
//   operation: "terrain+draw",
//   wireframe: false,
//   color: [255, 255, 255],
// });
