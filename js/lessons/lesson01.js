/*

<h2>Q learning</h2>

<p>This is the description. There is even some \(\LaTeX\) in here! $$\sum_a Q(a)$$</p>

*/

/**
* This will run immediately upon load.
* Put any variables you want to save into 'my'.
*/
var initialize = function(){
	my = {};
	my.panels = projector.createpanels([1,2]);
	my.task = new gridworld.GridWorld(gridworld.TESTWORLD)
	my.task.setpanel(my.panels[1])
	return my;
}

var run = function(my){

var task = my.task;
//:show {"title":"Setup"}

ALPHA = 0.05
GAMMA = 0.95

//:end show

Q = new StateActionValueTable()


//:edit {"title":"Initialization"}
Q.fill(task.states(), task.actions(), 5.0)
//:end edit

var steps = []
episode = 0

// The reason we don't use a normal for loop is to allow the rendering
// to happen between each iteration.
loop(300, function(episode){
	var step = 0
	var path = []
	task.reset()
	// loop(null) does a do-while loop, closure returns whether to continue.
	while(!task.ended()){
		var s = task.getState();
		var actions = Q.get(s)
		
		var a

		//:edit {"title":"Action Selection"}
		if (chance(0.0))
			a = randompick(actions);
		else
			a = argmax(actions);
		//:end edit
		
		var r = task.act(a);
		var s_ = task.getState();

		//:edit {"title":"Update"}
		Q.set(s, a, (1 - ALPHA) * Q.get(s, a) + ALPHA * (r + GAMMA * valmax(Q.get(s_))))
		//:end

		step ++;
		path.push(a)
	}
	steps.push([episode, step])
	task.render(Q)
	$.plot(my.panels[0], [steps]);
})
	
}