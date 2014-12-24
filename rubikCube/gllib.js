
function loadGl(id) {
	var c = $('#' + id).get(0);
	var gl = c.getContext('webgl') || c.getContext("experimental-webgl");

	gl.textureFilters = {
		"nearest" : gl.NEAREST,
		"linear" : gl.LINEAR,
		"mipmaps" : gl.LINEAR_MIPMAP_NEAREST
	};

	return gl;
}

function loadShader(gl, vsh, fsh, callback) {
	var shaderProgram = gl.createProgram();
	shaderProgram.vshLoad = false;
	shaderProgram.fshLoad = false;

	var shader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(shader, $(vsh).text());
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("vsh:" + gl.getShaderInfoLog(shader));
	}
	
	gl.attachShader(shaderProgram, shader);

	shader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(shader, $(fsh).text());
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("fsh:" + gl.getShaderInfoLog(shader));
	}

	gl.attachShader(shaderProgram, shader);

	callback(shaderProgram);
}

function loadModel(gl, model, callback) {
	var loadedModel = { "textures" : [], "polyhedrons" : [] };
	var textureLoaded = (1 << model.textures.length) - 1;
	
	if(model.textures.length >= 32) {
		throw "cannot use more than 32 textures";
	}
	
	for(var i=0; i<model.polyhedrons.length; i++) {
		var polyhedron = model.polyhedrons[i];
		loadPolyhedron(gl, polyhedron, function(po) {
			loadedModel.polyhedrons[i] = po;
		});
	}
	
	for(var i=0; i<model.textures.length; i++) {
		(function(i) {
			loadTexture(gl, model.textures[i], function(tx) {
				loadedModel.textures[i] = tx;
				textureLoaded &= ~(1 << i);
				if(textureLoaded == 0) {
					callback(loadedModel);
				}
			});
		})(i);
	}
	
	if(textureLoaded == 0) {
		callback(loadedModel);
	}
}

function loadPolyhedron(gl, polyhedron, callback) {
	var newPolyhedron = {};
	
	newPolyhedron.texture = polyhedron.texture;
	newPolyhedron.vertexArray = [];
	newPolyhedron.normalArray = [];
	newPolyhedron.textureCoordArray = [];
	newPolyhedron.vertexCount = polyhedron.triangles.length * 3;
	
	for(var j=0; j<polyhedron.triangles.length; j++) {
		var triangle = polyhedron.triangles[j];
		for(var k=0; k<3; k++) {
			for(var l=0; l<3; l++) {
				newPolyhedron.vertexArray[j*9 + k*3+l] = polyhedron.vertexes[triangle.vertexes[k]*3+l];
				newPolyhedron.normalArray[j*9 + k*3+l] = polyhedron.normals[triangle.normals[k]*3+l];
			}
			for(var l=0; l<2; l++) {
				newPolyhedron.textureCoordArray[j*6 + k*2+l] = polyhedron.textureCoords[triangle.textureCoords[k]*2+l];
			}
		}
	}
	
	newPolyhedron.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, newPolyhedron.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newPolyhedron.vertexArray), gl.STATIC_DRAW);
	
	newPolyhedron.normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, newPolyhedron.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newPolyhedron.normalArray), gl.STATIC_DRAW);
	
	newPolyhedron.textureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, newPolyhedron.textureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newPolyhedron.textureCoordArray), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	callback(newPolyhedron);
}

function loadTexture(gl, texture, callback) {
	var tx = gl.createTexture();
	tx.image = new Image();
	tx.image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, tx);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tx.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.textureFilters[texture.magFilter]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.textureFilters[texture.minFilter]);
		gl.bindTexture(gl.TEXTURE_2D, null);
		callback(tx);
	}
	tx.image.src = texture.image;
}

function drawModel(gl, model, attributes) {
	for(var i=0; i<model.polyhedrons.length; i++) {
		var polyhedron = model.polyhedrons[i];
		drawPolyhedron(gl, model.textures[polyhedron.texture], polyhedron, attributes);
	}
}

function drawPolyhedron(gl, texture, polyhedron, attributes) {
	if(attributes.texture !== undefined) {
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.uniform1i(attributes.texture, 0);
	}
	
	if(attributes.position !== undefined) {
		gl.enableVertexAttribArray(attributes.position);
		gl.bindBuffer(gl.ARRAY_BUFFER, polyhedron.vertexBuffer);
		gl.vertexAttribPointer(attributes.position, 3, gl.FLOAT, false, 0, 0);
	}
	
	if(attributes.normal !== undefined) {
		gl.enableVertexAttribArray(attributes.normal);
		gl.bindBuffer(gl.ARRAY_BUFFER, polyhedron.normalBuffer);
		gl.vertexAttribPointer(attributes.normal, 3, gl.FLOAT, false, 0, 0);
	}
	
	if(attributes.textureCoord !== undefined) {
		gl.enableVertexAttribArray(attributes.textureCoord);
		gl.bindBuffer(gl.ARRAY_BUFFER, polyhedron.textureCoordBuffer);
		gl.vertexAttribPointer(attributes.textureCoord, 2, gl.FLOAT, false, 0, 0);
	}

	if(attributes.otherActions)
		attributes.otherActions(gl, texture, polyhedron);
	
	gl.drawArrays(gl.TRIANGLES, 0, polyhedron.vertexCount);

	if(attributes.position !== undefined)
		gl.disableVertexAttribArray(attributes.position);

	if(attributes.normal !== undefined)
		gl.disableVertexAttribArray(attributes.normal);

	if(attributes.textureCoord !== undefined)
		gl.disableVertexAttribArray(attributes.textureCoord);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
