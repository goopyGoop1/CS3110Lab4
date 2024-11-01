

---

# CS3110 Lab 4 Chad: Interactive 3D Triangle Manipulation with WebGL

This project consists of two tasks that demonstrate the use of WebGL to create and manipulate 3D triangles with texture mapping and interactive features. The tasks are part of CS3110's Lab 4 assignment, showcasing texture application, rotation, and recursive subdivision of triangles.

## Overview
The project is divided into two main tasks:
1. **Lab 4 Task 1**: Implements a WebGL application that displays a textured triangle, which can be subdivided and rotated on the X-axis.
2. **Lab 4 Task 2**: Extends Task 1 by introducing dual-texture functionality, allowing alternating textures based on the level of subdivision.

## Technologies Used
- **WebGL**: For rendering graphics within an HTML5 canvas.
- **JavaScript**: To create and manage the WebGL context and handle user interactions.
- **HTML**: Provides the structure and basic layout.
- **Shader Language (GLSL)**: Used for vertex and fragment shaders to handle 3D transformations and texturing.

## Getting Started
1. Clone the repository to your local machine.
2. Ensure that all required library files (`webgl-utils.js`, `webgl-debug.js`, `cuon-utils.js`, `cuon-matrix.js`) are available in the `lib` directory.
3. Open `Lab 4 Task 1.html` or `Lab 4 Task 2.html` in a web browser that supports WebGL.

## Features
### Task 1
- **Textured Triangle**: Displays a triangle with a single texture.
- **Subdivision Control**: Allows recursive subdivision of the triangle up to 6 levels.
- **Rotation**: Rotates the triangle along the X-axis with interactive control.
- **Event Handlers**: Buttons for increasing/decreasing the subdivision level and toggling rotation.

### Task 2
- **Dual Texture Support**: Alternates between two textures based on the subdivision level.
- **Extended Functionality**: Similar to Task 1, with the addition of texture selection logic in shaders.

## How to Use
1. **Load the Application**: Open the corresponding HTML file (either `Lab 4 Task 1.html` or `Lab 4 Task 2.html`) in a web browser.
2. **Controls**:
   - Click **Level Up** to increase the subdivision level.
   - Click **Level Down** to decrease the subdivision level.
   - Click **Rotate** to start or stop the rotation of the triangle.

## Project Structure
- `Lab 4 Task 1.html` / `Lab 4 Task 2.html`: Entry points that include the WebGL canvas and controls.
- `Lab4Task1.js`: JavaScript file handling rendering, user interactions, and texture loading for Task 1.
- `Lab4Task2.js`: JavaScript file with similar functionality as Task 1, extended for dual-texture handling.
- `lib/`: Contains utility scripts required for WebGL operations.



---

Feel free to make further adjustments as needed!
