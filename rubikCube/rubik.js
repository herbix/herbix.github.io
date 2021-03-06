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
						[[0, 1, 2, 3, 5, 6, 7, 4],[0, 1, 2, 3, 6, 7, 4, 5],[0, 1, 2, 3, 7, 4, 5, 6]],
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

var position = [0, 1, 2, 3, 4, 5, 6, 7];
var rotation = [0, 0, 0, 0, 0, 0, 0, 0];

var goal_position=[0,1,2,3,4,5,6,7];
var goal_rotation=[0,0,0,0,0,0,0,0];
function random_generate(){
	var flag = [0, 0, 0, 0, 0, 0, 0, 0];
	/*operate(4,0);
	operate(2,1);
	operate(1,2);
	operate(3,2);
	operate(5,0);
	operate(4,1);
	operate(6,0);*/
	// Generate random position
	for(var i = 0; i < 8; i++){
		position[i] = Math.round(Math.random() * 8) % 8;
		//position[i] =(i+1)%8;
		while(flag[position[i]] != 0)
			position[i] = (position[i] + 1) % 8;
		flag[position[i]] = 1;
	};

	// Generate random rotation
	var rot_sum = 0;
	for(var i = 0; i < 7; i++){
		rotation[i] = Math.round(Math.random() * 3) % 3;
		//rotation[i]=0;
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
function operate_state(face,rotate,state){
	for(var i = 0; i < 8; i++){
		state[1][state[0][i]] = (state[1][state[0][i]] + rotation_rule[face][rotate][i]) % 3;
	}
	var temp_result=[0,0,0,0,0,0,0,0];
	for(var i = 0; i < 8; i++){
		temp_result[i] = state[0][position_rule[face][rotate][i]];
	}
	for(var i = 0; i < 8; i++){
		state[0][i] = temp_result[i];
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



function extend(state,queue,map,idx,parse){
	


	for(var i=0; i < 9; i++)
		for(var j=0; j < 3; j++)
		{
			var s=[[],[]];
			for(var k=0; k < 8; k++){
				s[0][k]=state[0][k];
				s[1][k]=state[1][k];
			}
			operate_state(i,j,s);
			if(parse == 1){
				if(map[s] == null || (map[s]&(idx+1)) == 0){
					map[s]|=idx+1;
					queue.enqueue(s);
					paths[idx][s]=paths[idx][state]+(i*3+j)+" ";
				}
			}
			else if(parse == 0){
				if(map[s[1]]==null || (map[s[1]]&(idx+1)) == 0){
					map[s[1]]|=idx+1;
					paths[idx][s]=paths[idx][state]+(i*3+j)+" ";
					queue.enqueue(s);
				}
			}
		}	

}

function inverse(path){
	var strs=path.split(" ");
	var result="";
	for(var i=strs.length-2; i >= 0;i--){
		var op=parseInt(strs[i]);
		var face=Math.floor(op/3);
		var angle=op%3;
		angle=2-angle;
		result+=(face*3+angle)+" ";
	}
	return result;
}
var path1="";
var path2="";

var Qu={};
Qu.Queue=function(len){
	this.capacity=len;
	this.list=new Array();
};
Qu.Queue.prototype.front=function(){
	return this.list[0];
}
Qu.Queue.prototype.enqueue=function(data){
	if(data == null) return;
	if(this.list.length >= this.capacity){
		this.list.remove(0);
	}
	this.list.push(data);
};

Qu.Queue.prototype.dequeue=function(){
	if(this.list == null) return;
	this.list.remove(0);
}
Qu.Queue.prototype.size=function(){
	if(this == null) return;
	return this.list.length;
};
Qu.Queue.prototype.isEmpty = function () {

    if (this == null|this.list==null) return false;

    return this.list.length>0;

};
Qu.Queue.prototype.clear=function(){
	while(this.list != null && this.list.length > 0)
		this.list.remove(0);
}
//对象数组扩展remove
Array.prototype.remove = function(dx) {
    if (isNaN(dx) || dx > this.length) {
        return false;
    }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i]
        }
    }
    this.length -= 1
}

//by zhaoxin
var queue=[,];
var map=new Object();
var paths=[new Object(),new Object()];
var path1="";
var path2="";
function dbfs(){
    for(var k in map){
        delete (map[k]);
    }
    if(queue[0] == null)
    	queue[0]=new Qu.Queue(20000);
    if(queue[1] == null)
    	queue[1]=new Qu.Queue(20000);


    //map[init]=0;
    //map[goal]=1;
    var parse=1;
    var oldparse=0;
    while(parse<2){
    	for(var k in map){
        	delete (map[k]);
    	}
    	for(var k in paths[0]){
        	delete (paths[0][k]);
    	}
    	for(var k in paths[1]){
        	delete (paths[1][k]);
    	}
    	if(queue[0] == null)
    		queue[0]=new Qu.Queue(10000);
    	else{
    		queue[0].clear();
    	}
    	if(queue[1] == null)
    		queue[1]=new Qu.Queue(10000);
    	else{
    		queue[1].clear();
    	}
    	var init=[position,rotation];
    	var goal=[goal_position,goal_rotation];
    	queue[0].enqueue(init);
    	queue[1].enqueue(goal);
    	paths[0][init]="";
    	paths[1][goal]="";
    	if(parse==0){
    		map[init[1]]=1;
    		map[goal[1]]=2;
    	}
    	else{
    		map[init]=1;
    		map[goal]=2;
    	}

	    var idx=0,step=0;
	    oldparse=parse;
	    while(!queue[0].size() == 0 || !queue[1].size() == 0){
	    	idx=step&1;
	    	var cnt=queue[idx].size();
	    	while(cnt > 0){
	    		cnt--;

	    		var cur=queue[idx].front();
		    	queue[idx].dequeue();
	    		if(parse == 1){
		    		if(map[cur]!=null && (map[cur]&3) == 3){
		    			//alert(paths[0][cur]);
		    			//alert(inverse(paths[1][cur]));
		    			path2=paths[0][cur]+inverse(paths[1][cur]);
		    			if(path1[0]=='0')
		    			{
		    				path2=path1.substring(2)+path2;
		    			}
		    			else if(path1[1] == '1'){
		    				path2=path2+inverse(path1.substring(2));
		    			}

		    			var strs=path2.split(" ");
		    			var result=[];
		    			for(var i=0; i < strs.length-1;i++){
		    				result.push([Math.floor(parseInt(strs[i])/3),parseInt(strs[i])%3])
		    			}
		    			//alert(step);
		    			return result;
		    		}

		    		extend(cur,queue[idx],map,idx,parse);
	    		}
	    		else if(parse == 0){
		    		if(map[cur[1]]!=null && (map[cur[1]]&3) == 3){
		    			if(idx == 0){
		    				for(var i=0; i < 8; i++){
		    					position[i]=cur[0][i];
		    					rotation[i]=cur[1][i];
		    				}
		    				path1="0 "+paths[0][cur];
		    			}
		    			else{
		    				for(var i=0; i < 8; i++){
		    					goal_position[i]=cur[0][i];
		    					goal_rotation[i]=cur[1][i];
		    				}
		    				path1="1 "+paths[1][cur];
		    			}
		    			//alert(path1);
		    			//realpath+=paths[0][cur];
		    			//alert(paths[1][cur]);
		    			parse++;
		    			break;
		    		}
		    		extend(cur,queue[idx],map,idx,parse);
	    		}

	    	}
	    	if(parse > oldparse){
	    		break;
	    	}
	    	step++;
	    	//if(step > 10)
	    		//break;
	    }
	    if(parse == oldparse)
	    	parse++;
	}
    alert("not found");
    //return false;
}


random_generate();
recover();

return {
	get_face: get_face,
	operate: operate,
	random_generate: random_generate,
	dbfs:dbfs,
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
