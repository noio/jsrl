/*

<h2>Q learning</h2>

<p>This is the description. There is even some \(\LaTeX\) in here! $$\sum_a Q(a)$$</p>

*/

/**
 * This will run immediately upon load.
 * Put any variables you want to save into 'my'.
 */


var custom_plot = function(canvas, n_tries, total_reward, standard_errors) {
		

		var keys = []
		var y_values1 = []
		var y_values2 = []
		

		for (var key in n_tries) {
			keys.push(key)
			y_values1.push(n_tries[key])
			y_values2.push(total_reward[key] / n_tries[key])
		}
		
		
		// Create xticks
		var x_ticks = []
		var x_value = 0.5
		for (var i = 0; i < keys.length; i++) {
			x_ticks.push([x_value, keys[i]])
			x_value += 1
		}

		
		var points = {show: true}
		
		// Set up bar plot
		var options = {
			bars: {
				barWidth: 0.25,
				show: true,
				align: "center",
				radius: 5

			},
			xaxis: {
				min: 0,
				max: keys.length,
				ticks: x_ticks
			},
			yaxis: {min: 0},
			yaxis2: {min: 0, 
					max: 1}
		};

		var data1 = []
		var data2 = []
		
		for (var i = 0; i < y_values1.length; i++) {
			data1.push([x_ticks[i][0] + 0.125, y_values1[i]])
			data2.push([x_ticks[i][0] - 0.125, y_values2[i]])
		}
		var data = [{data: data1, color: 'red', label:'N of tries'}, {data: data2, color: 'green', yaxis: 2, label:'mean reward'}]

		$.plot(canvas, data, options);
	}
	
var custom_plot_lines = function(canvas, n_tries, total_reward, standard_errors) {


		var keys = []
		var y_values1 = []
		var y_values2 = []
		var sems = []

		for (var key in n_tries) {
			keys.push(key)
			y_values1.push(n_tries[key])
			y_values2.push(total_reward[key] / n_tries[key])
			sems.push(standard_errors[key])
		}


		// Create xticks
		var x_ticks = []
		var x_value = 0.5
		for (var i = 0; i < keys.length; i++) {
			x_ticks.push([x_value, keys[i]])
			x_value += 1
		}

		// Set up bar plot
		var options = {
			xaxis: {
				min: 0,
				max: keys.length,
				ticks: x_ticks
			},
			yaxis: {min: 0, max: 1.2},
		};

		var data1 = []
		var data2 = []
		
		var point_vars = {
			show: true, 
			radius:5,
			errorbars: "y",
			yerr: {show: true, color: "red", upperCap: "-", lowerCap: '-'}
		}

		for (var i = 0; i < y_values1.length; i++) {
			data1.push([x_ticks[i][0] + 0.125, y_values1[i]])
			data2.push([x_ticks[i][0] - 0.125, y_values2[i], sems[i]])
		}
		var data = [{data: data2, color: 'green', label:'mean reward', points: point_vars}]

		$.plot(canvas, data, options);
	}



var setup = function(my) {

		var world = ["_ b _", "b s b", "_ b _"]

		my.panels = projector.createpanels([1, 1, 1]);
		my.buttons = projector.createbuttons(["Next", "Play"])
		my.task = new gridworld.GridWorld(world)
		my.task.setpanel(my.panels[1])
		my.autoplay = false
		my.task.render();



	}

var first = function(my) {
		
		
		
		
		my.n_rewards = new StateActionValueTable()
		my.n_no_reward = new StateActionValueTable()


		var Q = my.Q
		var task = my.task

		var n_rewards = my.n_rewards
		var n_no_rewards = my.n_no_reward


		n_rewards.fill(task.states(), task.actions(), 0.0)
		n_no_rewards.fill(task.states(), task.actions(), 0.0)
		
		var mean_reward;		
		//:edit {"title":"Initialize"}
		n_tries = {'N':0, 'S':0, 'W':0, 'E':0}
		total_reward = {'N':0, 'S':0, 'W':0, 'E':0}
		mean_reward = {'N':0, 'S':0, 'W':0, 'E':0}
		standard_errors = {'N':0, 'S':0, 'W':0, 'E':0}
		
		//:end edit
		

		// Define functions
		my.action_select = function(s) {
			var a
			// var mean_reward = (n_rewards.get(s) / (n_rewards.get(s) + n_no_rewards.get(s)))

			//:edit {"title":"Action Selection"}
			if (chance(0.2)) a = randompick(mean_reward);
			else a = argmax(mean_reward);
			//:end edit
			console.log(a)
			return a

		}

		my.update = function(s, a, r, s_) {

			var my_action = a;
			var my_reward = r;
			
			//:edit {"title":"Update"}
			n_tries[a] += 1
			total_reward[a] += r
			mean_reward[a] = total_reward[a] / n_tries[a]
			standard_errors[a] = Math.sqrt(mean_reward[a] * (1- mean_reward[a])) / Math.sqrt(n_tries[a])
			//:end
		}

		my.start_episode = function() {
			task.reset();
			my.step = 0;
		}


		my.do_step = function() {
			var s = task.getState();

			var a = my.action_select(s)

			var r = task.act(a);
			var s_ = task.getState();

			my.update(s, a, r, s_);
			custom_plot_lines(my.panels[2], n_tries, total_reward, standard_errors)
			
			my.task.reset()
			
			}
			
			
		my.start_episode()
	}



var run = function(my, run_num) {

		if (my.buttons['Next'].attr('data-justclicked') == 'true') {
			my.do_step();
			my.task.render(my.Q);
		}

	}
