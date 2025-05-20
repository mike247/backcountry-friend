import { ShaderModule, UniformTypes } from "@luma.gl/shadertools";

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
