ALPHA = 0.05
GAMMA = 0.9

Q = new StateActionValueTable()
task = new BlockWorld(TESTWORLD)


Q.fill(task.states(), task.actions(), 5.0)

console.log(Q)

for(var episode = 0; episode < 100; episode ++){
	var step = 0
	var path = []
	task.reset()
	while (!task.ended() ){
		var s = task.getState();
		var actions = Q.get(s)
		var a = argmax(actions);
		var r = task.act(a);
		var s_ = task.getState();
		Q.set(s, a, (1 - ALPHA) * Q.get(s, a) + ALPHA * (r + GAMMA * valmax(Q.get(s_))))

		path.push(a)
		step ++
	}

	console.log(path)
}