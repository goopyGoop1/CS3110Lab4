// CS3110 Lab 4 Task 1 
// This will creat a Triangles with the same texture for each and rotate on the X-Axis   

var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +  // Attribute variable to store vertex position
  'uniform mat4 u_ModelMatrix;\n' + // Uniform matrix for transformation
  'attribute vec2 a_TexCoord;\n' + // Attribute variable for texture coordinate
  'varying vec2 v_TexCoord;\n' +  // Varying variable to pass texture coordinates to fragment shader
  'void main() {\n' +
  '  gl_Position =u_ModelMatrix * a_Position;\n' +  // Calculate vertex position with model matrix
  '  v_TexCoord = a_TexCoord;\n' +  // Pass texture coordinates to fragment shader
  '}\n';

var FSHADER_SOURCE =
  'precision mediump float;\n'+  // Set precision for float values
  'uniform sampler2D u_Sampler;\n' +  // Uniform sampler for texture data
  'varying vec2 v_TexCoord;\n' +   // Varying variable for texture coordinates
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +  // Set pixel color using texture
  '}\n';



  var currentLevel = 0;  // Current subdivision level
  var rotationAngle = 0;  // Current rotation angle on the X-axis
  var rotating = false; // Animation state (rotating or not)
  var finalVertices = []; // Array to store vertices after subdivision

  /**
 * The main function that initializes the WebGL context, shaders, event listeners,
 * and starts the drawing process.
 */
  
  
  function main() {
    
    var canvas = document.getElementById('webgl');  // Retrieve <canvas> element
  
    
    var gl = getWebGLContext(canvas);   // Get the rendering context for WebGL
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
  
   
    
    gl.clearColor(0.0, 0.0, 0.0, 0.0);  // Specify the color for clearing <canvas>
  

    drawTriangle(gl, currentLevel);  // Initial triangle draw
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
        -0.9, -0.9, 0.1, 0.2,
        0.9, -0.9, 0.9, 0.2,
        0.0, 0.9, 0.5, 1.0
      ]);
    } else {
      var initialVertices = new Float32Array([
        -0.9, -0.9, 0.1, 0.2,
        0.9, -0.9, 0.9, 0.2,
        0.0, 0.9, 0.5, 1.0
      ]);
      breakDownTriangle(gl, initialVertices, level); // Recursive subdivision
      verticesTexCoords = new Float32Array(finalVertices); // Assign subdivided vertices
    }
    var n = verticesTexCoords.length / 4; // Calculate vertex count
  
    // Create the buffer object
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer); // Bind the buffer object to target
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);  // Populate buffer

  
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;// Size of a float


    //Get the storage location of a_Position, assign and enable buffer
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE *4 , 0);
    gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object
  
    // Get the storage location of a_TexCoord
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if (a_TexCoord < 0) {
      console.log('Failed to get the storage location of a_TexCoord');
      return -1;
    }
    // Assign the buffer object to a_TexCoord variable
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);  // Enable the assignment of the buffer object
  
    return n;
  }

/**
 * Draws the triangle based on the current level and rotation angle.
 * @param {Object} gl - WebGL context
 * @param {number} level - Subdivision level for the triangle
 */


  function drawTriangle(gl, level) {
    
     var n = initVertexBuffers(gl,level); // Initialize buffers based on subdivision level
     if (n < 0) {
       console.log('Failed to set the vertex information');
       return -1 ;
     }
       
    // Create a Matrix4 object for transformations
    var modelMatrix = new Matrix4();
    
    
    // Get the storage location of the 'u_ModelMatrix' uniform in the shader
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix'); 
    if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return -1;
          }
    
    
    gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas  
    
    modelMatrix.setIdentity(); // Set the identity matrix
    modelMatrix.rotate(rotationAngle, 1,0,0); // Rotate the model
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements); // Pass the model matrix to the vertex shader
      
     // Set texture
     if (!initTextures(gl, n)) {
      console.log('Failed to intialize the texture.');
      return -1 ;
    }
 
      gl.drawArrays(gl.TRIANGLES, 0, n); // Draw triangle
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
  
    rotationAngle = (rotationAngle + 2) % 360;   // Update rotation angle
    drawTriangle(gl, level);  // Redraw with updated rotation
  
    requestAnimationFrame(function () {
      animate(gl, level);  // Recursively call animate
    });
  }
  


/**
 * Initializes texture settings and loads the image.
 * @param {Object} gl - WebGL context
 * @returns {boolean} - True if texture was successfully initialized
 */

function initTextures(gl) {
    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
      console.log('Failed to create the texture object');
      return false;
    }
  
    // Get the storage location of u_Sampler
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    if (!u_Sampler) {
      console.log('Failed to get the storage location of u_Sampler');
      return false;
    }
    var image = new Image();  // Create the image object
    if (!image) {
      console.log('Failed to create the image object');
      return false;
    }
    // Register the event handler to be called on loading an image
    image.onload = function(){ loadTexture(gl, texture, u_Sampler, image); 
      drawTriangle(gl, currentLevel);  // this is here becasue it ensures the first triangle has the texture in it when the image is loaded
    };
    // Tell the browser to load an image
    image.src = '../resources/Ubaid2.jpg';
  
    return true;
  }

  
  /**
 * Adds vertices to the final array for rendering after subdivision.
 * @param {Array} vertices - Array of vertices to be added
 */
  function addVerticesToFinalArray(vertices) {
    finalVertices.push(...vertices);
  }

  function breakDownTriangle(gl, vertices, level) {
    if (level === 0) {
      addVerticesToFinalArray(vertices); // Base case
      return;
    }

 
     //Get the vertices of the triangle. 
      var x1 = vertices[0], y1 = vertices[1], s1 = vertices[2], t1 = vertices[3] ;
      var x2 = vertices[4], y2 = vertices[5], s2 = vertices[6], t2 = vertices[7] ;
      var x3 = vertices[8], y3 = vertices[9], s3 = vertices[10], t3 = vertices[11];
  
    //Calculate the midpoints of each side
    var x12 = (x1 + x2) / 2, y12 = (y1 + y2) / 2;
    var x23 = (x2 + x3) / 2, y23 = (y2 + y3) / 2;
    var x31 = (x3 + x1) / 2, y31 = (y3 + y1) / 2;


      
    
    //Create three new triangles keep the same s & t vertices so it will reprint the texture
    var triangle1 = [
        x1, y1, s1, t1, 
        x12, y12, s2, t2,  
        x31, y31, s3 , t3    
    ];
      
      
      
    var triangle2 = [
        x12, y12, s1, t1,  
        x2, y2, s2, t2, 
        x23, y23, s3, t3   
    ];
      
    var triangle3 = [
        x31, y31, s1, t1,  
        x23, y23, s2, t2,  //
        x3, y3, s3, t3
    ];


  
       // Recursively break down the new triangles
      breakDownTriangle(gl, triangle1, level - 1);
      breakDownTriangle(gl, triangle2,  level - 1);
      breakDownTriangle(gl, triangle3, level - 1);
  
}

  

/**
 * Loads the texture onto the GPU and sets texture parameters.
 * @param {Object} gl - WebGL context
 * @param {Object} texture - WebGL texture object
 * @param {Object} u_Sampler - Uniform sampler in fragment shader
 * @param {Object} image - Image object containing texture data
 */

  function loadTexture(gl,  texture, u_Sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis so it is right side up
  
    gl.activeTexture(gl.TEXTURE0);   // Enable texture unit0
    
    gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the texture object to the target
  
    // Set the texture parameters the image I'm using must be clamp_to_edge
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); 
    
    
    
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler, 0);
    

  }


