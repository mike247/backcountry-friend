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
        
                    float slope = calculateSlope(zx, zy, custom.pixelSize);

                    fragColor = vec4(slope/100.0 * 1.0, 0.0, 0.0, 1.0);
                    fragColor = slopeColor(slope, zc);

                        // Normalize elevation to 0.0 - 1.0 for grayscale output
                    // float minElevation = 0.0;
                    // float maxElevation = 4000.0;

                    // float normalized = clamp((zc - minElevation) / (maxElevation - minElevation), 0.0, 1.0);

                    // Output as grayscale
                    // fragColor = vec4(vec3(normalized), 1.0);

                    // fragColor = vec4((zx * 1.0), 0.0, 0.0, 1.0);

                    // vec3 rgb = texture(bitmapTexture, vTexCoord + vec2(dx, 0.0)).rgb;
                    // fragColor = vec4(zc  / 2700.0 * 1.0, 0.0, 0.0, 1.0); // visualize the raw RGB

                    // float tl = decodeElevation(texture(bitmapTexture, vTexCoord + dx * vec2(-1, -1)).rgb);
                    // float t  = decodeElevation(texture(bitmapTexture, vTexCoord + dx * vec2( 0, -1)).rgb);
                    // float tr = decodeElevation(texture(bitmapTexture, vTexCoord + dx * vec2( 1, -1)).rgb);

                    // float l  = decodeElevation(texture(bitmapTexture, vTexCoord + dx * vec2(-1,  0)).rgb);
                    // float c  = decodeElevation(texture(bitmapTexture, vTexCoord).rgb);
                    // float r  = decodeElevation(texture(bitmapTexture, vTexCoord + dx * vec2( 1,  0)).rgb);

                    // float bl = decodeElevation(texture(bitmapTexture, vTexCoord + dx * vec2(-1,  1)).rgb);
                    // float b  = decodeElevation(texture(bitmapTexture, vTexCoord + dx * vec2( 0,  1)).rgb);
                    // float br = decodeElevation(texture(bitmapTexture, vTexCoord + dx * vec2( 1,  1)).rgb);

                    // // Apply Sobel kernel to compute dz/dx and dz/dy
                    // float dzdx = (tr + 2.0 * r + br - tl - 2.0 * l - bl) / (8.0 * custom.pixelSize.x);
                    // float dzdy = (bl + 2.0 * b + br - tl - 2.0 * t - tr) / (8.0 * custom.pixelSize.y);

                    // // Final slope calculation
                    // float slope2 = degrees(atan(sqrt(dzdx * dzdx + dzdy * dzdy)));

                    // fragColor =  vec4(abs(dzdx) * 1.0, abs(dzdy) * 1.0, 0.0, 1.0);
                }
        
            `;
  },
};

export default shaderLookup;
