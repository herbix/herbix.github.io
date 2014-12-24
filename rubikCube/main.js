var gl;
var cubecolor = [
	{r:1, g:1, b:0},
	{r:1, g:1, b:1},
	{r:0.3, g:0.3, b:1},
	{r:0, g:0.6, b:0},
	{r:1, g:0, b:0},
	{r:1, g:0.5, b:0},
	{r:0, g:0, b:0}
];
var faceMap = [
	rubik.B_FACE,
	rubik.L_FACE,
	rubik.F_FACE,
	rubik.R_FACE,
	rubik.U_FACE,
	rubik.D_FACE
];
var facePos = [
	[ 2,  3, -1, -1, -1,  3],
	[ 3, -1, -1,  2, -1,  2],
	[-1,  2,  3, -1, -1,  0],
	[-1, -1,  2,  3, -1,  1],
	[ 1,  0, -1, -1,  0, -1],
	[ 0, -1, -1,  1,  1, -1],
	[-1,  1,  0, -1,  3, -1],
	[-1, -1,  1,  0,  2, -1]
];

function load() {
	gl = loadGl('canvas');

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);
	
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
	
	var done = 0;

	loadShader(gl, "#drawv", "#drawf", function(sp) {
		gl.dsp = sp;

		gl.linkProgram(sp);
		if (!gl.getProgramParameter(sp, gl.LINK_STATUS)) {
			alert("Could not link shaders: \n" + gl.getProgramInfoLog(sp));
			return;
		}
		
		sp.position = gl.getAttribLocation(sp, "position");
		sp.textureCoord = gl.getAttribLocation(sp, "textureCoord");
		sp.normal = gl.getAttribLocation(sp, "normal");
		
		sp.tMatrix = gl.getUniformLocation(sp, "tMatrix");
		sp.pMatrix = gl.getUniformLocation(sp, "pMatrix");
		sp.texture = gl.getUniformLocation(sp, "texture");
		sp.highlightTexture = gl.getUniformLocation(sp, "highlightTexture");
		sp.backColor = gl.getUniformLocation(sp, "backColor");
		
		done |= 1;
		doneThen(done, 3, gl);
	});
	
	var themodel = cube;
	
	loadModel(gl, themodel, function(lm) {
		gl.model = lm;

		done |= 2;
		doneThen(done, 3, gl);
	});

}

var cubeIdAndFaceToType = [
	[[8, 3], [8, 12], false, false, false, [12, 4]],
	[[8, 2], false, false, [8, 11], false, [12, 1]],
	[false, [8, 9],  [8, 4], false, false, [9, 4]],
	[false, false,  [8, 1],  [8, 10], false, [9, 1]],
	[[5, 3], [5, 12], false, false,  [11, 4], false],
	[[5, 2], false, false, [5, 11], [11, 1], false],
	[false, [5, 9],  [5, 4], false, [10, 4], false],
	[false, false,  [5, 1],  [5, 10], [10, 1], false],
];

