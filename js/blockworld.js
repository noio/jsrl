TESTWORLD = [
"_ _ _ _ _ _ _ _",
"_ s _ w _ _ e _",
"_ _ _ _ _ o _ _"
] 

/*** CONSTANTS ***/
TILE_WALL = 'w'
TILE_START = 's'
TILE_PIT = 'o'
TILE_END = 'e'

/*** CLASSES ***/

var BlockWorld = $.klass({

	PIT_REWARD: -10,
	END_REWARD: 1000,

	initialize: function(world){
		this.pos = null;
		this.finished = false;

		this.parseWorld(world)
		this.reset()
	},

	parseWorld: function(world){
		this.world = []
		this.startpos = null
		// TODO CHECK VALID MAP
		for (var i = 0; i < world.length; i ++){
			this.world.push(world[i].toLowerCase().split(' '));
			var found = this.world[i].indexOf(TILE_START)
			if (found > -1){
				this.startpos = [i, found]
			}
		}
		if (this.startpos === null){
			throw "Start position not found in world."
		}
		this.height = this.world.length
		this.width = this.world[0].length
	},

	reset: function(){
		this.pos = this.startpos
		this.finished = false;
	},


	states: function(){
		var s = []
		for (var y = 0; y < this.height; y ++){
			for (var x = 0; x < this.width; x++){
				s.push(x + ',' + y);
			}
		}
		return s
	},

	getState: function(){
		return this.pos[1] + ',' + this.pos[0]
	},

	actions: function(state){
		return ["N","E","S","W"]
	},

	act: function(action){
		if (this.finished) throw "Episode finished."

		var dir
		var reward = 0
		switch(action){
			case "N": dir = [-1 ,0]; break;
			case "E": dir = [0 ,1]; break;
			case "S": dir = [1, 0]; break;
			case "W": dir = [0, -1]; break;
		}
		var y = this.pos[0] + dir[0]
		var x = this.pos[1] + dir[1]

		if (y < 0 || y >= this.height || x < 0 || x >= this.width || this.world[y][x] == TILE_WALL){
			// doe niks
		} else {
			this.pos = [y,x];
			if (this.world[y][x] == TILE_PIT){
				reward = this.PIT_REWARD
				this.finished = true
			}

			if (this.world[y][x] == TILE_END){
				reward = this.END_REWARD
				this.finished = true
			}
		}

		return reward
	},

	ended: function(){
		return this.finished;
	},


	render: function(canvas, qtable){
		// Render in een 
	}

})

