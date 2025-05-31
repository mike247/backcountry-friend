export const slopeModule = {
  name: "slope-shader",
  fs: `\
  precision highp float;

  float decodeElevation(vec3 rgb) {
    vec3 color = rgb * 256.0;
    return -10000.0 + ((color.r * 256.0 * 256.0 + color.g * 256.0 + color.b) * 0.1);
  }

  float calculateSlope(float elevationX, float elevationY, vec2 pixelSize) {
    return degrees(atan(sqrt(
      pow(elevationX / pixelSize.x, 2.0) + 
      pow(elevationY / pixelSize.y, 2.0)
    )));
  }

  vec4 slopeColor(float slope, float elevation) {
    float t = clamp((slope)/90.0, 0.0, 1.0);

    if (slope < custom.cutoffAngle || elevation < custom.cutoffElevation) {
      return vec4(0.0, 0.0, 0.0, 0.0); // Fully transparent
    }

    if (t < 0.33) {
      float k = t / 0.4;
      return mix(vec4(0.0, 1.0, 0.0, custom.opacity), vec4(1.0, 1.0, 0.0, custom.opacity), k); // Green → Green
    } else if (t < 0.66) {
      float k = (t-0.4)/ 0.20;
      return mix(vec4(1.0, 1.0, 0.0, custom.opacity), vec4(1.0, 0.0, 0.0, custom.opacity), k); // Green → Yellow
    } else if (t < 1.0) {
      float k = (t - 0.6) / 0.4;
      return mix(vec4(1.0, 0.0, 0.0, custom.opacity), vec4(0.0, 0.0, 0.0, custom.opacity), k); // Yellow → Red
    } else {
      return vec4(0.0, 0.0, 0.0, custom.opacity);
    }
  }
  
  bool isAboveElevation(float elevation, float target) {
    return elevation >=200.0;
  }
  `,
};