function doneThen(done, max, gl) {
	if(done != max)
		return;
	
	var scene = {};
	var rot = rotateController("canvas");
	
	scene.rotX = 30;
	scene.rotY = -20;
	scene.rotType = 0;
	scene.rotDegree = 0;
	scene.selection = {cubeid:-2, face:-1};
	
	scene.animationQueue = [];
	scene.animationType = 0;
	scene.animationProcess = 0;
	scene.animationProcessAll = 10;
	
	scene.needRepaint = true;
	
	scene.addAnimation = function(type, cb) {
		scene.animationQueue.push({type:type, callback:cb});
		if(scene.animationType == 0) {
			scene.popAnimation();
		}
	};
	
	scene.popAnimation = function() {
		scene.needRepaint = true;
		scene.animationProcess = 0;
		scene.animationType = 0;
		while(scene.animationType == 0 && scene.animationQueue.length > 0) {
			var item = scene.animationQueue.shift();
			scene.animationType = item.type;
			scene.animationCallback = item.callback;
		}
	}
		
	gl.scene = scene;
	
	setInterval(function() {
		if(!rot.isMouseDown) {
			scene.selection.cubeid = -2;
			scene.selection.face = -1;
			rot.x = 0;
			rot.y = 0;
		} else if(scene.selection.cubeid == -2) {
			findCubeIdAndSelection(gl, rot, scene);
		}

		scene.needRepaint = scene.needRepaint || scene.animationType != 0 || rot.changed || scene.rotDegree != 0;
		if(!scene.needRepaint) {
			return;
		}
		
		rot.changed = false;
		scene.needRepaint = false;

		if(scene.selection.cubeid < 0) {
			scene.rotX += rot.x;
			scene.rotY += rot.y;
			while(scene.rotY < -45) {
				scene.rotY += 360;
			}
			while(scene.rotY > 360-45) {
				scene.rotY -= 360;
			}
			if(scene.rotX > 90) {
				scene.rotX = 90;
			}
			if(scene.rotX < -90) {
				scene.rotX = -90;
			}
			rot.x = 0;
			rot.y = 0;
		} else {
			var type = cubeIdAndFaceToType[scene.selection.cubeid][scene.selection.face];
			if(scene.selection.face >= 4) {
				if(scene.rotY < 45) {
				} else if(scene.rotY < 135) {
					type = [type[1], type[0] + (type[0]%2==0?-1:1)];
				} else if(scene.rotY < 225) {
					type = [type[0] + (type[0]%2==0?-1:1), type[1] + (type[1]%2==0?-1:1)];
				} else if(scene.rotY < 315) {
					type = [type[1] + (type[1]%2==0?-1:1), type[0]];
				}
			}
			if(Math.abs(rot.x) < 20 && Math.abs(rot.y) < 20) {
				if(Math.abs(rot.y) > Math.abs(rot.x)) {
					scene.rotType = type[0];
				} else {
					scene.rotType = type[1];
				}
			}
			if(scene.rotType == type[0]) {
				scene.rotDegree = -rot.y;
			} else {
				scene.rotDegree = -rot.x;
			}
		}
		
		if(!rot.isMouseDown) {
			while(scene.rotDegree > 360) {
				scene.rotDegree -= 360;
			}
			while(scene.rotDegree < -360) {
				scene.rotDegree += 360;
			}
			while(scene.rotDegree > 45) {
				scene.rotDegree -= 90;
				rubik.operate(operates[scene.rotType], directions[scene.rotType]);
			}
			while(scene.rotDegree < -45) {
				scene.rotDegree += 90;
				rubik.operate(operates[scene.rotType], 2 - directions[scene.rotType]);
			}
			scene.rotDegree *= 0.7;
			if(scene.rotDegree < 1e-4 && scene.rotDegree > -1e-4) {
				scene.rotDegree = 0;
			}
		}
	
		scene.pMat = okMat4Proj(35, 1, 100, 200).toArray();
		
		if(scene.animationType == 30) {
			var k = (scene.animationProcess + 1) / scene.animationProcessAll;
			scene.rotX = scene.rotX * (1 - k) + 30 * k;
			scene.rotY = scene.rotY * (1 - k) - 20 * k;
		}
		
		var process;
		var rotType;
		
		if(scene.animationType == 0) {
			process = scene.rotDegree;
			rotType = scene.rotType;
		} else {
			process = 90 * scene.animationProcess / scene.animationProcessAll;
			rotType = scene.animationType;
		}
		
		var trans = okMat4Trans(0, 0, -128);
		var rt1 = okMat4RotX(scene.rotX).rotY(OAK.SPACE_LOCAL, scene.rotY);

		for(var x=-8; x<=8; x+=16) {
			for(var y=-8; y<=8; y+=16) {
				for(var z=-8; z<=8; z+=16) {
					var rt1cpy = rt1.clone();
					
					switch(rotType) {
						case 1:
						case 2:
							if(x > 0) {
								rt1cpy.rotX(OAK.SPACE_LOCAL, (rotType*2-3) * process, true);
							}
							break;
						case 3:
						case 4:
							if(x < 0) {
								rt1cpy.rotX(OAK.SPACE_LOCAL, -(rotType*2-7) * process, true);
							}
							break;
						case 5:
						case 6:
							if(y > 0) {
								rt1cpy.rotY(OAK.SPACE_LOCAL, (rotType*2-11) * process, true);
							}
							break;
						case 7:
						case 8:
							if(y < 0) {
								rt1cpy.rotY(OAK.SPACE_LOCAL, -(rotType*2-15) * process, true);
							}
							break;
						case 9:
						case 10:
							if(z > 0) {
								rt1cpy.rotZ(OAK.SPACE_LOCAL, (rotType*2-19) * process, true);
							}
							break;
						case 11:
						case 12:
							if(z < 0) {
								rt1cpy.rotZ(OAK.SPACE_LOCAL, -(rotType*2-23) * process, true);
							}
							break;
						case 13:
						case 14:
							rt1cpy.rotX(OAK.SPACE_LOCAL, (rotType*2-27) * process, true);
							break;
						case 15:
						case 16:
							rt1cpy.rotY(OAK.SPACE_LOCAL, (rotType*2-31) * process, true);
							break;
						case 17:
						case 18:
							rt1cpy.rotZ(OAK.SPACE_LOCAL, (rotType*2-35) * process, true);
							break;
					}
						
					scene.rtMat = rt1cpy.toArray();
					scene.tMat = okMat4Mul(trans, rt1cpy);
					scene.tMat.translate(OAK.SPACE_LOCAL, x, y, z, true);
					scene.tMat = scene.tMat.toArray();
					
					draw(scene, gl, (x>0?1:0) + (y>0?4:0) + (z>0?2:0));
				}
			}
		}
		if(scene.animationType != 0) {
			scene.animationProcess++;
			if(scene.animationProcess >= scene.animationProcessAll) {
				if(scene.animationCallback) {
					scene.animationCallback();
				}
				scene.popAnimation();
			}
		}
	}, 30);
}

