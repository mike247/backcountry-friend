const shaderLookup: {
  [key: string]: ({}: { [key: string]: number }) => string;
} = {
  gpuSlope: () => {
    return `#version 300 es
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
        
                    float slope = degrees(atan(sqrt(
                    pow(zx / custom.pixelSize.x, 2.0) + 
                    pow(zy / custom.pixelSize.y, 2.0)
                    )));
        
                    
                    fragColor = slopeColor(slope, zc);
                }
        
            `;
  },
};

export default shaderLookup;
