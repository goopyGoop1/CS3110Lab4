// CS3110 Lab 4 Task 12
// This will creat a Triangles with the same texture for each and rotate on the X-Axis   

var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +                            // Declares an attribute variable for vertex positions, used by the vertex shader.
'uniform mat4 u_ModelMatrix;\n' +                           // Declares a uniform variable for the model transformation matrix.
'attribute vec2 a_TexCoord;\n' +                            // Declares an attribute for texture coordinates of the vertex.
'attribute float a_whichtex;\n' +                           // Declares an attribute to specify which texture to use.
'varying vec2 v_TexCoord;\n' +                              // Declares a varying variable to pass the texture coordinates to the fragment shader.
'varying float v_whichtex;\n' +                             // Declares a varying variable to pass the texture selection to the fragment shader.
'void main() {\n' +                                         // The main function of the vertex shader.
'  gl_Position = u_ModelMatrix * a_Position;\n' +           // Sets the position of the vertex by applying the transformation matrix to the position attribute.
'  v_TexCoord = a_TexCoord;\n' +                            // Passes the texture coordinates to the fragment shader.
'  v_whichtex = a_whichtex;\n' +                            // Passes the texture selection to the fragment shader.
'}\n'; 


// Fragment shader source code
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +                                            // Preprocessor directive to check if the code is running in a WebGL ES environment.
  'precision mediump float;\n' +                                // Sets the precision for floating-point operations to medium for compatibility.
  '#endif\n' +                                                  // End of the conditional preprocessor directive.
  'uniform sampler2D u_Sampler0;\n' +                           // Declares a uniform sampler for the first texture.
  'uniform sampler2D u_Sampler1;\n' +                           // Declares a uniform sampler for the second texture.
  'varying vec2 v_TexCoord;\n' +                                // Receives the interpolated texture coordinates from the vertex shader.
  'varying float v_whichtex;\n' +                               // Receives the texture selection value from the vertex shader.
  'void main() {\n' +                                           // The main function of the fragment shader.
  '  vec4 color0 = texture2D(u_Sampler0, v_TexCoord);\n' +      // Samples the color from the first texture using the provided texture coordinates.
  '  vec4 color1 = texture2D(u_Sampler1, v_TexCoord);\n' +      // Samples the color from the second texture using the provided texture coordinates.
  '  if (v_whichtex == 0.0)\n' +                                // Conditional check to decide which texture to use.
  '    gl_FragColor = color0;\n' +                              // Sets the fragment color to the sampled color from the first texture.
  '  else\n' +                                                  // If the condition is false, use the following code block.
  '    gl_FragColor = color1;\n' +                              // Sets the fragment color to the sampled color from the second texture.
  '}\n'; 


  var currentLevel = 0;  // Current subdivision level
  var rotationAngle = 0;  // Current rotation angle on the X-axis
  var rotating = false; // Animation state (rotating or not)
  var finalVertices = []; // Array to store vertices after subdivision
  
  
  function main() {
  
    var canvas = document.getElementById('webgl');  // Retrieve <canvas> element
  
    var gl = getWebGLContext(canvas);  // Get the rendering context for WebGL   
  
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
  
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;   
  
    }
  
    // Event listener for increasing subdivision level
    document.getElementById('levelUp').addEventListener('click', () => {
      currentLevel = Math.min(currentLevel + 1, 6); // Limit to 6 levels
      drawTriangle(gl, currentLevel);
    });
  
    // Event listener for decreasing subdivision level
    document.getElementById('levelDown').addEventListener('click', () => {
      currentLevel = Math.max(currentLevel - 1, 0);
      drawTriangle(gl, currentLevel);
    });
  
    // Event listener for toggling rotation  
    document.getElementById('rotate').addEventListener('click', () => {
      rotating = !rotating; // Toggle rotation state
      if (rotating) {
        animate(gl, currentLevel);  // Start the animation
      }
    });
  
  
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Specify the color for clearing <canvas>
  
  
    drawTriangle(gl, currentLevel);  // Draw the initial triangle
  }
  
/**
 * Initializes the vertex buffers for the triangle based on the given subdivision level.
 * It subdivides the initial triangle recursively if the level is greater than 0.
 * @param {Object} gl - WebGL context
 * @param {number} level - Subdivision level for the triangle
 * @returns {number} - Number of vertices to be drawn
 */


function initVertexBuffers(gl, level) {
    finalVertices = []; // Reset vertices array

    var verticesTexCoords;
    if (level === 0) {
        verticesTexCoords = new Float32Array([
            -0.9, -0.9, 0.1, 0.2, 0.0,  // Vertex 1 with texture 0
            0.9, -0.9, 0.9, 0.2, 0.0,   // Vertex 2 with texture 0
            0.0, 0.9, 0.5, 1.0, 0.0    // Vertex 3 with texture 0
        ]);
    } else {
        var initialVertices = new Float32Array([
            -0.9, -0.9, 0.1, 0.2, 0.0,  // Vertex 1
            0.9, -0.9, 0.9, 0.2, 0.0,   // Vertex 2
            0.0, 0.9, 0.5, 1.0, 0.0    // Vertex 3
        ]);
        breakDownTriangle(initialVertices, level); // Recursive subdivision
        verticesTexCoords = new Float32Array(finalVertices); // Assign subdivided vertices
    }

    // Assign which texture to use based on level for all vertices
    for (let i = 4; i < verticesTexCoords.length; i += 5) {
        verticesTexCoords[i] = (level % 2 === 0) ? 0.0 : 1.0; // Set whichtex for each vertex
    }

    var n = verticesTexCoords.length / 5; // 5 elements per vertex: x, y, s, t, whichtex

    // Create the buffer object
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    // Get the storage location of a_Position and assign
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_Position);

    // Get the storage location of a_TexCoord and assign
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    // Get the storage location of a_whichtex and assign
    var a_whichtex = gl.getAttribLocation(gl.program, 'a_whichtex');
    gl.vertexAttribPointer(a_whichtex, 1, gl.FLOAT, false, FSIZE * 5, FSIZE * 4);
    gl.enableVertexAttribArray(a_whichtex);

    return n;
}

