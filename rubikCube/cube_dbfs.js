var dbfs=(function(){
var Yellow=0;
var White=1;
var Blue=2;
var Green=3;
var Red=4;
var Orange=5;

var R_FACE=0;
var U_FACE=1;
var F_FACE=2;
var B_FACE=3;
var D_FACE=4;
var L_FACE=5;

var CLOCK_90=0;
var CLOCK_180=1;
var COUNTER_CLOCK_90=2;

// Rotation rule for R, U, F, B
var position_rule = [[[0, 2, 6, 3, 4, 1, 5, 7],[0, 6, 5, 3, 4, 2, 1, 7],[0, 5, 1, 3, 4, 6, 2, 7]],[[3, 0, 1, 2, 4, 5, 6, 7],[2, 3, 0, 1, 4, 5, 6, 7],[1, 2, 3, 0, 4, 5, 6, 7]],[[0, 1, 3, 7, 4, 5, 2, 6],[0, 1, 7, 6, 4, 5, 3, 2],[0, 1, 6, 2, 4, 5, 7, 3]],[[1, 5, 2, 3, 0, 4, 6, 7],[5, 4, 2, 3, 1, 0, 6, 7],[4, 0, 2, 3, 5, 1, 6, 7]]];
var rotation_rule = [[[0, 2, 1, 0, 0, 1, 2, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 2, 1, 0, 0, 1, 2, 0]],[[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0]],[[0, 0, 2, 1, 0, 0, 1, 2],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 2, 1, 0, 0, 1, 2]],[[2, 1, 0, 0, 1, 2, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[2, 1, 0, 0, 1, 2, 0, 0]]];

// R, U, F, B, D, L
var layer= [[2, 1, 5, 6], [0, 1, 2, 3], [3, 2, 6, 7],[1, 0, 4, 5], [7, 6, 5, 4], [0, 3, 7, 4]];

var cubes= [[0, 5, 3],[0, 3, 4],[0, 4, 2],[0, 2, 5],[1, 3, 5],[1, 4, 3],[1, 2, 4],[1, 5, 2]];

var position=[3,0,1,2,4,5,6,7];

var rotation=[0,0,0,0,0,0,0,0];

var goal_position=[0,1,2,3,4,5,6,7];
var goal_rotation=[0,0,0,0,0,0,0,0];

function get_face(result, face,state){
	for(var i = 0; i < 4; i++){
		result[i] = cubes[state[0][layer[face][i]]][(3-state[1][state[0][layer[face][i]]]) % 3];
	}
}

function operate(face,rotate,state){
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
function save_state(){
	return {
		position: position.slice(0),
		rotation: rotation.slice(0), 
		toString: function() {
			return "position: [" + position.toString() + "], rotation: [" + rotation.toString() + "]";
		}
	};
}

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
var queue=[,];
var map=new Object();
var paths=[new Object(),new Object()];
function state_equls(){
	for(var i=0; i < 8; i++)
	{
		if(position[i] != goal_position[i])
			return false;
		if(rotation[i] != goal_rotation[i])
			return false;
	}
}
function init(){
	var rot_sum = 0;

	for(var i = 0; i < 7; i++){
		rotation[i] = Math.round(Math.random()*2);
		rot_sum = (rot_sum + rotation[i]) % 3;
	}
	rotation[7] = (3 - rot_sum)%3;
}

function extend(state,queue,map,idx,parse){
	


	for(var i=0; i < 4; i++)
		for(var j=0; j < 3; j++)
		{
			var s=[[],[]];
			for(var k=0; k < 8; k++){
				s[0][k]=state[0][k];
				s[1][k]=state[1][k];
			}
			operate(i,j,s);
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
		var face=op/3;
		var angle=op%3;
		angle=2-angle;
		result+=(face*3+angle)+" ";
	}
	return result;
}
var path1="";
var path2="";
function dbfs(){
	if(state_equls())
		return true;
    for(var k in map){
        delete (map[k]);
    }
    if(queue[0] == null)
    	queue[0]=new Qu.Queue(10000);
    if(queue[1] == null)
    	queue[1]=new Qu.Queue(10000);


    //map[init]=0;
    //map[goal]=1;
    var parse=0;
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
		    			else{
		    				path2=path2+inverse(path1.substring(2));
		    			}
		    			var strs=path2.split(" ");
		    			var result=[];
		    			for(var i=0; i < strs.length-1;i++){
		    				result.push([Math.floor(parseInt(strs[i])/3),parseInt(strs[i])%3]);
		    			}
		    			alert(result);
		    			alert(strs.length);
		    			alert(step);
		    			return result;
		    			//return true;
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
function load_state(o){
	position = o.position;
	rotation = o.rotation;
}

return {
	get_face: get_face,
	operate: operate,
	init: init,
	save_state: save_state,
	dbfs: dbfs,
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