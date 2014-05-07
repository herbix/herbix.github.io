var block = {
	"textures" : [
		{
			"image" : "top.png",
			"type" : "solid",
			"minFilter" : "nearest",
			"magFilter" : "nearest"
		},
		{
			"image" : "front.png",
			"type" : "solid",
			"minFilter" : "nearest",
			"magFilter" : "nearest"
		},
		{
			"image" : "side.png",
			"type" : "solid",
			"minFilter" : "nearest",
			"magFilter" : "nearest"
		},
		{
			"image" : "bottom.png",
			"type" : "solid",
			"minFilter" : "nearest",
			"magFilter" : "nearest"
		}
	],
	"polyhedrons" : [
		{
			"texture" : 0,
			"vertexes" : [
				-8, 16, 8,
				8, 16, 8,
				8, 16, -8,
				-8, 16, -8
			],
			"normals" : [
				0, 1, 0
			],
			"textureCoords" : [
				0, 0,
				1, 0,
				1, 1,
				0, 1
			],
			"triangles" : [
				{ "vertexes" : [0, 1, 3], "normals" : [0, 0, 0], "textureCoords" : [0, 1, 3] },
				{ "vertexes" : [3, 1, 2], "normals" : [0, 0, 0], "textureCoords" : [3, 1, 2] }
			]
		},
		{
			"texture" : 1,
			"vertexes" : [
				-8, 16, 8,
				-8, 0, 8,
				8, 0, 8,
				8, 16, 8,
				8, 16, -8,
				8, 0, -8,
				-8, 0, -8,
				-8, 16, -8
			],
			"normals" : [
				0, 0, 1,
				0, 0, -1,
			],
			"textureCoords" : [
				0, 1,
				0, 0,
				1, 0,
				1, 1
			],
			"triangles" : [
				{ "vertexes" : [0, 1, 3], "normals" : [0, 0, 0], "textureCoords" : [0, 1, 3] },
				{ "vertexes" : [3, 1, 2], "normals" : [0, 0, 0], "textureCoords" : [3, 1, 2] },
				{ "vertexes" : [4, 5, 7], "normals" : [1, 1, 1], "textureCoords" : [0, 1, 3] },
				{ "vertexes" : [7, 5, 6], "normals" : [1, 1, 1], "textureCoords" : [3, 1, 2] }
			]
		},
		{
			"texture" : 2,
			"vertexes" : [
				8, 16, 8,
				8, 0, 8,
				8, 0, -8,
				8, 16, -8,
				-8, 16, -8,
				-8, 0, -8,
				-8, 0, 8,
				-8, 16, 8
			],
			"normals" : [
				1, 0, 0,
				-1, 0, 0,
			],
			"textureCoords" : [
				0, 1,
				0, 0,
				1, 0,
				1, 1
			],
			"triangles" : [
				{ "vertexes" : [0, 1, 3], "normals" : [0, 0, 0], "textureCoords" : [0, 1, 3] },
				{ "vertexes" : [3, 1, 2], "normals" : [0, 0, 0], "textureCoords" : [3, 1, 2] },
				{ "vertexes" : [4, 5, 7], "normals" : [1, 1, 1], "textureCoords" : [0, 1, 3] },
				{ "vertexes" : [7, 5, 6], "normals" : [1, 1, 1], "textureCoords" : [3, 1, 2] }
			]
		},
		{
			"texture" : 3,
			"vertexes" : [
				-8, 0, -8,
				8, 0, -8,
				8, 0, 8,
				-8, 0, 8
			],
			"normals" : [
				0, -1, 0
			],
			"textureCoords" : [
				0, 0,
				1, 0,
				1, 1,
				0, 1
			],
			"triangles" : [
				{ "vertexes" : [0, 1, 3], "normals" : [0, 0, 0], "textureCoords" : [0, 1, 3] },
				{ "vertexes" : [3, 1, 2], "normals" : [0, 0, 0], "textureCoords" : [3, 1, 2] }
			]
		}
	]
};