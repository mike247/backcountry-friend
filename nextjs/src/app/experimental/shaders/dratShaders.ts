import { project32 } from "deck.gl";
import { ShaderModule, UniformTypes } from "@luma.gl/shadertools";

// slope-module.ts
export const slopeModule = {
  name: "slope-shader",
  fs: `#version 300 es
#define SHADER_NAME slope-shader

  precision highp float;
  in vec2 vTexCoord;     // texture coordinates from vertex shader
out vec4 fragColor;    // final fragment outpu
  
  uniform sampler2D bitmapTexture;
  uniform vec2 textureSize;
  
  float decodeElevation(vec3 rgb) {
  vec3 scaled = floor(rgb * 255.0 + 0.5);
  return -10000.0 + ((scaled.r * 256.0 * 256.0 + scaled.g * 256.0 + scaled.b) * 0.1);
}
  
  vec3 slopeColor(float slope) {
  float t = clamp(slope / 30.0, 0.0, 1.0);
  if (t < 0.33) {
    float k = t / 0.33;
    return mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), k); // Green → Yellow
  } else if (t < 0.66) {
    float k = (t - 0.33) / 0.33;
    return mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.65, 0.0), k); // Yellow → Orange
  } else {
    float k = (t - 0.66) / 0.34;
    return mix(vec3(1.0, 0.65, 0.0), vec3(1.0, 0.0, 0.0), k); // Orange → Red
  }
}

vec4 getSlopeColor() {
  float dx = 1.0 / 512.0;
  float dy = 1.0 / 512.0;

  vec3 center = texture(bitmapTexture, vTexCoord).rgb;
  vec3 left   = texture(bitmapTexture, vTexCoord + vec2(-dx, 0.0)).rgb;
  vec3 right  = texture(bitmapTexture, vTexCoord + vec2(dx, 0.0)).rgb;
  vec3 up     = texture(bitmapTexture, vTexCoord + vec2(0.0, -dy)).rgb;
  vec3 down   = texture(bitmapTexture, vTexCoord + vec2(0.0, dy)).rgb;

  float zc = decodeElevation(center);
  float zx = decodeElevation(right) - decodeElevation(left);
  float zy = decodeElevation(down) - decodeElevation(up);

  const float metersPerPixel = 30.0; // adjust as needed
float slope = degrees(atan(sqrt(
  pow(zx / metersPerPixel, 2.0) + 
  pow(zy / metersPerPixel, 2.0)
)));

  return vec4(slopeColor(slope), 1.0);
}

  void main()  {
    fragColor = getSlopeColor();
  }
  `,
};

const elevationUniforms = `\
    uniform elevationUniforms {
     vec2 pixelSize;
    } elevation;
  `;

export type ElevationUniformProps = {
  pixelSize: [number, number];
};

export const elevationUniformsModule = {
  name: "elevation",
  vs: elevationUniforms,
  fs: elevationUniforms,
  uniformTypes: {
    pixelSize: "vec2<f32>",
  } as const satisfies UniformTypes<ElevationUniformProps>,
} as const satisfies ShaderModule<ElevationUniformProps>;

export const elevationThresholdModule = {
  name: "elevation-threshold-shader",

  fs: `\
  precision highp float;

  float decodeElevation(vec3 rgb) {
    vec3 color = rgb * 255.0;
    return -10000.0 + ((color.r * 256.0 * 256.0 + color.g * 256.0 + color.b) * 0.1);
  }

  vec4 slopeColor(float slope) {
  if (slope < 3.0) {
    return vec4(0.0, 0.0, 0.0, 0.0); // Fully transparent
  }
  float t = clamp((slope)/60.0, 0.0, 1.0);

  if (t < 0.5) {
    float k = t / 0.50;
    return mix(vec4(0.0, 1.0, 0.0, 0.5), vec4(1.0, 1.0, 0.0, 0.5), k); // Green → Yellow
  } else if (t < 1.0) {
    float k = (t - 0.5) / 0.5;
    return mix(vec4(1.0, 1.0, 0.0, 0.5), vec4(1.0, 0.00, 0.0, 0.5), k); // Yellow → Red
  } else {
    float k = (t - 0.66) / 0.34;
    return mix(vec4(1.0, 0.5, 0.0, 0.5), vec4(1.0, 0.0, 0.0 , 0.5), k); // Red → Red
  }
}
  
  float computeAspect(float zx, float zy) {
    float a = atan(zx, zy);
    a = degrees(a);
    return (a < 0.0 ? 360.0 + a : a);
  }
  
  bool isNorthFacing(float aspectDeg) {
    return aspectDeg >= 315.0 || aspectDeg <= 45.0;
  }
  
  bool isAbove2000(float elevation) {
    return elevation <= 2000.0 && elevation >=200.0;
  }
  `,
};

export const tintModule = {
  name: "tint-shader",
  fs: `\
      precision highp float;
  
      uniform sampler2D bitmapTexture;
  
      vec4 getColor() {
        vec4 color = texture2D(bitmapTexture, vTexCoord);
        // Tint everything slightly red to prove this runs
        color.rgb = mix(color.rgb, vec3(1.0, 0.0, 0.0), 0.5);
        return color;
      }
    `,
  inject: {
    "fs:DECKGL_FS_MAIN": "fragColor = getColor();",
  },
  modules: [project32],
};
