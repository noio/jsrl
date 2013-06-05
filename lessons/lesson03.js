/*

<h2>Q learning</h2>
<p>Je hebt de afgelopen 2 lessen gekeken naar het n-armed bandits problem.
Dit is een probleem waarbij de agent probeert z'n' <em>acties</em> zo te optimaliseren,
dat deze binnen een beperkt aantal stappen maximale reward binnensleept.
De enige variabele die daarbij een rol speelt is de actie: ``neem ik
de bandit in het Noorden, Oosten, Zuiden of Westen.''
Dit is een probleem met een <em>action-space</em>, met slechts vier opties.</p>

<p>Om complexere problemen op te lossen, zoals bijvoorbeeld <a href="http://www.youtube.com/watch?v=CLIPLiQDIk0">als
robot efficient een kamer schoon te zuigen</a> (zie ook <a href="http://www.youtube.com/watch?v=r4l4zLrQx-I">hier</a>), 
of <a href="http://www.youtube.com/watch?v=3mvE_CeH9q0">een helikopter te besturen</a>, hangt de
actie die je wilt nemen af van de omgeving: als je met een helikopter vliegt, kun je moeilijk
volhouden dat naar rechts vliegen altijd wat meer reward oplevert dan naar links, zoals met de bandits.</p>

<p>Wat je nodig hebt is een <em>state space</em>: een representatie van de huidige staat
van de agent en de wereld, die zich in verschillende toestanden kunnen bevinden en daarmee om verschillende 
acties vragen. Je Reinforcement Learning-algoritme zal niet slechts moeten moeten leren om de juiste
actie te kiezen in <em>action-space</em>, hij zal moeten leren de juiste actie te nemen, gegeven
een bepaalde state van de wereld. Hij moet leren in een <em>state-action</em>-space.</p>

<p> Waar de <em>action-space</em> er in de vorige 2 lessen nog zo uit zag:</p>

<table style='color: black; font-size: 14'>
<tr><td></td><td>Noord</td><td>Oost</td><td>Zuid</td><td>West</td></tr>
<tr><td></td><td>0.4</td><td>0.6</td><td>0.5</td><td>0.45</td></tr>
</table>

<p>Heb je nu een <em>state-action</em>-space, waar de space
in dit geval casino's zijn:</p>
<table style='color: black; font-size: 14'>
<tr><td></td><td>Noord</td><td>Oost</td><td>Zuid</td><td>West</td><td>Ga naar ander casino</td></tr>
<tr><td>Casino1</td><td>0.2</td><td>0.4</td><td>0.6</td><td>0.5</td><td>0.45</td></tr>
<tr><td>Casino2</td><td>0.1</td><td>0.3</td><td>0.2</td><td>0.1</td><td>0.7</td></tr>
</table>


<p>\(Q\) is nu dus ook geen functie meer van alleen \(a\):
$$Q(a)$$
 maar van \(s\) én \(a\):</p>

$$Q(s, a)$$

Belangrijk hierbij is dat als je een bepaalde actie in een bepaalde state uitvoert,
je terecht komt in <em>een volgende state</em>. Vaak zijn bepaalde states daarbij
waardevoller dan andere states, bijvoorbeeld omdat ze je dichter bij een reward
brengen. In het probleem van les 3 is deze verbinding heel duidelijk:
je moet de uitgang van een doolhofje vinden. <em>States</em> zij hier posities
in het doolhof, <em>actions</em> de kant die je oploopt. Voor veel acties
is de volgende state waarin je dan terecht komt deterministisch bepaald:
als je de actie naar het noorden neemt, wordt de volgende state de
state ten noorden van je huidige state.

De update-functie wordt dus een stukje ingewikelder dan in de vorige lessen:
je wilt voor elke actie \(a\) gegeven een state \(Q\) de gemiddelde
reward die je als gevolg van de actie verwacht:

$$E[r_{a}]$$

<p><em>plus</em> de reward die je in de toekomst verwacht, gegeven
de state waar je in terecht komt, als je die actie neemt.
Daarvoor gebruik je de Q-value van de volgende state \(s_{t+1}\), gegeven dat
je in die state de best mogelijke actie \(a\) kiest:</p>

$$\max_a Q(s_{t+1}, a)$$

<p>Deze reward in de toekomst is echter misschien onzeker, dus wil je 
hem `discounten' in de tijd met een factor \(\gamma\):

$$\gamma \max_a Q(s_{t+1}, a)$$

De gehele \(Q\)-functie ziet er nu dus zo uit:
$$Q(s, a) = E[r_{a}] +  \gamma \max_a Q(s_{t+1}, a)$$

<p>Hoe berekenen we deze functie nu? Als de agent aan het probleem begint
weet deze nog helemaal niks. Er zit dan dus niks anders
op dan alle Q-waarden op een gegokte waarde te initialiseren (5.0 in
dit geval). Vervolgens kunnen we <em>Temporal Difference learning</em>
gebruiken: elke keer dat we een actie doen, kijken we hoeveel reward
we daadwerkelijk krijgen en in welke state we terechtkomen en 
hoe groot de term \(\max_a \gamma Q(s_{t+1}, a)\) van die state is.
Dit is een schatting van de waarde \(Q(s,a)\).
Deze schatting vergelijken we met de huidige waarde van \(Q(s,a)\).
Hieruit kunnen we het <em>verschil</em> met de verkregen reward + verwachtte
reward en de waarde die we eerder voorspeld hadden met \(Q(s, a)\) berekenen:

$$r_{t+1} + \gamma \max_a Q(s_{t+1}, a) - Q(s, a)$$

Aan de hand van dit verschil passen we onze huidige
Q-waarde aan met de proportie van \(\alpha\).
\(\alpha\) is de <em>learning rate</em>. Hoe hoger we \(\alpha\)
instellen, hoe sneller de agent z'n gedrag aanpast.

$$Q(s, a) \leftarrow Q(s, a) +
\\ \alpha [r_{t+1} + \gamma \max_a Q(s_{t+1}, a) - Q(s, a)] $$

Vergelijk deze formule even met de `update' functie rechts.


<strong>
<p>1a) Druk een keer op `run'. Wat zie je gebeuren?</p>
<p>1b) Voor elke state heb je vier state-action waarden (één voor elke mogelijke actie). 
Waarom krijgt elke state dan maar één kleurtje? Waar staat dit kleurtje voor
denk je?</p>
1c) Stel Alpha eens in op verschillende waarden: 0.1, 0.5 en 1.0. Wat valt je op?
</strong>

<strong>
<p>1a) Druk een keer op `run'. Wat zie je gebeuren?</p>
<p>1b) Voor elke state heb je vier state-action waarden (één voor elke mogelijke actie). 
Waarom krijgt elke state dan maar één kleurtje? Waar staat dit kleurtje voor
denk je?</p>
1c) Stel Alpha eens in op verschillende waarden: 0.1, 0.5 en 1.0. Wat valt je op?
</strong>





*/


