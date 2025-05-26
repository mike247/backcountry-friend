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
                }
        
            `;
  },
};

export default shaderLookup;
