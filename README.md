# Lab 4 Task 1 - WebGL Triangle Rotation and Subdivision

This project uses WebGL to render a textured triangle that can be subdivided into smaller triangles, with each level of subdivision applying the same texture to every triangle. The triangles rotate along the X-axis, providing an interactive 3D experience.

## Features

- **Subdivision Levels**: Increase or decrease the triangle subdivision level (up to level 6) to create more detailed shapes.
- **Texture Mapping**: Apply a single texture across all triangles.
- **Rotation**: Rotate the triangles on the X-axis.
- **Animation**: Toggle rotation on or off.

## Setup Instructions

1. Ensure you have a browser that supports WebGL.
2. Clone or download this project.
3. Open `Lab 4 Task 1.html` in your browser to see the triangle display and interact with it.

## Controls

- **Level Up**: Increases the subdivision level of the triangle.
- **Level Down**: Decreases the subdivision level.
- **Rotate**: Toggles the rotation on or off.

## Code Overview

The project consists of HTML and JavaScript files:

### HTML (`Lab 4 Task 1.html`)

The HTML file sets up the WebGL canvas and buttons. It links necessary JavaScript files for WebGL utilities, matrix transformations, and the main `Lab4Task1.js` file, which contains the WebGL code.

### JavaScript (`Lab4Task1.js`)

The main JavaScript file handles WebGL context creation, shader initialization, and the logic for rendering, subdividing, and animating triangles.

#### Key Functions

- **`main`**: Initializes WebGL context, shaders, event listeners, and starts rendering the triangle.
- **`initVertexBuffers`**: Sets up vertex buffers and subdivides triangles based on the current level.
- **`drawTriangle`**: Draws the triangle with transformations and applies rotation and textures.
- **`animate`**: Controls continuous rotation by updating the rotation angle and redrawing the triangle.
- **`initTextures`**: Loads texture image and prepares it for rendering.
- **`breakDownTriangle`**: Recursively subdivides a triangle into smaller triangles.
- **`loadTexture`**: Loads the texture onto the GPU and sets texture parameters.

## Dependencies

The following utility files are included for WebGL and matrix operations:

- `webgl-utils.js`
- `webgl-debug.js`
- `cuon-utils.js`
- `cuon-matrix.js`

Ensure these files are located in the correct directory as referenced in the HTML file.

## How It Works

1. The `main` function initializes the WebGL context and shaders, then draws an initial triangle.
2. Subdivision and rotation controls are attached to buttons to allow real-time interactivity.
3. The `drawTriangle` function applies transformations and textures to create a dynamic visual effect on the WebGL canvas.

## Notes

- **Texture**: The texture file `Ubaid2.jpg` should be located in the `../resources/` directory relative to the HTML file.
- **Compatibility**: Tested on WebGL-compatible browsers. If issues occur, ensure that WebGL is enabled in your browser settings.

Enjoy experimenting with levels, textures, and animations!
