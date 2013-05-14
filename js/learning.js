
/*** FUNCTIONS ***/

function argmax(obj){
	var mk = null
	var mx = -Infinity
	for (var key in obj){
		if (obj[key] > mx) {
			mk = key;
			mx = obj[key]
		}
	}
	return mk
}

function valmax(obj){
	var mx = -Infinity
	for (var key in obj){
		if (obj[key] > mx) {
			mx = obj[key]
		}
	}
	return mx
}

/**
* Returns random value from array, or random key from object
*/
function randompick(obj){
	if (!$.isArray(obj)){
		var obj = Object.keys(obj);
	}
	return obj[Math.floor(Math.random()*obj.length)];
}
/*** CLASSES ***/

var StateActionValueTable = klass({

	initialize: function(){
		// Values is een dict van dicts
		// Bijv: values["1,4"]["E"] = 1.0
		this.values = {}
		this.visits = {}
		this.actions = []
	},

	fill: function(states, actions, value){
		for (var i = 0; i < states.length; i++){
			this.values[states[i]] = {}
			for (var j = 0; j < actions.length; j++){
				this.values[states[i]][actions[j]] = value
			}
		}
	},

	get: function(){
		if (arguments.length == 1){
			return this.values[arguments[0]]
		} else {
			state = arguments[0]
			action = arguments[1]
			if (!state in this.values){
				return 0
			}
			if (!action in this.values[state]){
				return 0
			}
			return this.values[state][action]	
		}

		
	},

	set: function(state, action, value){
		this.values[state][action] = value	
	},



})

