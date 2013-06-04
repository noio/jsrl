/*

<h2>One Armed Bandits, part 2</h2>

<p>In de vorige les hebben we naar het n-armed bandit problem
gekeken en het bijbehorende <em>exploration</em>-vs-<em>exploitation</em>-dilemma.
We hebben gezien dat we de agent in het begin van het probleem verschillende
bandits/acties uit willen laten proberen om erachter te komen welke hendel(s) het beste zijn,
maar later moet de agent zich focussen op de hendel(s) die het beste zijn,
om z'n reward te maximaliseren. Hier zijn verschillende algoritmen voor,
zoals <em>optimistic initialization</em>, <em>\(\epsilon\)-first</em> en <em>\(\epsilon\)-decreasing</em> </p>

<p>Een geavanceerdere manier om acties te selecteren, is om niet alleen
het aantal tijdstippen mee te nemen, maar de <em>onzekerheid</em>.</p>

<p>Als je een gemiddelde neemt over een serie random variabelen, hoort daar ook
een <em>variantie</em> bij: de som van de kwadraten van het verschil
van elk element t.o.v. het gemiddelde, gedeeld door het aantal
elementen:
$$\sigma_y^2 = \frac 1n \sum_{i=1}^n \left(y_i - \overline{y} \right)^2 $$

een <a href="http://en.wikipedia.org/wiki/Standard_deviation">standaard deviatie (SD)</a> is de <em>verwachtte</em> afwijking t.o.v.
het gemiddelde:
$$ \sigma_y = \sqrt{\operatorname E[(X - \mu)^2]}\\
= \sqrt{\sigma_y^2}$$


De <a href="http://en.wikipedia.org/wiki/Standard_error_(statistics)">Standard Error</a></em> is de standaard deviatie van de <em>sampling distributie</em>.
In andere woorden de verwachtte afwijking van je schatting (het gemeten gemiddelde) t.o.v. het <em>echte</em>
gemiddelde. Deze is gelijk aan.
$$SE_\bar{x}\ = \frac{s}{\sqrt{n}}$$

Waar \(n\) het aantal metingen is.</p>

<p>We weten dat de bandits voor een bepaalde proportie van de tijd een reward geven en
de rest niet. Ze gedragen zich dus naar een <a href="http://en.wikipedia.org/wiki/Bernoulli_distribution">Bernoulli-distributie<a>, waarvan bekend
is dat de variantie gelijk is aan de proportie dat deze 1 geeft maal de proportie dat deze
geen 1 geeft:

$$VAR_{Bernoulli} = p(1- p)$$

Dit betekent dat de SD gelijk is aan
$$SD_{Bernoulli} = \sqrt{p(1- p)}$$

en de Standard Error gelijk aan:
$$SE_{Bernoulli} = \frac{\sqrt{\hat{p}(1- \hat{p})}}{\sqrt{n}}$$
waar \(p\) de gemiddelde uitkering is en \(n\) het aantal
metingen.</p>

<p>De <em>sampling</em> distributie van een Bernoulli-verdeling
kan benaderd worden door een normaal-verdeling, wat betekent dat we
ervan uit kunnen gaan dat de <em>echte</em> gemiddelde reward van een bandit met 95% zekerheid binnen het
<em>confidence interval</em> ligt van</p>

$$\hat{p} \pm 1.96 \times SE_\hat{p}$$

En dus met 95% zekerheid dat

$$p < \hat{p} + 1.96 \times SE_{\hat{p}}$$

Bij <em>Interval learning</em> neemt een agent de onzekerheid in z'n
metingen mee in de actie-selectie: hij neemt telkens de actie waarbij de waarde
waarvan hij voor 95% zeker weet dat de werkelijke payoff lager is het hoogst is.</p>

$$\DeclareMathOperator*{\argmax}{\arg\!\max} \argmax_{n}{}(\hat{p}_a + 1.96 \times SE(\hat{p}_{a_{n}}))$$

<p>Het gevolg hiervan is dat de agent vooral acties kiest die (1) nog onzeker
zijn en (2) misschien wel een hoge payoff hebben.</p>

<strong>
<p>1a) Implementeer <em>Interval Learning</em>.
Het enige wat je daarvoor nog aan hoeft te passen is regel 4 in de <em>Update</em>-functie
en regel 4 in <em>Action Selection</em>-functie.</p>
<p>1b) Draai nu een paar experimenten en plot een grafiek in je spreadsheet.
Doet deze methode het daadwerkelijk beter dan \(\epsilon\)-greedy?</p>
<p>1c) \(k(a)\) staat nu geinitialiseerd op 1, zodat bij de eerste update \(k(a) = 2\) hebt. 
Waarom is het problematisch als je een SD/SEM uit zou rekenen
met slechts één sample (hint: kijk naar de deler in de formule)?</p>
<p>1d) \(\epsilon\) staat nog staatteeds geinitialiseerd op 0.2. Is dit een goed idee
bij <em>interval learning</em>?
Wat gebeurt er als je \(\epsilon\) op 0.0 zet?</p>
</strong>
<p><strong>2) Bij neurowetenschappelijk onderzoek wordt onder andere onderzoek
gedaan met muizen, waarbij bepaalde onderdelen van het brein worden uitgeschakeld
door laesies, neurofarmacologische interventies of optogenetica.
Zo blijkt je het gedrag van muizen in taakjes zoals de n-armed
bandit aan te kunnen passen. Stel dat je de hersenen een muis probeert te modelleren
aan de hand van TD-learning, zoals je in de afgelopen 2 lessen hebt gezien.
Probeer voor elk van de volgende interventies te bedenken hoe je het gedrag van de
muis zou kunnen 'simuleren' door parameters of functies in het TD-model
(Epsilon, Action-selection-functie, Update-functie...) aan te passen:</p>
<p>2a) Het korte-termijn geheugen van de muis wordt middels een laesie uigeschakeld.</p>
<p>2b) Een dopamine-antagonist wordt toegediend, waardoor de muis nauwelijks nog direct genot
kan voelen.</p>
<p>2c) De muis krijgt adrenaline toegediend, waardoor deze veel avontuurlijker wordt.</p>
<p>2d) De muis wordt door een farmacologisch model van PTSD erg angstig gemaakt.</p>
</strong></p>
<p>Dit was les 2 van het practicum ga door naar 
<a href="#", onClick="window.location.hash='lesson03.js'; window.location.reload( true );">les 3</a>.</p>

*/

