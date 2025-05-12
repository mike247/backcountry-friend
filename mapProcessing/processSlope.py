import cv2
import numpy as np
from scipy.interpolate import griddata
import matplotlib.pyplot as plt

# Load the image
image_path = "/Users/michaelnorrie/Documents/projects/backcountry-friend/mapProcessing/mini.png"
image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

# Apply thresholding to isolate contour lines (adjust threshold values as needed)
_, th1 = cv2.threshold(image, 100, 255, cv2.THRESH_BINARY)
th2 = cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY,11,2)

# Find contours
contours, _ = cv2.findContours(th2, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Initialize arrays to hold points and elevations
points = []
elevations = []

images = [image, th1, th2]
 
for i in range(len(images)):
    plt.subplot(2,2,i+1),plt.imshow(images[i],'gray')
    plt.xticks([]),plt.yticks([])
plt.show()

output_path = "threshold.png"
plt.imsave(output_path, th2, cmap="viridis")

# Example: Assign elevations manually based on contour hierarchy (you can automate this)
elevation_step = 20  # Elevation difference between lines
for i, contour in enumerate(contours):
    for point in contour:
        x, y = point[0]
        points.append((x, y))
        elevations.append(i * elevation_step)  # Assign elevation


# Convert points and elevations to NumPy arrays
points = np.array(points)
elevations = np.array(elevations)

# Create a grid for interpolation
x = np.arange(0, image.shape[1])
y = np.arange(0, image.shape[0])
grid_x, grid_y = np.meshgrid(x, y)

# Interpolate elevation values
grid_elevation = griddata(points, elevations, (grid_x, grid_y), method="cubic")

# Compute gradients
dx, dy = np.gradient(grid_elevation)  # Derivatives in x and y directions

# Calculate slope (in degrees)
slope = np.arctan(np.sqrt(dx**2 + dy**2)) * (180 / np.pi)

# Normalize and display slope
slope_normalized = (slope - slope.min()) / (slope.max() - slope.min())

plt.imshow(slope_normalized, cmap="viridis")
plt.colorbar(label="Slope Angle (degrees)")
plt.title("Slope from Topographic Lines")
plt.show()

# Save the result
output_path = "slope_from_contours.png"
plt.imsave(output_path, slope_normalized, cmap="viridis")


