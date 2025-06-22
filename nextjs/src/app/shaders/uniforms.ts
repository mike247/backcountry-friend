import { ShaderModule, UniformTypes } from "@luma.gl/shadertools";

const customUniform = `\
    uniform customUniforms {
     vec2 pixelSize;
     vec2 textureSize;
     float opacity;
     float cutoffAngle;
     float cutoffElevation;
     vec4 tileBounds;
     vec4 maskBounds;
    } custom;
  `;

export type CustomUniformProps = {
  pixelSize: [number, number];
  textureSize: [number, number];
  opacity: number;
  cutoffAngle: number;
  cutoffElevation: number;
  tileBounds: [number, number, number, number];
  maskBounds: [number, number, number, number];
  // maskTexture: Texture;
};

export const customUniformModule = {
  name: "custom",
  vs: customUniform,
  fs: customUniform,
  uniformTypes: {
    pixelSize: "vec2<f32>",
    textureSize: "vec2<f32>",
    opacity: "f32",
    cutoffAngle: "f32",
    cutoffElevation: "f32",
    tileBounds: "vec4<f32>",
    maskBounds: "vec4<f32>",
  } as const satisfies UniformTypes<CustomUniformProps>,
} as const satisfies ShaderModule<CustomUniformProps>;

const avalancheUniform = `
  uniform avalancheUniforms {
    float ha_min;
    float a_min;
    vec3 ha_n;
    vec3 ha_ne;
    vec3 ha_e;
    vec3 ha_se;
    vec3 ha_s;
    vec3 ha_sw;
    vec3 ha_w;
    vec3 ha_nw;
    vec3 a_n;
    vec3 a_ne;
    vec3 a_e;
    vec3 a_se;
    vec3 a_s;
    vec3 a_sw;
    vec3 a_w;
    vec3 a_nw;
    vec3 sa_n;
    vec3 sa_ne;
    vec3 sa_e;
    vec3 sa_se;
    vec3 sa_s;
    vec3 sa_sw;
    vec3 sa_w;
    vec3 sa_nw;
  } avalanche;
`;

// export const defaultAvalancheUniformProps = {
//   ha_n: [0, 0, 0, 0];
//   ha_ne: [0, 0, 0, 0];
//   ha_e: [0, 0, 0, 0];
//   ha_se: [0, 0, 0, 0];
//   ha_s: [0, 0, 0, 0];
//   ha_sw: [0, 0, 0, 0];
//   ha_w: [0, 0, 0, 0];
//   ha_nw: [0, 0, 0, 0];
//   a_n: [0, 0, 0, 0];
//   a_ne: [0, 0, 0, 0];
//   a_e: [0, 0, 0, 0];
//   a_se: [0, 0, 0, 0];
//   a_s: [0, 0, 0, 0];
//   a_sw: [0, 0, 0, 0];
//   a_w: [0, 0, 0, 0];
//   a_nw: [0, 0, 0, 0];
//   sa_n: [0, 0, 0, 0];
//   sa_ne: [0, 0, 0, 0];
//   sa_e: [0, 0, 0, 0];
//   sa_se: [0, 0, 0, 0];
//   sa_s: [0, 0, 0, 0];
//   sa_sw: [0, 0, 0, 0];
//   sa_w: [0, 0, 0, 0];
//   sa_nw: [0, 0, 0, 0];
// }

export type AvalancheUniformProps = {
  ha_min: number;
  a_min: number;
  ha_n: [number, number, number];
  ha_ne: [number, number, number];
  ha_e: [number, number, number];
  ha_se: [number, number, number];
  ha_s: [number, number, number];
  ha_sw: [number, number, number];
  ha_w: [number, number, number];
  ha_nw: [number, number, number];
  a_n: [number, number, number];
  a_ne: [number, number, number];
  a_e: [number, number, number];
  a_se: [number, number, number];
  a_s: [number, number, number];
  a_sw: [number, number, number];
  a_w: [number, number, number];
  a_nw: [number, number, number];
  sa_n: [number, number, number];
  sa_ne: [number, number, number];
  sa_e: [number, number, number];
  sa_se: [number, number, number];
  sa_s: [number, number, number];
  sa_sw: [number, number, number];
  sa_w: [number, number, number];
  sa_nw: [number, number, number];
};

export const avalanceUniformModule = {
  name: "avalanche",
  vs: avalancheUniform,
  fs: avalancheUniform,
  uniformTypes: {
    ha_min: "f32",
    a_min: "f32",
    ha_n: "vec3<f32>",
    ha_ne: "vec3<f32>",
    ha_e: "vec3<f32>",
    ha_se: "vec3<f32>",
    ha_s: "vec3<f32>",
    ha_sw: "vec3<f32>",
    ha_w: "vec3<f32>",
    ha_nw: "vec3<f32>",
    a_n: "vec3<f32>",
    a_ne: "vec3<f32>",
    a_e: "vec3<f32>",
    a_se: "vec3<f32>",
    a_s: "vec3<f32>",
    a_sw: "vec3<f32>",
    a_w: "vec3<f32>",
    a_nw: "vec3<f32>",
    sa_n: "vec3<f32>",
    sa_ne: "vec3<f32>",
    sa_e: "vec3<f32>",
    sa_se: "vec3<f32>",
    sa_s: "vec3<f32>",
    sa_sw: "vec3<f32>",
    sa_w: "vec3<f32>",
    sa_nw: "vec3<f32>",
  } as const satisfies UniformTypes<AvalancheUniformProps>,
} as const satisfies ShaderModule<AvalancheUniformProps>;
