/*

<h2>One Armed Bandits</h2>

<p>One Armed Bandits zijn gokautomaten
met één hendel.
Elke automaat keert een andere <em>gemiddelde</em> reward uit.
Stel dat er vier automaten zijn waar onze agent aan kan trekken,
we modelleren ze als vier verschillende acties: $$A := \{a_1, a_2, a_3, a_4\}$$

Elke bandit deelt met een proportie tussen 0 en 1 een reward van precies
één uit aan de hand van de functie \(R(a)\).
De verwachte reward voor elke bandit is dus gelijk aan deze proportie
en wordt gegeven door:
$$E[R(a)]$$

<p>Het doel van de agent binnen het n-armed bandit probleem is,
zoals in elke Reinfocrment Learning probleem, om zoveel mogelijk reward binnen te krijgen
in een beperkt aantal pogingen. De agent zal daarbij een afweging moeten
maken tussen <em>exploration</em> en <em>exploitation</em>:
je wilt zo goed mogelijk schatten hoeveel een bandit gemiddeld oplevert,
om een optimnale keuze te maken, maar tegelijkertijd zoveel mogelijk reward 
binnenhalen en dus geen tijd verdoen met 'slechte' automaten.</p>

<p>\({Q}(a)\) is een schatting van de verwachte reward \(E[R(a)]\),
namelijk de gemiddelde uitkering tot nu toe: de totale uitgekeerde reward
gedeeld door het \(k_a\) aantal keren dat je de automaat hebt uitgeprobeerd:

$$ {Q}(a) = \frac{r_1 + r_2 + \cdots + r_{k_a}}{k_a} $$

Een simpele manier om dit gemiddelde bij te houden, is deze iedere keer
dat je aan een hendel trekt iteratief aan te passen:

$${Q}(a) = {Q}(a) + \frac{1}{k_a + 1} \left[ r_{k+1} - {Q}(a) \right] $$

<p><strong>1a) Welke regel code van de 'update'-functie voert
deze formule uit?</strong></p>

<p><strong>1b) Probeer dit algoritme een paar keer uit: druk op 'Run' en dan op'play'
(eventueel kan je eerst een paar keer op step drukken, om rustig te zien wat er gebeurt). 
Wat valt je op aan de gemiddelde uitgekeerde reward na 300 pogingen?</strong></p>

<p>Iedere keer dat je het experiment opnieuw opstart, verandert de echte
verwachtingsreward \(E[R(a)]\) van de bandits</strong>. De uitkomst van de experimenten
is dus niet iedere keer precies hetzelfde, ookal zijn de instellingen hetzelfde.</p>

<p><strong>1c) Run hetzelfde experiment vijf keer en gebruik de 'get data'-functie
om de gemiddelde reward voor elke tijdstap te exporteren naar een spreadsheet
in Google Docs. Gebruik Google Docs om een grafiek te maken van de vijf experimenten.
Maak ook een grafiek van het gemiddelde over alle experimenten. Daarbij een paar tips:</p>
<p>Druk op get_data om een nieuw venster met de data te openen,
druk op ctrl+a om alles te selecteren, gebruik ctrl+c om alles te kopieren, ga naar je
spreadsheet en gebruik ctrl+v om de data te plakken. Tik in een cel '=AVERAGE(A1:E1)' 
om het gemiddelde uit te rekenen van alle cellen van A1 t/m E1).
Je kan een grafiek maken door een hele kolom te selecteren die je wilt
plotten (druk bijvoorbeeld op de 'F' boven de kolom) en vervolgens
'insert -> 'Chart' te doen)</strong></p>

<p>
De agent selecteert nu met een proportie van \((1 - \epsilon)\) bandit met het 
de hoogste gemiddelde opbrengst tot-nu-toe, dit is een 
<em>\(\epsilon\)-greedy</em> strategie:

$$\DeclareMathOperator*{\argmax}{\arg\!\max} \argmax_{n} {Q}(a_n) $$
</p>
<p><strong>2a) Wat denk je dat er gebeurt met de gemiddelde reward
als je epsilon groter of kleiner maakt? Hoe verhoudt epsilon zich
tot de <em>exploration</em>-<em>exploitation</em>-balans?</strong></p>
<p><strong>2b) Pas epsilon aan naar 0.1 en 0.5 en maak een gemiddelde
grafiek over 5 experimenten, net zoals in opdracht 1c. Wat valt gebeurt
er met de gemiddele opbrengst? Wat valt je op aan de grafieken van
Q(a) en k(a) rechtsonderin?</strong></p>

<p>Een probleem met de <em>\(\epsilon\)-greedy</em> strategie die
we tot nu toe gebruikt hebben, is 
dat in het begin van het experiment, als je \({Q}(a)\) nog
erg onnauwkeurig is door de weinige metingen, je nog
andere automaten wilt uitproberen (<em>exploren</em>), om de schattingen 
van hun verwachtte opbrengst zo goed mogelijk te krijgen, 
terwijl deze exploratie later alleen maar reward kost: je
weet al redelijk zeker welke bandit de hoogste payoff heeft.
Een mogelijke oplossing om de hoeveelheid exploratie van het aantal
trials af te laten hangen is <em>optimistic initialization</em>,
waarbij je de Q-functie onrealistisch optimistisch instelt.
Je action selection-algoritme zal in eerste instantie vooral bandits 
kiezen die deze nog niet eerder heeft gekozen, aangezien ze volgens
de \(Q(a)\)-functie zeer goed zouden moeten zijn. Naarmate ze
'tegen beginnen te vallen', zal de action-selection na een tijdje
alleen de optimale actie kiezen.
$$ \forall a [Q(a) = 5 ] $$

<p><strong>3) Implementeer de <em>optimistic initialization</em>-strategie
door in de <em>initialization</em>-functie de 'total_reward'-variabele op regel 3 
(<em>niet</em> de Q-tabel) optmistisch
te initaliseren met bijvoorbeeld \(\forall a [R_{total}(a) = 1 ] \) en
\(\forall a [R_{total} = 5] \). Wat valt je op aan de average reward-grafiek? 
Wat is een goede waarde om de tabel mee te initialiseren?
</strong></p>

</p>

Een andere oplossing is de <em>Epsilon-first</em> strategie,
waarin je de eerste \(n\) trials alleen maar random bandits
selecteert, en daarna altijd de bandit met de hoogste
gemiddelde opbrengst.</p>

<p><strong>4a) Implementeer de <em>Epsilon-first</em>,
doe dit door de eerste regel van de <em>Action Selection</em>-functie
aan te passen. Tip: het aantal steps dat je tot nu toe hebt
genomen zit in de variabele <em>my.t</em></strong></p>

<p><strong>4b) Draai nu een paar experimenten met een verschillend
aantal stappen (\(n\)) voor epsilon-first. Wat valt je
op aan de gemiddelde-reward grafiek? Wat is een goede 
\(n\)
om reward te optimaliseren?</strong></p>


<p>Een andere strategie is die van <em>Epsilon-decreasing</em>:
dan laat je de kans dat je agent een random actie doet afhangen van het aantal
steps. Je kan dit bijvoorbeeld doen door bij je update-functie
epsilon met een discount-proportie \(d\) kleiner dan 1 tevermenigvuldigen:
$$\epsilon_{t} = d \times\ \epsilon_{t-1}$$

Als je epsilon dan initialiseert op 1, is deze na 50 stappen
$$0.95^{50} = 0.07$$ en na 100 stappen $$0.95^{100} = 0.006$$.</p>

<p><strong>5a) Implementeer het <em>\(\epsilon\)-decreasing</em> algoritme.
Voeg aan de <em>Update</em>-functie een regel toe die
EPSILON instelt op 0.95 * EPSILON. Initialiseer EPSILON
op 1. Run een paar experimenten en vergelijk ze met de standaard
\(\epsilon\)-greedy strategie uit opdracht 1. Werk deze
strategie beter?</strong></p>

<p>Dit was les 1 van het practicum ga door naar <a href="#lesson02.js", onClick="window.location.hash='lesson02.js'; window.location.reload( true );">les 2</a>.</p>

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

		my.task.resetBandits()
		my.play = false;
		
		my.t = 0      // Number of plays
		my.R = 0      // Total Return (Sum(r_t))
		my.perf = []  // Array with performance data (average return)
		
		//:edit {"title":"Initialize"}
		EPSILON = 0.2	
		k =               {'N':0, 'S':0, 'W':0, 'E':0}
		total_reward =    {'N':0, 'S':0, 'W':0, 'E':0}
		Q =               {'N':0, 'S':0, 'W':0, 'E':0}
		
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
			var t = my.t;
			//:edit {"title":"Update"}
			k[a] += 1
			total_reward[a] += r
			Q[a] = total_reward[a] / k[a]
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
			intervalPlot(my.panels[2], k, total_reward)
			

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
