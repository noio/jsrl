/*

<h2>One Armed Bandits</h2>

<p>
\(Q(a)\) is the estimated payoff of each action \(a\) which has been chosen \(k_a\) times, 
computed by the sample average: $$ Q(a) = \frac{r_1 + r_2 + \cdots + r_{k_a}}{k_a} $$

In stead of keeping track of all the rewards, we can compute the average iteratively:

$$Q(a) = Q(a) + \frac{1}{k_a + 1} \left[ r_{k+1} - Q(a) \right] $$

Because we are now "bootstrapping" off of previous estimates, this allows us to do "optimistic initialization", e.g:

$$ \forall a [Q(a) = 5 ] $$


</p>

*/

/**
 * This will run immediately upon load.
 * Put any variables you want to save into 'my'.
 */
var setup = function(my) {

		var world = ["_ b _", 
					 "b s b", 
					 "_ b _"]

		my.panels = projector.createPanels([1, 1, 1]);
		my.buttons = projector.createButtons(["Next", "Play", "Get Data"])
		my.task = new gridworld.GridWorld(world)
		my.task.setpanel(my.panels[1])
		my.task.render();

		my.buttons['Get Data'].on('click', function(){
			showDataTable(my.perf);
		})	

	}

var first = function(my) {		
		my.play = false;

		my.t = 0      // Number of plays
		my.R = 0      // Total Return (Sum(r_t))
		my.perf = []  // Array with performance data (average return)
		

		//:edit {"title":"Initialize"}
		EPSILON = 0.2	
		k =               {'N':0, 'S':0, 'W':0, 'E':0}
		total_reward =    {'N':0, 'S':0, 'W':0, 'E':0}
		Q =               {'N':0, 'S':0, 'W':0, 'E':0}
		standard_errors = {'N':0, 'S':0, 'W':0, 'E':0}
		
		//:end edit
		

		// Define functions
		my.action_select = function(s) {
			var a

			//:edit {"title":"Action Selection"}
			if (chance(EPSILON)) 
				a = randompick(['N', 'S', 'W', 'E']);
			else 
				a = argmax(Q);
			//:end edit
			console.log("Picked action " + a)
			return a

		}

		my.update = function(s, a, r, s_) {
			//:edit {"title":"Update"}
			k[a] += 1
			total_reward[a] += r
			Q[a] = total_reward[a] / k[a]
			standard_errors[a] = Math.sqrt(Q[a] * (1 - Q[a])) / Math.sqrt(k[a])
			//:end
		}

		my.do_step = function() {
			var s = my.task.getState();

			var a = my.action_select(s)

			var r = my.task.act(a);
			var s_ = my.task.getState();


			my.R += r;

			my.update(s, a, r, s_);

			my.t ++;
			my.perf.push([my.t, my.R / my.t]);
			$.plot(my.panels[0], [my.perf])
			
			// Do plotting
			intervalPlot(my.panels[2], k, total_reward, standard_errors)
			

			my.task.reset()
			
		}
			
	}



var run = function(my, frame) {

		if (my.buttons['Play'].attr('data-justclicked') == 'true') {
			my.play = true;
		}

		if (my.buttons['Next'].attr('data-justclicked') == 'true' || my.play) {
			my.do_step();
			my.task.render();

			if (my.t >= 300){
				return true;
			}
		}


	}
