/*

<h2>Q learning</h2>

<p>This is the description. There is even some \(\LaTeX\) in here! $$\sum_a Q(a)$$</p>

*/

/**
* This will run immediately upon load.
* Put any variables you want to save into 'my'.
*/
var setup = function(my){
	
	var world = [
	"_ b _",
	"b s b",
	"_ b _"
	] 

	my.panels = projector.createPanels([1,2]);
	my.buttons = projector.createButtons(["Next", "Play"])
	my.task = new gridworld.GridWorld(world);
	my.task.setpanel(my.panels[1])
	my.autoplay = false
	my.task.render();
}

var first = function(my){
	//:show {"title":"Variables"}
	var ALPHA = 0.05
	var GAMMA = 1.0
	//:end show

	var EPISODES = 300;
	my.ALPHA = ALPHA
	my.GAMMA = GAMMA
	my.EPISODES = EPISODES

	my.Q = new StateActionValueTable()
	var Q = my.Q
	var task = my.task

	//:edit {"title":"Initialization"}
	Q.fill(task.states(), task.actions(), 0.0)
	//:end edit

	// Other persistent variables
	my.steps = []
	my.episode = 0
	my.step = 0;

	// Define functions

	my.action_select = function(s){
		var a
		var As = Q.get(s)

		//:edit {"title":"Action Selection"}
		if (chance(0.0))
			a = randompick(As);
		else
			a = argmax(As);
		//:end edit
		return a

	}

	my.update = function(s, a, r, s_){
		//:edit {"title":"Update"}
		Q.set(s, a, (1 - ALPHA) * Q.get(s, a) + ALPHA * (r + GAMMA * valmax(Q.get(s_))))
		//:end
	}

	my.start_episode = function(){
		task.reset();
		my.step = 0;
	}

	my.run_episode = function(){
		my.start_episode();
		while(!task.ended()){
			my.do_step();
		}
		my.start_episode()
	}

	my.do_step = function(){
		var s = task.getState();
			
		var a = my.action_select(s)
		
		var r = task.act(a);

		console.log(r);
		var s_ = task.getState();

		my.update(s, a, r, s_);

		my.step ++;

		if (task.ended()){
			console.log("Episode finished in " + my.step + " steps.");
			
			my.steps.push([my.episode, my.step]);
			my.episode ++;

			$.plot(my.panels[0], [my.steps]);


		}
	}
}



var run = function(my, run_num){
	if (my.task.ended()){
		my.start_episode();
	}

	if (my.buttons['Next'].attr('data-justclicked') == 'true') {
		my.do_step();
		my.task.render(my.Q);
	}
	

	if (my.episode > my.EPISODES){
		return true;
	}
}