function draw(scene, gl, cubeid) {
	var sp2 = gl.dsp;
	gl.useProgram(sp2);
	var i = 0;

	drawModel(gl, gl.model, {
		position: sp2.position,
		normal: sp2.normal,
		textureCoord: sp2.textureCoord,
		texture: sp2.texture,
		otherActions: function(gl, texture, polyhedron) {
			var sp = gl.dsp;
			var color;
			
			if(i >= 6) {
				color = cubecolor[6];
			} else {
				var fpos = facePos[cubeid][i];
				if(fpos < 0) {
					color = cubecolor[6];
				} else {
					color = cubecolor[rubik.get_face(faceMap[i])[fpos]];
				}
			}
			
			gl.uniform3f(sp.backColor, color.r, color.g, color.b);
			gl.uniformMatrix4fv(sp.pMatrix, false, scene.pMat);
			gl.uniformMatrix4fv(sp.tMatrix, false, scene.tMat);
			
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, gl.model.textures[1]);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.uniform1i(sp.highlightTexture, 1);
			i++;
		}
	});
}

function findCubeIdAndSelection(gl, rot, scene) {
	var pMat = okMat4Proj(35, 1, 100, 200);
	var trans = okMat4Trans(0, 0, -128);
	var rt1 = okMat4RotX(scene.rotX).rotY(OAK.SPACE_LOCAL, scene.rotY);
	var tMat = okMat4Mul(trans, rt1);
	
	var mint = 1e9;
	scene.selection.cubeid = -2;
	scene.selection.face = -1;
	
	for(var x=-8; x<=8; x+=16) {
		for(var y=-8; y<=8; y+=16) {
			for(var z=-8; z<=8; z+=16) {
				var cubeid = (x>0?1:0) + (y>0?4:0) + (z>0?2:0);
				var cubeMat = okMat4Mul(pMat, tMat.translate(OAK.SPACE_LOCAL, x, y, z)).inverse(true);
				var sightFrom = okMat4MulVec3(cubeMat, new okVec3(rot.xcrood, rot.ycrood, -1));
				var sightTo = okMat4MulVec3(cubeMat, new okVec3(rot.xcrood, rot.ycrood, 1));
				var d = okVec3Sub(sightTo, sightFrom);
				
				for(var i=0; i<gl.model.polyhedrons.length; i++) {
					var vt = gl.model.polyhedrons[i].vertexArray;
					for(var j=0; j<vt.length; j+=9) {
						var v0 = new okVec3(vt[j+0], vt[j+1], vt[j+2]);
						var v1 = new okVec3(vt[j+3], vt[j+4], vt[j+5]);
						var v2 = new okVec3(vt[j+6], vt[j+7], vt[j+8]);
						var e1 = okVec3Sub(v1, v0);
						var e2 = okVec3Sub(v2, v0);
						var n = okVec3Cross(e1, okVec3Sub(v2, v1));
						if(okVec3Dot(d, n) >= 0) {
							continue;
						}
						var t_ = okVec3Sub(sightFrom, v0);
						var p = okVec3Cross(d, e2);
						var q = okVec3Cross(t_, e1);
						var k = okVec3Dot(p, e1);
						var t = okVec3Dot(q, e2)/k;
						var u = okVec3Dot(p, t_)/k;
						var v = okVec3Dot(q, d)/k;
						if(u > 0 && v > 0 && u+v<1 && t > 0 && t < mint) {
							mint = t;
							scene.selection.cubeid = cubeid;
							scene.selection.face = i;
						}
					}
				}
			}
		}
	}
}