/**
 * Draws the triangle based on the current level and rotation angle.
 * @param {Object} gl - WebGL context
 * @param {number} level - Subdivision level for the triangle
 */


function drawTriangle(gl, level) {
    var n = initVertexBuffers(gl, level); // Initialize buffers based on subdivision level
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return -1;
    }

    // Create a Matrix4 object for transformations
    var modelMatrix = new Matrix4();

    // Get the storage location of the 'u_ModelMatrix' uniform in the shader
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
      console.log('Failed to get the storage location of u_ModelMatrix');
      return -1;
    }

    // Alternate texture logic: Even levels use texture 0, odd levels use texture 1
    var whichTex = (level % 2 === 0) ? 0.0 : 1.0;
    var a_whichtex = gl.getAttribLocation(gl.program, 'a_whichtex');
    gl.vertexAttrib1f(a_whichtex, whichTex); // Set the attribute value

    gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas

    modelMatrix.setRotate(rotationAngle, 1, 0, 0); // Rotate the model
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements); // Pass the model matrix to the vertex shader

    // Initialize textures
    if (!initTextures(gl)) {
      console.log('Failed to intialize the textures.');
      return -1;
    }

    gl.drawArrays(gl.TRIANGLES, 0, n); // Draw the triangle
}

  /**
 * Animates the triangle by continuously updating the rotation angle and redrawing.
 * @param {Object} gl - WebGL context
 * @param {number} level - Subdivision level for the triangle
 */
  
  function animate(gl, level) {
    if (!rotating) {
      return;
    }
  
    rotationAngle = (rotationAngle + 2) % 360;  // Update rotation angle
    drawTriangle(gl, level);  // Redraw with updated rotation
  
    requestAnimationFrame(function () {
      animate(gl, level);  // Recursively call animate
    });
  }
  
  function addVerticesToFinalArray(vertices) {
    finalVertices.push(...vertices);
  }
  

  function breakDownTriangle(vertices, level) {
    if (level === 0) {
      addVerticesToFinalArray(vertices); // Base case
      return;
    }
  
    //Get the vertices of the triangle. 
    var x1 = vertices[0], y1 = vertices[1], s1 = vertices[2], t1 = vertices[3], w1 = vertices[4];
    var x2 = vertices[5], y2 = vertices[6], s2 = vertices[7], t2 = vertices[8], w2 = vertices[9];
    var x3 = vertices[10], y3 = vertices[11], s3 = vertices[12], t3 = vertices[13], w3 = vertices[14]; 
  
    //Calculate the midpoints of each side
    var x12 = (x1 + x2) / 2, y12 = (y1 + y2) / 2;
    var x23 = (x2 + x3) / 2, y23 = (y2 + y3) / 2;
    var x31 = (x3 + x1) / 2, y31 = (y3 + y1) / 2;
  
    //Create three new triangles, interpolating texture coordinates and whichTex
    var triangle1 = [
      x1, y1, s1, t1, w1,
      x12, y12, s2, t2, w1, 
      x31, y31, s3, t3, w1
    ];
  
    var triangle2 = [
      x12, y12, s1, t1, w2,
      x2, y2,  s2, t2, w2,
      x23, y23, s3, t3, w2
    ];
  
    var triangle3 = [
      x31, y31, s1, t1, w3,
      x23, y23, s2, t2, w3,
      x3, y3, s3, t3, w3
    ];
  
    // Recursively break down the new triangles
    breakDownTriangle(triangle1, level - 1);
    breakDownTriangle(triangle2, level - 1);
    breakDownTriangle(triangle3, level - 1);
  
  }
  
  function initTextures(gl) {
    var texture0 = gl.createTexture(); 
    var texture1 = gl.createTexture();
    if (!texture0 || !texture1) {
      console.log('Failed to create the texture object');
      return false;
    }
  
    var image0 = new Image();
    var image1 = new Image();
    if (!image0 || !image1) {
      console.log('Failed to create the image object');
      return false;
    }
  
    image0.onload = function(){ loadTexture(gl, texture0, 'u_Sampler0', image0, 0);
        drawTriangle(gl, currentLevel);  // this is here becasue it ensures the first triangle has the texture in it when the image is loaded
        // ^^^^^ if not included the first triangle will be not textured.      
      };
    image1.onload = function(){ loadTexture(gl, texture1, 'u_Sampler1', image1, 1); };
  
    image0.src = '../resources/Ubaid2.jpg'; 
    image1.src = '../resources/Ubaid.jpg'; 
  
    return true;
  }
  
  function loadTexture(gl, texture, samplerUniform, image, texUnit) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); 
  
    // Activate the correct texture unit
    gl.activeTexture(gl.TEXTURE0 + texUnit); 
  
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); 
  
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); 
  
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
    // Get the location of the sampler uniform and set it to the texture unit
    var u_Sampler = gl.getUniformLocation(gl.program, samplerUniform);
    gl.uniform1i(u_Sampler, texUnit); 
  }

