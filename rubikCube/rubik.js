var rubik = (function() {
var YELLOW = 0;
var WHITE = 1;
var BLUE = 2;
var GREEN = 3;
var RED = 4;
var ORANGE = 5;
var R_FACE = 0;
var U_FACE = 1;
var F_FACE = 2;
var B_FACE = 3;
var D_FACE = 4;
var L_FACE = 5;
var RL_FACE = 6;
var UD_FACE = 7;
var FB_FACE = 8;
var CLOCK_90 = 0;
var CLOCK_180 = 1;
var COUNTER_CLOCK_90 = 2;
// Rule for R, U, F, B, D, L, RL, UD, FB
var position_rule = [[[0, 2, 6, 3, 4, 1, 5, 7],[0, 6, 5, 3, 4, 2, 1, 7],[0, 5, 1, 3, 4, 6, 2, 7]],
						[[3, 0, 1, 2, 4, 5, 6, 7],[2, 3, 0, 1, 4, 5, 6, 7],[1, 2, 3, 0, 4, 5, 6, 7]],
						[[0, 1, 3, 7, 4, 5, 2, 6],[0, 1, 7, 6, 4, 5, 3, 2],[0, 1, 6, 2, 4, 5, 7, 3]],
						[[1, 5, 2, 3, 0, 4, 6, 7],[5, 4, 2, 3, 1, 0, 6, 7],[4, 0, 2, 3, 5, 1, 6, 7]],
						[[0, 1, 2, 3, 5, 6, 7, 4],[0, 1, 2, 3, 6, 7, 4, 5],[0, 1, 2, 3, 7, 6, 5, 4]],
						[[4, 1, 2, 0, 7, 5, 6, 3],[7, 1, 2, 4, 3, 5, 6, 0],[3, 1, 2, 7, 0, 5, 6, 4]],
						[[3, 2, 6, 7, 0, 1, 5, 4],[7, 6, 5, 4, 3, 2, 1, 0],[4, 5, 1, 0, 7, 6, 2, 3]],
						[[3, 0, 1, 2, 7, 4, 5, 6],[2, 3, 0, 1, 6, 7, 4, 5],[1, 2, 3, 0, 5, 6, 7, 4]],
						[[4, 0, 3, 7, 5, 1, 2, 6],[5, 4, 7, 6, 1, 0, 3, 2],[1, 5, 6, 2, 0, 4, 7, 3]]];
var rotation_rule = [[[0, 2, 1, 0, 0, 1, 2, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 2, 1, 0, 0, 1, 2, 0]],
						[[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0]],
						[[0, 0, 2, 1, 0, 0, 1, 2],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 2, 1, 0, 0, 1, 2]],
						[[2, 1, 0, 0, 1, 2, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[2, 1, 0, 0, 1, 2, 0, 0]],
						[[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0]],
						[[1, 0, 0, 2, 2, 0, 0, 1],[0, 0, 0, 0, 0, 0, 0, 0],[1, 0, 0, 2, 2, 0, 0, 1]],
						[[1, 2, 1, 2, 2, 1, 2, 1],[0, 0, 0, 0, 0, 0, 0, 0],[1, 2, 1, 2, 2, 1, 2, 1]],
						[[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0]],
						[[2, 1, 2, 1, 1, 2, 1, 2],[0, 0, 0, 0, 0, 0, 0, 0],[2, 1, 2, 1, 1, 2, 1, 2]]];
// Layer for R, U, F, B, D, L
var layer = [[2, 1, 5, 6], [0, 1, 2, 3], [3, 2, 6, 7],
				[1, 0, 4, 5], [7, 6, 5, 4], [0, 3, 7, 4]];
var rotation_offset = [[1, 2, 1, 2], [0, 0, 0, 0], [1, 2, 1, 2],
				[1, 2, 1, 2],[0, 0, 0, 0],[1, 2, 1, 2]];
var cubes = [[YELLOW, ORANGE, GREEN],[YELLOW, GREEN, RED],[YELLOW, RED, BLUE],[YELLOW, BLUE, ORANGE],
				[WHITE, GREEN, ORANGE],[WHITE, RED, GREEN],[WHITE, BLUE, RED],[WHITE, ORANGE, BLUE]];

var position = [0, 0, 0, 0, 0, 0, 0, 0];
var rotation = [0, 0, 0, 0, 0, 0, 0, 0];

function random_generate(){
	var flag = [0, 0, 0, 0, 0, 0, 0, 0];

	// Generate random position
	for(var i = 0; i < 8; i++){
		position[i] = Math.round(Math.random() * 8) % 8;
		while(flag[position[i]] != 0)
			position[i] = (position[i] + 1) % 8;
		flag[position[i]] = 1;
	};

	// Generate random rotation
	var rot_sum = 0;
	for(var i = 0; i < 7; i++){
		rotation[i] = Math.round(Math.random() * 3) % 3;
		rot_sum = (rot_sum + rotation[i]) % 3;
	}
	rotation[7] = (3 - rot_sum) % 3;
};

function get_face(face){
	var result = [0, 0, 0, 0];
	for(var i = 0; i < 4; i++){

		result[i] = cubes[position[layer[face][i]]][(3-rotation[position[layer[face][i]]]+rotation_offset[face][i]) % 3];
	}
	return result;
};

function operate(face, rotate){
	for(var i = 0; i < 8; i++){
		rotation[position[i]] = (rotation[position[i]] + rotation_rule[face][rotate][i]) % 3;
	}
	var temp_result = [0, 0, 0, 0, 0, 0, 0, 0];
	for(var i = 0; i < 8; i++){
		temp_result[i] = position[position_rule[face][rotate][i]];
	}
	for(var i = 0; i < 8; i++){
		position[i] = temp_result[i];
	}
}

function cancel(face, rotate){
	rotate = 2 - rotate;
	operate(face, rotate);
}

function recover_cube_7(n){
	for(var i = RL_FACE; i <= FB_FACE; i++){
		for(var j = CLOCK_90; j <= COUNTER_CLOCK_90; j++){
			operate(i, j);
			if(position[7] == 7 && rotation[7] == 0){
				return [[i,j]];
			}
			if(n > 0){
				var next = recover_cube_7(n - 1);
				if(next.length > 0){
					next.unshift([i,j]);
					return next;
				}
			}
			cancel(i, j);
		}
	}
	return [];
}

function formula_1_1(){
	var result = [];
	operate(R_FACE, CLOCK_90);
	operate(U_FACE, CLOCK_90);
	operate(R_FACE, COUNTER_CLOCK_90);
	result.push([R_FACE, CLOCK_90]);
	result.push([U_FACE, CLOCK_90]);
	result.push([R_FACE, COUNTER_CLOCK_90]);
	return result;
}

function formula_1_2(){
	var result = [];
	operate(F_FACE, COUNTER_CLOCK_90);
	operate(U_FACE, COUNTER_CLOCK_90);
	operate(F_FACE, CLOCK_90);
	result.push([F_FACE, COUNTER_CLOCK_90]);
	result.push([U_FACE, COUNTER_CLOCK_90]);
	result.push([F_FACE, CLOCK_90]);
	return result;
}

function recover_down_face(cube_id){
	var i = 0;
	var result = [];
	while(position[i] != cube_id)
		i++;
	switch(i){
		case 0:
			operate(U_FACE, CLOCK_180);
			result.push([U_FACE, CLOCK_180]);
			break;
		case 1:
			operate(U_FACE, CLOCK_90);
			result.push([U_FACE, CLOCK_90]);
			break;
		case 3:
			operate(U_FACE, COUNTER_CLOCK_90);
			result.push([U_FACE, COUNTER_CLOCK_90]);
			break;
		case 4:
			operate(B_FACE, COUNTER_CLOCK_90);
			operate(U_FACE, CLOCK_180);
			result.push([B_FACE, COUNTER_CLOCK_90]);
			result.push([U_FACE, CLOCK_180]);
			break;
		case 5:
			operate(R_FACE, CLOCK_180);
			result.push([R_FACE,CLOCK_180]);
			break;
		case 6:
			if(rotation[cube_id] != 0){
				operate(R_FACE, CLOCK_90);
				operate(U_FACE, CLOCK_90);
				operate(R_FACE, COUNTER_CLOCK_90);
				operate(U_FACE, COUNTER_CLOCK_90);
				result.push([R_FACE, CLOCK_90]);
				result.push([U_FACE, CLOCK_90]);
				result.push([R_FACE, COUNTER_CLOCK_90]);
				result.push([U_FACE, COUNTER_CLOCK_90]);
			}
			break;
	}
	switch(rotation[cube_id]){
		case 0:
			result = result.concat(formula_1_1());
			result = result.concat(formula_1_1());
			operate(U_FACE, COUNTER_CLOCK_90);
			result.push([U_FACE, COUNTER_CLOCK_90]);
			result = result.concat(formula_1_1());
			break;
		case 1:
			result = result.concat(formula_1_1());
			break;
		case 2:
			result = result.concat(formula_1_2());
			break;
	}
	return result;
}

function formula_2_1(){
	var result = [];
	operate(R_FACE, CLOCK_90);
	operate(U_FACE, COUNTER_CLOCK_90);
	operate(U_FACE, COUNTER_CLOCK_90);
	operate(R_FACE, COUNTER_CLOCK_90);
	operate(U_FACE, COUNTER_CLOCK_90);
	operate(R_FACE, CLOCK_90);
	operate(U_FACE, COUNTER_CLOCK_90);
	operate(R_FACE, COUNTER_CLOCK_90);
	result.push([R_FACE, CLOCK_90]);
	result.push([U_FACE, COUNTER_CLOCK_90]);
	result.push([U_FACE, COUNTER_CLOCK_90]);
	result.push([R_FACE, COUNTER_CLOCK_90]);
	result.push([U_FACE, COUNTER_CLOCK_90]);
	result.push([R_FACE, CLOCK_90]);
	result.push([U_FACE, COUNTER_CLOCK_90]);
	result.push([R_FACE, COUNTER_CLOCK_90]);
	return result;
}

function formula_2_2(){
	var result = [];
	operate(R_FACE, COUNTER_CLOCK_90);
	operate(U_FACE, CLOCK_180);
	operate(R_FACE, CLOCK_90);
	operate(U_FACE, CLOCK_90);
	operate(R_FACE, COUNTER_CLOCK_90);
	operate(U_FACE, CLOCK_90);
	operate(R_FACE, CLOCK_90);
	result.push([R_FACE, COUNTER_CLOCK_90]);
	result.push([U_FACE, CLOCK_180]);
	result.push([R_FACE, CLOCK_90]);
	result.push([U_FACE, CLOCK_90]);
	result.push([R_FACE, COUNTER_CLOCK_90]);
	result.push([U_FACE, CLOCK_90]);
	result.push([R_FACE, CLOCK_90]);
	return result;
}

function recover_up_face(){
	var i = 0;
	var result = [];
	for(i = 0; i < 4; i++){
		front = get_face(F_FACE);
		back = get_face(B_FACE);
		left = get_face(L_FACE);
		right = get_face(R_FACE);
		up = get_face(U_FACE);
		if(front[0] == YELLOW && right[0] == YELLOW
			&& up[1] == YELLOW && left[0] == YELLOW){
			result = result.concat(formula_2_1());
			break;
		}else if(right[1] == YELLOW && up[2] == YELLOW
			&& left[1] == YELLOW && back[1] == YELLOW){
			result = result.concat(formula_2_2());
			break;
		}else if(front[0] == YELLOW && right[1] == YELLOW
			&& up[0] == YELLOW && up[2] == YELLOW){
			result = result.concat(formula_2_1());
			operate(U_FACE, CLOCK_90);
			result.push([U_FACE, CLOCK_90]);
			result = result.concat(formula_2_2());
			break;
		}else if(right[1] == YELLOW && left[0] == YELLOW
			&& up[2] == YELLOW && up[3] == YELLOW){
			result = result.concat(formula_2_1());
			result = result.concat(formula_2_2());
			break;
		}else if(right[0] == YELLOW && right[1] == YELLOW
			&& up[0] == YELLOW && up[3] == YELLOW){
			result = result.concat(formula_2_1());
			operate(U_FACE, CLOCK_180);
			result.push([U_FACE, CLOCK_180]);
			result = result.concat(formula_2_2());
			break;
		}else if(front[0] == YELLOW && front[1] == YELLOW
			&& right[1] == YELLOW && left[0] == YELLOW){
			result = result.concat(formula_2_2());
			operate(U_FACE, COUNTER_CLOCK_90);
			result.push([U_FACE, COUNTER_CLOCK_90]);
			result = result.concat(formula_2_2());
			break;
		}else if(front[0] == YELLOW && front[1] == YELLOW
			&& back[0] == YELLOW && back[1] == YELLOW){
			result = result.concat(formula_2_1());
			result = result.concat(formula_2_1());
			break;
		}else{
			operate(U_FACE, CLOCK_90);
			result.push([U_FACE, CLOCK_90]);
		}
	}
	return result;
}

function formula_3_1(){
	var result = [];
	operate(R_FACE, CLOCK_90);
	operate(B_FACE, COUNTER_CLOCK_90);
	operate(R_FACE, CLOCK_90);
	operate(F_FACE, CLOCK_180);
	operate(R_FACE, COUNTER_CLOCK_90);
	operate(B_FACE, CLOCK_90);
	operate(R_FACE, CLOCK_90);
	operate(F_FACE, CLOCK_180);
	operate(R_FACE, CLOCK_180);
	result.push([R_FACE, CLOCK_90]);
	result.push([B_FACE, COUNTER_CLOCK_90]);
	result.push([R_FACE, CLOCK_90]);
	result.push([F_FACE, CLOCK_180]);
	result.push([R_FACE, COUNTER_CLOCK_90]);
	result.push([B_FACE, CLOCK_90]);
	result.push([R_FACE, CLOCK_90]);
	result.push([F_FACE, CLOCK_180]);
	result.push([R_FACE, CLOCK_180]);
	return result;
}

function recover_rest_face(){
	var result = [];
	for(var i = 0; i < 4; i++){
		front = get_face(F_FACE);
		if(front[0] == front[1]){
			result = result.concat(formula_3_1());
			return result;
		}else{
			operate(U_FACE, CLOCK_90);
			result.push([U_FACE, CLOCK_90]);
		}
	}
	result = result.concat(formula_3_1());
	for(var i = 0; i < 4; i++){
		front = get_face(F_FACE);
		if(front[0] == front[1]){
			result = result.concat(formula_3_1());
			return result;
		}else{
			operate(U_FACE, CLOCK_90);
			result.push([U_FACE, CLOCK_90]);
		}
	}
}

function recover(){
	var init_position = position;
	var init_rotation = rotation;
	var result = [];

	// Find cube 7
	if(position[7] != 7 || rotation[7] != 0)
		result = recover_cube_7(2);

	// Find down face
	for(var i = 6; i >= 4; i--){
		if(position[6] != i || rotation[i] != 0)
			result = result.concat(recover_down_face(i));
		operate(UD_FACE, CLOCK_90);
		result.push([UD_FACE, CLOCK_90]);
	}
	operate(UD_FACE, CLOCK_90);
	result.push([UD_FACE, CLOCK_90]);

	// Find up face
	var up = get_face(U_FACE);
	if(up[0] != YELLOW || up[1] != YELLOW
		|| up[2] != YELLOW || up[3] != YELLOW){
		result = result.concat(recover_up_face());
	}

	// Find rest faces
	var front = get_face(F_FACE);
	var back = get_face(B_FACE);
	var left = get_face(L_FACE);
	var right = get_face(R_FACE);
	if(front[0] != front[1] || back[0] != back[1]
		|| left[0] != left[1] || right[0] != right[1]){
		result = result.concat(recover_rest_face());
	}

	// Final rotate;
	while(true){
		front = get_face(F_FACE);
		if(front[0] != BLUE){
			operate(U_FACE, CLOCK_90);
			result.push([U_FACE, CLOCK_90]);
		}else{
			break;
		}
	}
	
	// Optimize
	for(var i=0; i<result.length-1; i++) {
		var item1 = result[i];
		var item2 = result[i+1];
		if(item1[0] == item2[0]) {
			if(item1[1] + item2[1] == 2) {
				result.splice(i, 2);
				i--;
			}
			if(item1[1] + item2[1] == 1) {
				result.splice(i, 2, [item1[0], 2]);
				i--;
			}
			if(item1[1] + item2[1] == 0) {
				result.splice(i, 2, [item1[0], 1]);
				i--;
			}
		}
	}

	return result;
}

function save_state(){
	return {
		position: position.slice(0),
		rotation: rotation.slice(0), 
		toString: function() {
			return "position: [" + position.toString() + "], rotation: [" + rotation.toString() + "]";
		}
	};
}

function load_state(o){
	position = o.position;
	rotation = o.rotation;
}

random_generate();
recover();

return {
	get_face: get_face,
	operate: operate,
	random_generate: random_generate,
	save_state: save_state,
	load_state: load_state,
	recover: recover,
	YELLOW: 0,
	WHITE: 1,
	BLUE: 2,
	GREEN: 3,
	RED: 4,
	ORANGE: 5,
	R_FACE: 0,
	U_FACE: 1,
	F_FACE: 2,
	B_FACE: 3,
	D_FACE: 4,
	L_FACE: 5,
	RL_FACE: 6,
	UD_FACE: 7,
	FB_FACE: 8,
	CLOCK_90: 0,
	CLOCK_180: 1,
	COUNTER_CLOCK_90: 2
};

})();
