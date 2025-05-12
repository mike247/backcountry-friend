import numpy as np
import matplotlib.pyplot as plt

# Generate synthetic elevation data (a hill-like structure)
x = np.linspace(-5, 5, 100)
y = np.linspace(-5, 5, 100)
X, Y = np.meshgrid(x, y)
Z = np.sin(np.sqrt(X**2 + Y**2))  # Example elevation data (radial hill)

# Calculate the gradient (steepness) of the elevation
dz_dx, dz_dy = np.gradient(Z, x[1] - x[0], y[1] - y[0])  # Gradients in x and y directions
gradient_magnitude = np.sqrt(dz_dx**2 + dz_dy**2)        # Magnitude of the gradient

# Plot the topographic contour map
plt.figure(figsize=(12, 6))

# Subplot 1: Contour map
plt.subplot(1, 2, 1)
contour = plt.contourf(X, Y, Z, cmap='terrain', levels=20)
plt.colorbar(contour, label="Elevation")
plt.title("Topographic Contour Map")
plt.xlabel("X")
plt.ylabel("Y")

# Subplot 2: Gradient magnitude
plt.subplot(1, 2, 2)
gradient = plt.contourf(X, Y, gradient_magnitude, cmap='viridis', levels=20)
plt.colorbar(gradient, label="Gradient Magnitude")
plt.title("Gradient of Elevation")
plt.xlabel("X")
plt.ylabel("Y")

plt.tight_layout()
plt.show()