export const slopeModule = {
  name: "slope-shader",
  fs: `\
  precision highp float;

  float decodeElevation(vec3 rgb) {
    vec3 color = rgb * 255.0;
    return -10000.0 + ((color.r * 256.0 * 256.0 + color.g * 256.0 + color.b) * 0.1);
  }

  vec4 slopeColor(float slope, float elevation) {
  if (slope < custom.cutoffAngle || elevation < custom.cutoffElevation) {
    return vec4(0.0, 0.0, 0.0, 0.0); // Fully transparent
  }
  float t = clamp((slope)/60.0, 0.0, 1.0);

  if (t < 0.5) {
    float k = t / 0.50;
    return mix(vec4(0.0, 1.0, 0.0, custom.opacity), vec4(1.0, 1.0, 0.0, custom.opacity), k); // Green → Yellow
  } else if (t < 1.0) {
    float k = (t - 0.5) / 0.5;
    return mix(vec4(1.0, 1.0, 0.0, custom.opacity), vec4(1.0, 0.00, 0.0, custom.opacity), k); // Yellow → Red
  } else {
    float k = (t - 0.66) / 0.34;
    return mix(vec4(1.0, 0.5, 0.0, custom.opacity), vec4(1.0, 0.0, 0.0 , custom.opacity), k); // Red → Red
  }
}
  
  bool isAboveElevation(float elevation, float target) {
    return elevation >=200.0;
  }
  `,
};
