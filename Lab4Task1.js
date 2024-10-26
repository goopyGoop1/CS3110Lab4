// CS3110 Lab3 Task 3 
// This will creat a Triangles with the same texture for each and rotate on the X-Axis   


    var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'attribute vec2 a_TexCoord;\n' + 
  'varying vec2 v_TexCoord;\n' + 
  'void main() {\n' +
  '  gl_Position =u_ModelMatrix * a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' + 
  '}\n';

var FSHADER_SOURCE =
  'precision mediump float;\n'+
  'uniform sampler2D u_Sampler;\n' + 
  'varying vec2 v_TexCoord;\n' + 
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' + 
  '}\n';



  var currentLevel = 0;
  var rotationAngle = 0;  // Store the current rotation angle
  var rotating = false;  //// Flag to control animation state
  var finalVertices = [];

  function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');
  
    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
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
  
   
    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
  

    drawTriangle(gl, currentLevel);
  }
  
  function initVertexBuffers(gl, level) {
    finalVertices = [];
    
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
      breakDownTriangle(gl, initialVertices, level);
      verticesTexCoords = new Float32Array(finalVertices);
    }
    var n = verticesTexCoords.length / 4;
  
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


  function drawTriangle(gl, level) {
     // Set the vertex information
     var n = initVertexBuffers(gl,level);
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
 
      gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  function animate(gl, level) {
    if (!rotating) {
      return;
    }
  
    rotationAngle = (rotationAngle + 2) % 360;
    drawTriangle(gl, level);
  
    requestAnimationFrame(function () {
      animate(gl, level);
    });
  }
  
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
      drawTriangle(gl, currentLevel); 
    };
    // Tell the browser to load an image
    image.src = '../resources/Ubaid2.jpg';
  
    return true;
  }

  function addVerticesToFinalArray(vertices) {
    finalVertices.push(...vertices);
  }

  function breakDownTriangle(gl, vertices, level) {
    if (level === 0) {
      addVerticesToFinalArray(vertices);
      return;
    }

 
     //Get the vertices of the triangle. From the base case  
      var x1 = vertices[0], y1 = vertices[1], s1 = vertices[2], t1 = vertices[3] ;
      var x2 = vertices[4], y2 = vertices[5], s2 = vertices[6], t2 = vertices[7] ;
      var x3 = vertices[8], y3 = vertices[9], s3 = vertices[10], t3 = vertices[11];
  
    //Calculate the midpoints of each side
    var x12 = (x1 + x2) / 2, y12 = (y1 + y2) / 2;
    var x23 = (x2 + x3) / 2, y23 = (y2 + y3) / 2;
    var x31 = (x3 + x1) / 2, y31 = (y3 + y1) / 2;


      
    
    //Create three new triangles
      //Create new triangles with CORRECT texture coordinates
    var triangle1 = [
        x1, y1, s1, t1, 
        x12, y12, s2, t2,  // Interpolate texture coords
        x31, y31, s3 , t3    // Interpolate texture coords
    ];
      
      
      
    var triangle2 = [
        x12, y12, s1, t1,  // Interpolate texture coords
        x2, y2, s2, t2, 
        x23, y23, s3, t3   // Interpolate texture coords
    ];
      
    var triangle3 = [
        x31, y31, s1, t1,  // Interpolate texture coords
        x23, y23, s2, t2,  // Interpolate texture coords
        x3, y3, s3, t3
    ];


  
       // Recursively break down the new triangles
      breakDownTriangle(gl, triangle1, level - 1);
      breakDownTriangle(gl, triangle2,  level - 1);
      breakDownTriangle(gl, triangle3, level - 1);
  
}

  
  function loadTexture(gl,  texture, u_Sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); 
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler, 0);
    

  }

