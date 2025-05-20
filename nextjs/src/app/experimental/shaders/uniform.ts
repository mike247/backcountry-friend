import { ShaderModule, UniformTypes } from "@luma.gl/shadertools";

const customUniform = `\
    uniform customUniforms {
     vec2 pixelSize;
     float opacity;
     float cutoffAngle;
     float cutoffElevation;
    } custom;
  `;

export type CustomUniformProps = {
  pixelSize: [number, number];
  opacity: number;
  cutoffAngle: number;
  cutoffElevation: number;
};

export const customUniformModule = {
  name: "custom",
  vs: customUniform,
  fs: customUniform,
  uniformTypes: {
    pixelSize: "vec2<f32>",
    opacity: "f32",
    cutoffAngle: "f32",
    cutoffElevation: "f32",
  } as const satisfies UniformTypes<CustomUniformProps>,
} as const satisfies ShaderModule<CustomUniformProps>;