function rotateController(id) {

	var rot = {x: 0.0, y: 0.0, isMouseDown: false, changed: false, xcrood: -1, ycrood: -1};

	var mouseDownPosX;
	var mouseDownPosY;
	
	var canvas = $('#' + id);
	
	$("body").get(0).onselectstart = function() {
		return !rot.isMouseDown;
	}

	canvas.mousedown(function(e){
		mouseDownPosX = e.pageX;
		mouseDownPosY = e.pageY;
		rot.xcrood = (e.pageX - canvas.offset().left) / canvas.width() * 2 - 1;
		rot.ycrood = 1 - (e.pageY - canvas.offset().top) / canvas.height() * 2;
		rot.isMouseDown = true;
	});
	
	$('html').mousemove(function(e){
		if(rot.isMouseDown) {
			var diffX = e.pageX - mouseDownPosX;
			var diffY = e.pageY - mouseDownPosY;
			rot.y += diffX / 2.0;
			rot.x += diffY / 2.0;
			mouseDownPosX = e.pageX;
			mouseDownPosY = e.pageY;
			rot.changed = true;
		}
	});
	
	$('html').mouseup(function(e){
		rot.isMouseDown = false;
		rot.xcrood = -1;
		rot.ycrood = -1;
	});
	
	return rot;
}

function solve(func) {
//			rubik.random_generate();
	var state = rubik.save_state();
	var result = func();
	
	console.log(result.toString());
//return;
	rubik.load_state(state);
	
	var baseMap = [0, 2, 4, 5, 3, 1, 6, 7, 8];
	for(var i=0; i<result.length; i++) {
		var item = result[i];
		var id = baseMap[item[0]] * 2 + 1;
		if(item[1] == rubik.COUNTER_CLOCK_90) {
			id++;
		}
		addAnimation(id);
		if(item[1] == rubik.CLOCK_180) {
			addAnimation(id);
		}
	}
}

var operates = [
	0,
	rubik.R_FACE, rubik.R_FACE,
	rubik.L_FACE, rubik.L_FACE,
	rubik.U_FACE, rubik.U_FACE,
	rubik.D_FACE, rubik.D_FACE,
	rubik.F_FACE, rubik.F_FACE,
	rubik.B_FACE, rubik.B_FACE,
	rubik.RL_FACE, rubik.RL_FACE,
	rubik.UD_FACE, rubik.UD_FACE,
	rubik.FB_FACE, rubik.FB_FACE
];

var directions = [
	0,
	rubik.CLOCK_90, rubik.COUNTER_CLOCK_90,
	rubik.CLOCK_90, rubik.COUNTER_CLOCK_90,
	rubik.CLOCK_90, rubik.COUNTER_CLOCK_90,
	rubik.CLOCK_90, rubik.COUNTER_CLOCK_90,
	rubik.CLOCK_90, rubik.COUNTER_CLOCK_90,
	rubik.CLOCK_90, rubik.COUNTER_CLOCK_90,
	rubik.CLOCK_90, rubik.COUNTER_CLOCK_90,
	rubik.CLOCK_90, rubik.COUNTER_CLOCK_90,
	rubik.CLOCK_90, rubik.COUNTER_CLOCK_90
];

function addAnimation(i) {
	gl.scene.addAnimation(i,function(){rubik.operate(operates[i], directions[i])});
}

