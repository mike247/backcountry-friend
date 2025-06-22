const shaderLookup: {
  [key: string]: ({}: { [key: string]: number }) => string;
} = {
  gpuAvalancheForecast: () => {
    return `#version 300 es
          precision highp float;
    
          in vec2 vTexCoord;
          out vec4 fragColor;
    
          uniform sampler2D maskTexture;
          uniform sampler2D bitmapTexture;

          vec3 noDataColor = vec3(0.847, 0.847, 0.847);

          bool isNorth(float aspect) {
            return aspect > 337.5 || aspect <= 22.5;
          }

          bool isNorthEast(float aspect) {
            return aspect > 22.5 && aspect <= 67.5;
          }

          bool isEast(float aspect) {
            return aspect > 67.5 && aspect <= 112.5;
          }

          bool isSouthEast(float aspect) {
            return aspect > 112.5 && aspect <= 157.5;
          }

          bool isSouth(float aspect) {
            return aspect > 157.5 && aspect <= 202.5;
          }

          bool isSouthWest(float aspect) {
            return aspect > 202.5 && aspect <= 247.5;
          }

          bool isWest(float aspect) {
            return aspect > 247.5 && aspect <= 292.5;
          }

          bool isNorthWest(float aspect) {
            return aspect > 292.5 && aspect <= 337.5;
          }

    
          void main() {
              vec2 flippedTexCoord = vec2(vTexCoord.x, 1.0 - vTexCoord.y);
              vec2 worldPos = mix(custom.tileBounds.xy, custom.tileBounds.zw, flippedTexCoord);
              vec2 maskUV = (worldPos - custom.maskBounds.xy) / (custom.maskBounds.zw - custom.maskBounds.xy);
              
              bool insideMask = 
                  worldPos.x >= custom.maskBounds.x && worldPos.x <= custom.maskBounds.z &&
                  worldPos.y >= custom.maskBounds.y && worldPos.y <= custom.maskBounds.w;
             
              float dx =  1.0 / custom.textureSize.x;
              float dy =  1.0 / custom.textureSize.y;
  
              vec3 center = texture(bitmapTexture, vTexCoord).rgb;
              vec3 left   = texture(bitmapTexture, vTexCoord + vec2(-dx, 0.0)).rgb;
              vec3 right  = texture(bitmapTexture, vTexCoord + vec2(dx, 0.0)).rgb;
              vec3 up     = texture(bitmapTexture, vTexCoord + vec2(0.0, -dy)).rgb;
              vec3 down   = texture(bitmapTexture, vTexCoord + vec2(0.0, dy)).rgb;
  
              float zc = decodeElevation(center);
              float zx = decodeElevation(right) - decodeElevation(left);
              float zy = decodeElevation(down) - decodeElevation(up);

              float aspect = computeAspect(zx, zy);

              if (insideMask) {
                float maskAlpha = texture(maskTexture, maskUV).r; // use .a if your PNG has alpha
                if (maskAlpha < 0.5) {
                    discard; // Or color it differently
                }


                // HA
                if (zc >= avalanche.ha_min) {
                  if (isNorth(aspect) && avalanche.ha_n != noDataColor) fragColor = vec4(avalanche.ha_n, custom.opacity);
                  else if (isNorthEast(aspect) && avalanche.ha_ne != noDataColor) fragColor = vec4(avalanche.ha_ne, custom.opacity);
                  else if (isEast(aspect) && avalanche.ha_e != noDataColor) fragColor = vec4(avalanche.ha_e, custom.opacity);
                  else if (isSouthEast(aspect) && avalanche.ha_se != noDataColor) fragColor = vec4(avalanche.ha_se, custom.opacity);
                  else if (isSouth(aspect) && avalanche.ha_s != noDataColor) fragColor = vec4(avalanche.ha_s, custom.opacity);
                  else if (isSouthWest(aspect) && avalanche.ha_sw != noDataColor) fragColor = vec4(avalanche.ha_sw, custom.opacity);
                  else if (isWest(aspect) && avalanche.ha_w != noDataColor) fragColor = vec4(avalanche.ha_w, custom.opacity);
                  else if (isNorthWest(aspect) && avalanche.ha_nw != noDataColor) fragColor = vec4(avalanche.ha_nw, custom.opacity);
                }

                // A
                else if (zc >= avalanche.a_min && zc < avalanche.ha_min) {
                  if (isNorth(aspect) && avalanche.a_n != noDataColor) fragColor = vec4(avalanche.a_n, custom.opacity);
                  else if (isNorthEast(aspect) && avalanche.a_ne != noDataColor) fragColor = vec4(avalanche.a_ne, custom.opacity);
                  else if (isEast(aspect) && avalanche.a_e != noDataColor) fragColor = vec4(avalanche.a_e, custom.opacity);
                  else if (isSouthEast(aspect) && avalanche.a_se != noDataColor) fragColor = vec4(avalanche.a_se, custom.opacity);
                  else if (isSouth(aspect) && avalanche.a_s != noDataColor) fragColor = vec4(avalanche.a_s, custom.opacity);
                  else if (isSouthWest(aspect) && avalanche.a_sw != noDataColor) fragColor = vec4(avalanche.a_sw, custom.opacity);
                  else if (isWest(aspect) && avalanche.a_w != noDataColor) fragColor = vec4(avalanche.a_w, custom.opacity);
                  else if (isNorthWest(aspect) && avalanche.a_nw != noDataColor) fragColor = vec4(avalanche.a_nw, custom.opacity);
                }

                // SA
                else if (zc >= 0.0 && zc < avalanche.a_min) {
                  if (isNorth(aspect) && avalanche.sa_n != noDataColor) fragColor = vec4(avalanche.sa_n, custom.opacity);
                  else if (isNorthEast(aspect) && avalanche.sa_ne != noDataColor) fragColor = vec4(avalanche.sa_ne, custom.opacity);
                  else if (isEast(aspect) && avalanche.sa_e != noDataColor) fragColor = vec4(avalanche.sa_e, custom.opacity);
                  else if (isSouthEast(aspect) && avalanche.sa_se != noDataColor) fragColor = vec4(avalanche.sa_se, custom.opacity);
                  else if (isSouth(aspect) && avalanche.sa_s != noDataColor) fragColor = vec4(avalanche.sa_s, custom.opacity);
                  else if (isSouthWest(aspect) && avalanche.sa_sw != noDataColor) fragColor = vec4(avalanche.sa_sw, custom.opacity);
                  else if (isWest(aspect) && avalanche.sa_w != noDataColor) fragColor = vec4(avalanche.sa_w, custom.opacity);
                  else if (isNorthWest(aspect) && avalanche.sa_nw != noDataColor) fragColor = vec4(avalanche.sa_nw, custom.opacity);
                }

              }
          }`;
  },
  gpuSlope: () => {
    return `#version 300 es
              precision highp float;
        
              in vec2 vTexCoord;
              out vec4 fragColor;
              uniform sampler2D bitmapTexture;
        
              void main() {
                    float dx =  1.0 / custom.textureSize.x;
                    float dy =  1.0 / custom.textureSize.y;
        
                    vec3 center = texture(bitmapTexture, vTexCoord).rgb;
                    vec3 left   = texture(bitmapTexture, vTexCoord + vec2(-dx, 0.0)).rgb;
                    vec3 right  = texture(bitmapTexture, vTexCoord + vec2(dx, 0.0)).rgb;
                    vec3 up     = texture(bitmapTexture, vTexCoord + vec2(0.0, -dy)).rgb;
                    vec3 down   = texture(bitmapTexture, vTexCoord + vec2(0.0, dy)).rgb;
        
                    float zc = decodeElevation(center);
                    float zx = decodeElevation(right) - decodeElevation(left);
                    float zy = decodeElevation(down) - decodeElevation(up);
        
                    float slope = calculateSlope(zx, zy, custom.pixelSize);
                    fragColor = slopeColor(slope, zc);

                    // fragColor = vec4(vec3(zc / 3000.0), 1.0); // Normalize to 0–1 for 0–3000m
                }
        
            `;
  },
  gpuAvalanche: () => {
    return `#version 300 es
              precision highp float;
        
              in vec2 vTexCoord;
              out vec4 fragColor;
        
              uniform sampler2D bitmapTexture;
        
                void main() {
                    float dx =  1.0 / custom.textureSize.x;
                    float dy =  1.0 / custom.textureSize.y;
        
                    vec3 center = texture(bitmapTexture, vTexCoord).rgb;
                    vec3 left   = texture(bitmapTexture, vTexCoord + vec2(-dx, 0.0)).rgb;
                    vec3 right  = texture(bitmapTexture, vTexCoord + vec2(dx, 0.0)).rgb;
                    vec3 up     = texture(bitmapTexture, vTexCoord + vec2(0.0, -dy)).rgb;
                    vec3 down   = texture(bitmapTexture, vTexCoord + vec2(0.0, dy)).rgb;
        
                    float zc = decodeElevation(center);
                    float zx = decodeElevation(right) - decodeElevation(left);
                    float zy = decodeElevation(down) - decodeElevation(up);
        
                    float slope = calculateSlope(zx, zy, custom.pixelSize);

                    fragColor = vec4(slope/100.0 * 1.0, 0.0, 0.0, 1.0);
                    fragColor = avalancheColor(slope, zc);

                    // fragColor = vec4(vec3(zc / 3000.0), 1.0); // Normalize to 0–1 for 0–3000m
                }
        
            `;
  },
};

export default shaderLookup;
