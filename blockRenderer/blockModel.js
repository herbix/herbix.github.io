
function Model() {
	if(!this || this == window) {
		return new Model();
	}

	this.polyhedrons = [
		{
			"texture" : 0,
			"vertexes" : [],
			"normals" : [0, 1, 0],
			"textureCoords" : [],
			"triangles" : []
		},
		{
			"texture" : 1,
			"vertexes" : [],
			"normals" : [-1, 0, 0],
			"textureCoords" : [],
			"triangles" : []
		},
		{
			"texture" : 2,
			"vertexes" : [],
			"normals" : [0, 0, 1],
			"textureCoords" : [],
			"triangles" : []
		}
	];
	
	this.textures = [];
}

Model.prototype = {
	constructor : Model,
	toString : function() {
		return "[object Model]";
	}
};

Model.prototype.addCube = function(xmin, ymin, zmin, xmax, ymax, zmax) {
	var xn = xmin * 16 - 8;
	var yn = ymin * 16;
	var zn = zmin * 16 - 8;
	var xx = xmax * 16 - 8;
	var yx = ymax * 16;
	var zx = zmax * 16 - 8;
	var v, t;
	
	v = this.polyhedrons[0].vertexes.push(xn, yx, zx, xx, yx, zx, xx, yx, zn, xn, yx, zn) / 3 - 4;
	t = this.polyhedrons[0].textureCoords.push(zmin, xmin, zmax, xmin, zmax, xmax, zmin, xmax) / 2 - 4;
	this.polyhedrons[0].triangles.push(
		{ "vertexes" : [v+0, v+1, v+3], "normals" : [0, 0, 0], "textureCoords" : [t+1, t+2, t+0] },
		{ "vertexes" : [v+3, v+1, v+2], "normals" : [0, 0, 0], "textureCoords" : [t+0, t+2, t+3] }
	);

	v = this.polyhedrons[1].vertexes.push(xn, yx, zn, xn, yn, zn, xn, yn, zx, xn, yx, zx) / 3 - 4;
	t = this.polyhedrons[1].textureCoords.push(zmin, ymax, zmin, ymin, zmax, ymin, zmax, ymax) / 2 - 4;
	this.polyhedrons[1].triangles.push(
		{ "vertexes" : [v+0, v+1, v+3], "normals" : [0, 0, 0], "textureCoords" : [t+0, t+1, t+3] },
		{ "vertexes" : [v+3, v+1, v+2], "normals" : [0, 0, 0], "textureCoords" : [t+3, t+1, t+2] }
	);

	v = this.polyhedrons[2].vertexes.push(xn, yx, zx, xn, yn, zx, xx, yn, zx, xx, yx, zx) / 3 - 4;
	t = this.polyhedrons[2].textureCoords.push(xmin, ymax, xmin, ymin, xmax, ymin, xmax, ymax) / 2 - 4;
	this.polyhedrons[2].triangles.push(
		{ "vertexes" : [v+0, v+1, v+3], "normals" : [0, 0, 0], "textureCoords" : [t+0, t+1, t+3] },
		{ "vertexes" : [v+3, v+1, v+2], "normals" : [0, 0, 0], "textureCoords" : [t+3, t+1, t+2] }
	);
}

Model.prototype.addPlane = function(texture, x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, u1, v1, u2, v2, u3, v3, u4, v4) {
	var i = texture;
	var v, t, n;

	v = this.polyhedrons[i].vertexes.push(x1*16-8, y1*16, z1*16-8, x2*16-8, y2*16, z2*16-8, x3*16-8, y3*16, z3*16-8, x4*16-8, y4*16, z4*16-8) / 3 - 4;
	t = this.polyhedrons[i].textureCoords.push(u1, 1-v1, u2, 1-v2, u3, 1-v3, u4, 1-v4) / 2 - 4;

	x2 -= x1; y2 -= y1; z2 -= z1;
	x3 -= x1; y3 -= y1; z3 -= z1;
	x4 -= x1; y4 -= y1; z4 -= z1;

	n = this.polyhedrons[i].normals.push(y2*z3-y3*z2, z2*x3-z3*x2, x2*y3-x3*y2) / 3 - 1;
	n = this.polyhedrons[i].normals.push(y3*z4-y4*z3, z3*x4-z4*x3, x3*y4-x4*y3) / 3 - 2;

	this.polyhedrons[i].normals.push() / 3;
	this.polyhedrons[i].triangles.push(
		{ "vertexes" : [v+0, v+1, v+2], "normals" : [n+0, n+0, n+0], "textureCoords" : [t+0, t+1, t+2] },
		{ "vertexes" : [v+0, v+2, v+3], "normals" : [n+1, n+1, n+1], "textureCoords" : [t+0, t+2, t+3] }
	);
}

