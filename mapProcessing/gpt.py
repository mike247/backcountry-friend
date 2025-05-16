import cv2
import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import griddata
from scipy.ndimage import gaussian_filter

# Step 1: Generate synthetic contour image or load one
image_path = "/Users/michaelnorrie/Documents/projects/backcountry-friend/mapProcessing/topo50/BE42_GeoTifv1-03.tif"
img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

# Step 2: Detect contours
# contours, _ = cv2.findContours(img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Apply thresholding to isolate contour lines (adjust threshold values as needed)
_, th1 = cv2.threshold(img, 100, 255, cv2.THRESH_BINARY)
th2 = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY,11, 2)

# Find contours
contours, hierarchy = cv2.findContours(th2, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Step 3: Assign elevation values to contours
elevation_map = np.zeros_like(img, dtype=np.float32)
for i, cnt in enumerate(sorted(contours, key=cv2.contourArea)):
    elevation = (i + 1) * 10  # increase with size
    cv2.drawContours(elevation_map, [cnt], -1, elevation, thickness=1)

# Step 4: Extract known (x, y, z) from contour lines
ys, xs = np.where(elevation_map > 0)
zs = elevation_map[ys, xs]

# Step 5: Interpolate to fill in unknown elevations
grid_x, grid_y = np.meshgrid(np.arange(img.shape[1]), np.arange(img.shape[0]))
heightmap = griddata((xs, ys), zs, (grid_x, grid_y), method='cubic', fill_value=0)

# Optional smoothing to reduce artifacts
heightmap_smooth = gaussian_filter(heightmap, sigma=2)

# Step 6: Compute gradient (slope)
dx = np.gradient(heightmap_smooth, axis=1)
dy = np.gradient(heightmap_smooth, axis=0)
slope = np.degrees(np.arctan(np.sqrt(dx**2 + dy**2)))

# Step 7: Normalize and color slope map
slope_norm = cv2.normalize(slope, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
colored_slope = cv2.applyColorMap(slope_norm, cv2.COLORMAP_JET)

# Show results
plt.figure(figsize=(15, 5))

plt.subplot(1, 3, 1)
plt.imshow(img, cmap='gray')
plt.title('Contour Lines')
plt.axis('off')

plt.subplot(1, 3, 2)
plt.imshow(heightmap_smooth, cmap='terrain')
plt.title('Interpolated Heightmap')
plt.axis('off')

plt.subplot(1, 3, 3)
plt.imshow(colored_slope)
plt.title('Slope Map (Degrees)')
plt.axis('off')

plt.tight_layout()
plt.show()