/**
* This will run immediately upon load.
* Put any variables you want to save into 'my'.
*/
var setup = function(my){
	my.panels = projector.createPanels([1,2]);
	my.buttons = projector.createButtons(["Next", "Play"])
	my.task = new gridworld.GridWorld(gridworld.TESTWORLD)
	my.task.setpanel(my.panels[1])
	my.task.STEP_REWARD = -1;
	my.autoplay = false
	my.task.render();
}

var first = function(my){
	var ALPHA
	var GAMMA
	var EPSILON
	
	//:edit {"title":"Variables"}
	ALPHA = 0.05
	GAMMA = 0.9
	EPSILON = 0.1
	//:end edit

	var EPISODES = 250;
	my.ALPHA = ALPHA
	my.GAMMA = GAMMA
	my.EPISODES = EPISODES

	my.Q = new StateActionValueTable()
	var Q = my.Q
	var task = my.task

	//:edit {"title":"Initialization"}
	Q.fill(task.states(), task.actions(), 5.0)
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
		if (chance(EPSILON))
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

	N = 100
	
	if(my.episode % N == 5 && false)
	{
		
		if (my.buttons['Next'].attr('data-justclicked') == 'true') {
			my.do_step();
			my.task.render(my.Q);
		}
		
		if (my.buttons['Play'].attr('data-justclicked') == 'true') {
			my.autoplay = true;			
		}
		
		if (my.autoplay && run_num % 5 == 0) {
			my.do_step();
			my.task.render(my.Q);
		}
		
	} else {
		my.autoplay = false;
		my.run_episode();
		my.task.render(my.Q);
	}

	if (my.episode > my.EPISODES){
		return true;
	}
}