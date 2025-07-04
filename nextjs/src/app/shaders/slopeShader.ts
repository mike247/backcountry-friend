export const slopeModule = {
  name: "slope-shader",
  fs: `\
  precision highp float;

  float decodeElevation(vec3 rgb) {
    vec3 color = rgb * 255.0;
    return -10000.0 + ((color.r * 256.0 * 256.0 + color.g * 256.0 + color.b) * 0.1);
  }
  
  float computeAspect(float zx, float zy) {
    float a = atan(zx, zy);
    a = degrees(a) * -1.0;
    return (a < 0.0 ? 360.0 + a : a);
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
      float k = (t-0.4)/ 0.26;
      return mix(vec4(1.0, 1.0, 0.0, custom.opacity), vec4(1.0, 0.0, 0.0, custom.opacity), k); // Green → Yellow
    } else if (t < 1.0) {
      float k = (t - 0.6) / 0.34;
      return mix(vec4(1.0, 0.0, 0.0, custom.opacity), vec4(0.0, 0.0, 0.0, custom.opacity), k); // Yellow → Red
    } else {
      return vec4(0.0, 0.0, 0.0, custom.opacity);
    }
  }

   vec4 avalancheColor(float slope, float elevation) {
    // float t = clamp((slope)/90.0, 0.0, 1.0);

    float t = slope / 90.0;

    if (t < 0.33) {
      float k = t / 0.33;
      return mix(vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0), k); // Translucent
    } else if (t < 0.43) {
      float k = (t - 0.33)/ 0.1;
      return mix(vec4(1.0, 1.0, 0.0, custom.opacity/2.0), vec4(1.0, 0.0, 0.0, custom.opacity), k); // Yellow → Red
    } else if (t < 0.55) {
      float k = (t - 0.43) / 0.12;
      return mix(vec4(1.0, 0.0, 0.0, custom.opacity), vec4(1.0, 1.0, 0.0, custom.opacity/2.0), k); // red → black
    } else {
      return vec4(0.0, 0.0, 0.0, 0.0);
    }
  }
  
  bool isAboveElevation(float elevation, float target) {
    return elevation >=200.0;
  }
  `,
};
