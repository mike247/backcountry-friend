import cv2
import numpy as np
from scipy.interpolate import griddata
import matplotlib.pyplot as plt
import math

# Load the image
image_path = "/Users/michaelnorrie/Documents/projects/backcountry-friend/mapProcessing/topo50/BE42_GeoTifv1-03.tif"
image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
blank = np.zeros_like(image)


# Apply thresholding to isolate contour lines (adjust threshold values as needed)
_, th1 = cv2.threshold(image, 100, 255, cv2.THRESH_BINARY)
th2 = cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY,11, 2)

# Find contours
contours, hierarchy = cv2.findContours(th2, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
contourImage = cv2.drawContours(blank.copy(), contours, -1, color=255, thickness=1)

# Initialize arrays to hold points and elevations
points = []
elevations = []

images = [image, th2, contourImage ]

 
for i in range(len(images)):
    plt.subplot(1,3,i+1),plt.imshow(images[i])
    plt.xticks([]),plt.yticks([])
plt.show()

heightmap = np.zeros_like(th2, dtype=np.float32)
elevation_step = 20
for i, cnt in enumerate(sorted(contours, key=cv2.contourArea, reverse=True)):
    elevation = (i + 1) * elevation_step
    cv2.drawContours(heightmap, [cnt], -1, elevation, thickness=1)

# Step 4: Interpolate missing values to create a smooth elevation surface
# Use inpainting or distance-weighted interpolation
mask = (heightmap == 0).astype(np.uint8)
heightmap_inpaint = cv2.inpaint(heightmap.astype(np.uint8), mask, 3, cv2.INPAINT_TELEA)

# Step 5: Compute gradients (slopes)
dx = cv2.Sobel(heightmap_inpaint, cv2.CV_32F, 1, 0, ksize=3)
dy = cv2.Sobel(heightmap_inpaint, cv2.CV_32F, 0, 1, ksize=3)
slope_radians = np.arctan(np.sqrt(dx**2 + dy**2))
slope_degrees = np.degrees(slope_radians)


# Step 6: Normalize and color the slope map
slope_norm = cv2.normalize(slope_degrees, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
colored_slope = cv2.applyColorMap(slope_norm, cv2.COLORMAP_JET)

# Step 7: Show results
plt.figure(figsize=(15, 5))

plt.subplot(1, 3, 1)
plt.imshow(image, cmap='gray')
plt.title('Original Contour Map')
plt.axis('off')

plt.subplot(1, 3, 2)
plt.imshow(heightmap_inpaint, cmap='terrain')
plt.title('Interpolated Heightmap')
plt.axis('off')

plt.subplot(1, 3, 3)
plt.imshow(colored_slope)
plt.title('Slope Heatmap (degrees)')
plt.axis('off')

plt.tight_layout()
plt.show()


# # Example: Assign elevations manually based on contour hierarchy (you can automate this)
# elevation_step = 20  # Elevation difference between lines
# for i, contour in enumerate(contours):
#     for point in contour:
#         x, y = point[0]
#         points.append((x, y))
#         elevations.append(i * elevation_step)  # Assign elevation


# # Convert points and elevations to NumPy arrays
# points = np.array(points)
# elevations = np.array(elevations)

# # Create a grid for interpolation
# x = np.arange(0, image.shape[1])
# y = np.arange(0, image.shape[0])
# grid_x, grid_y = np.meshgrid(x, y)

# # Interpolate elevation values
# grid_elevation = griddata(points, elevations, (grid_x, grid_y), method="cubic")

# # Compute gradients
# dx, dy = np.gradient(grid_elevation)  # Derivatives in x and y directions

# # Calculate slope (in degrees)
# slope = np.arctan(np.sqrt(dx**2 + dy**2)) * (180 / np.pi)

# # Normalize and display slope
# slope_normalized = (slope - slope.min()) / (slope.max() - slope.min())

# plt.imshow(slope_normalized, cmap="viridis")
# plt.colorbar(label="Slope Angle (degrees)")
# plt.title("Slope from Topographic Lines")
# plt.show()

# # Save the result
# output_path = "slope_from_contours.png"
# plt.imsave(output_path, slope_normalized, cmap="viridis")