/**
 * This will run immediately upon load.
 * Put any variables you want to save into 'my'.
 */

/**
k[a] += 1
total_reward[a] += r
Q[a] = total_reward[a] / k[a]
p = total_reward[a] / k[a]
standard_errors[a] = 1.96 * (Math.sqrt(p * (1- p)) / Math.sqrt(k[a]))
Q_plus_SEM[a] = Q[a] + standard_errors[a]
**/

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

		my.task.resetBandits()
		my.play = false;
		
		my.t = 0      // Number of plays
		my.R = 0      // Total Return (Sum(r_t))
		my.perf = []  // Array with performance data (average return)
		
		//:edit {"title":"Initialize"}
		EPSILON = 0.2	
		k =               {'N':1, 'S':1, 'W':1, 'E':1}
		total_reward =    {'N':0.5, 'S':0.5, 'W':0.5, 'E':0.5}
		Q =               {'N':0.5, 'S':0.5, 'W':0.5, 'E':0.5}
		standard_errors = {'N':0.5, 'S':0.5, 'W':0.5, 'E':0.5}	
		Q_plus_CI = {'N':1, 'S':1, 'W':1, 'E':1}	
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
			// a = argmax(Q_plus_CI);
			console.log("Picked action " + a)
			return a

		}

		my.update = function(s, a, r, s_) {
			var t = my.t;
			//:edit {"title":"Update"}
			k[a] += 1
			total_reward[a] += r
			Q[a] = total_reward[a] / k[a]
			standard_errors[a] = 0.5
			Q_plus_CI[a] = Q[a] + 1.96 * standard_errors[a]
			//:end
			// standard_errors[a] = (Math.sqrt(Q[a] * (1- Q[a])) / Math.sqrt(k[a]))
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

			if (my.t >= 200){
				return true;
			}
		}


	}