var defaultTextures = [
	{
		"image" : "presets/bedrock.png",
		"type" : "solid",
		"minFilter" : "nearest",
		"magFilter" : "nearest"
	},
	{
		"image" : "presets/bedrock.png",
		"type" : "solid",
		"minFilter" : "nearest",
		"magFilter" : "nearest"
	},
	{
		"image" : "presets/bedrock.png",
		"type" : "solid",
		"minFilter" : "nearest",
		"magFilter" : "nearest"
	}
];

var models = (function() {

	var cube = new Model();
	cube.addCube(0, 0, 0, 1, 1, 1);

	var slab = new Model();
	slab.addCube(0, 0, 0, 1, 0.5, 1);

	var stairs = new Model();
	stairs.addCube(0, 0, 0, 1, 0.5, 1);
	stairs.addCube(0.5, 0.5, 0, 1, 1, 1);
	
	var anvil = new Model();
	anvil.addCube(0.125, 0, 0.125, 0.875, 0.25, 0.875);
	anvil.addCube(3/16, 0.25, 4/16, 13/16, 5/16, 12/16);
	anvil.addCube(4/16, 5/16, 6/16, 12/16, 10/16, 10/16);
	anvil.addCube(0, 10/16, 3/16, 1, 1, 13/16);
	
	var cross = new Model();
	cross.addPlane(0, 0.5, 1, 0.5, 0.5, 0, 0.5, 1.207, 0, 0.5, 1.207, 1, 0.5, 0.5, 0, 0.5, 1, 1, 1, 1, 0);
	cross.addPlane(0, 0.5, 1, -0.207, 0.5, 0, -0.207, 0.5, 0, 1.207, 0.5, 1, 1.207, 0, 0, 0, 1, 1, 1, 1, 0);
	cross.addPlane(0, -0.207, 1, 0.5, -0.207, 0, 0.5, 0.5, 0, 0.5, 0.5, 1, 0.5, 0, 0, 0, 1, 0.5, 1, 0.5, 0);
	
	var crop = new Model();
	crop.addPlane(0, 0.25, 1, 0, 0.25, 0, 0, 0.25, 0, 0.25, 0.25, 1, 0.25, 0, 0, 0, 1, 0.25, 1, 0.25, 0);
	crop.addPlane(0, 0.75, 1, 0, 0.75, 0, 0, 0.75, 0, 0.25, 0.75, 1, 0.25, 0, 0, 0, 1, 0.25, 1, 0.25, 0);
	crop.addPlane(0, 0, 1, 0.25, 0, 0, 0.25, 1, 0, 0.25, 1, 1, 0.25, 0, 0, 0, 1, 1, 1, 1, 0);
	crop.addPlane(0, 0.25, 1, 0.25, 0.25, 0, 0.25, 0.25, 0, 0.75, 0.25, 1, 0.75, 0.25, 0, 0.25, 1, 0.75, 1, 0.75, 0);
	crop.addPlane(0, 0.75, 1, 0.25, 0.75, 0, 0.25, 0.75, 0, 0.75, 0.75, 1, 0.75, 0.25, 0, 0.25, 1, 0.75, 1, 0.75, 0);
	crop.addPlane(0, 0, 1, 0.75, 0, 0, 0.75, 1, 0, 0.75, 1, 1, 0.75, 0, 0, 0, 1, 1, 1, 1, 0);
	crop.addPlane(0, 0.25, 1, 0.75, 0.25, 0, 0.75, 0.25, 0, 1, 0.25, 1, 1, 0.75, 0, 0.75, 1, 1, 1, 1, 0);
	crop.addPlane(0, 0.75, 1, 0.75, 0.75, 0, 0.75, 0.75, 0, 1, 0.75, 1, 1, 0.75, 0, 0.75, 1, 1, 1, 1, 0);
	
	var waterLily = new Model();
	waterLily.addPlane(0, 0, 1/16, 0, 0, 1/16, 1, 1, 1/16, 1, 1, 1/16, 0, 0, 0, 0, 1, 1, 1, 1, 0);
	
	return {
		"cube" : cube,
		"slab" : slab,
		"stairs" : stairs,
		"cross" : cross,
		"crop" : crop,
		"waterLily" : waterLily,
		"anvil" : anvil
	};

})();

