var gridworld = (function () {

my = {}

my.TESTWORLD = [
"_ _ _ _ _ _ _ _ _ _ _ w _ _ _ _",
"_ s _ w _ _ _ w _ w _ w _ _ x _",
"_ _ _ _ _ o _ w _ o _ _ _ o _ _"
] 

/*** CONSTANTS ***/
var TILES = {
  w: 'wall',
  s: 'start',
  o: 'pit',
  a: 'sand',
  x: 'small',
  y: 'medium',
  z: 'big',
  b: 'bandit'
}
var TILE_WALL = 'w'
var TILE_START = 's'
var TILE_PIT = 'o'
var TILE_SAND = 'a'
var TILE_BIG = 'z'
var TILE_MEDIUM = 'y'
var TILE_SMALL = 'x'
var TILE_BANDIT = 'b'

var RENDER_TILE_SIZE = 32

/*** CLASSES ***/

my.GridWorld = klass({

  PIT_REWARD: -15,
  SAND_REWARD: -10,
  REWARD_SMALL: 10,
  REWARD_MEDIUM: 20,
  REWARD_BIG: 30,
  BANDIT_REWARD: 1,
  STEP_REWARD: 0,
  WALL_REWARD: -1,

  SAND_PROBABILITY: 0.5,
  END_PROBABILITY: 0.0,

  MAX_STEPS: 2000,

  initialize: function(world){
    this.pos = null;
    this.finished = false;
    this.lastAction = null;

    this.parseWorld(world)
    this.reset()
  },

  parseWorld: function(worldstrings){
    this.world = []
    this.bandits = {}
    this.startpos = null
    // TODO CHECK VALID MAP
    for (var i = 0; i < worldstrings.length; i ++){
      this.world.push(worldstrings[i].toLowerCase().split(' '));
      var found = this.world[i].indexOf(TILE_START)
      if (found > -1){
        this.startpos = [i, found]
      }
      for (var j = 0; j < this.world[i].length; j++){
        if (this.world[i][j] == TILE_BANDIT){
          this.bandits[[i,j]] = Math.random();
        }
      }
    }
    if (this.startpos === null){
      throw "Start position not found in world."
    }
    this.height = this.world.length
    this.width = this.world[0].length
  },

  reset: function(resetBandits){
    this.pos = this.startpos
    this.finished = false;
    this.steps = 0;
    if (resetBandits){
      for (var key in this.bandits) {
        this.bandits[key] = Math.random();
      }  
    }
  },

  states: function(){
    var s = []
    for (var y = 0; y < this.height; y ++){
      for (var x = 0; x < this.width; x++){
        s.push(x + '_' + y);
      }
    }
    return s
  },

  getState: function(){
    return this.pos[1] + '_' + this.pos[0]
  },

  actions: function(state){
    return ["N","E","S","W"]
  },

  act: function(action){
    if (this.finished) throw "Episode finished."
    this.lastAction = action;
    this.steps++
    var dir
    var reward = this.STEP_REWARD;
    switch(action){
      case "N": dir = [-1 ,0]; break;
      case "E": dir = [0 ,1]; break;
      case "S": dir = [1, 0]; break;
      case "W": dir = [0, -1]; break;
      default: throw "Unknown Action " + action;
    }
    var y = this.pos[0] + dir[0]
    var x = this.pos[1] + dir[1]

    if (y >= 0 && y < this.height && x >= 0 && x < this.width){
      var type = TILES[this.world[y][x]];

      if (type == 'wall' ){
        reward = this.WALL_REWARD;
      } else {
        this.pos = [y,x];
      }
    
      if (type == 'pit'){
        reward = this.PIT_REWARD
        this.finished = true
      }

      if (type == 'big'){
        reward = this.REWARD_BIG
        this.finished = true
      }

      if (type == 'medium'){
        reward = this.REWARD_MEDIUM
        this.finished = true
      }

      if (type == 'small'){
        reward = this.REWARD_SMALL
        this.finished = true
      }

      if (type == 'bandit'){
        reward = (Math.random() <= this.bandits[[y,x]]) * this.BANDIT_REWARD
        console.log(this.bandits[[y,x]])
        console.log(reward)
        this.finished = true
      }

      if (type == 'sand'){
        if (Math.random() < this.SAND_PROBABILITY){
          reward = this.SAND_REWARD;
          this.finished = true;
        }
      }
    }

    if (Math.random() < this.END_PROBABILITY){
      reward = 0;
      this.finished = true;
    }

    if (this.steps > this.MAX_STEPS){
      this.finished = true;
    }

    return reward
  },

  ended: function(){
    return this.finished;
  },

  setpanel: function(panel){
    panel.empty();
    this.panel = panel;
    var inner = $('<div class="gridworld"></div>')
    inner.css('width', this.width * RENDER_TILE_SIZE)
    inner.css('height', this.height * RENDER_TILE_SIZE)
    this.panel.append(inner)
    me = this;

    for (var y = 0; y < this.height; y ++){
      for (var x = 0; x < this.width; x++){
        var state =  x + '_' + y;
        var position = {
          width: RENDER_TILE_SIZE + 'px',
          height: RENDER_TILE_SIZE +'px',
          left: RENDER_TILE_SIZE*x + 'px',
          top: RENDER_TILE_SIZE*y + 'px'
        }
        var tile = $('<div></div>').addClass('tile base').css(position);
        if (this.world[y][x] != '_'){
          tile.addClass(TILES[this.world[y][x]]);
        }
        inner.append(tile);

        var overlay = $('<div></div>').css(position).addClass('tile overlay ' + state).attr('data-coord', state);
        inner.append(overlay);
      }
    }
	
	var robot = $('<div>').addClass('robot')
	inner.append(robot)	

  },

  render: function(qtable){
    // Render in een 
    if (typeof qtable != 'undefined'){
      var range = qtable.extrema()
      for (state in qtable.values){
        var tile = this.panel.find('.overlay.' + state);
        var a = argmax(qtable.get(state));
        var best = valmax(qtable.get(state))
        if (best > 0){
          tile.css('background-color', 'rgba(0,255,0,' + 0.5 * best / range[1] + ')');
        } else if (best < 0){
          tile.css('background-color', 'rgba(255,0,0,' + 0.5 * best / range[0] + ')');
        }
        tile.removeClass("N S E W")
        tile.addClass(a);
      }
    }
	
  	// Robot positioneren
  	var robot = this.panel.find('.robot')
  	robot.css({'left':this.pos[1] * RENDER_TILE_SIZE, 'top':this.pos[0] * RENDER_TILE_SIZE})	
    robot.removeClass("N S E W")
    robot.addClass(this.lastAction);
  },

})

return my;
})();
