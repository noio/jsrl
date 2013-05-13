console.log("IWASEXECUTED")

//:show {title:"Setup"}

ALPHA = 0.05
GAMMA = 0.9

//:end show

Q = new StateActionValueTable()
task = new BlockWorld(TESTWORLD)

//:edit {title:"Initialization"}
Q.fill(task.states(), task.actions(), 5.0)

//:end edit

console.log(Q)

for(var episode = 0; episode < 100; episode ++){
	var step = 0
	var path = []
	task.reset()
	while (!task.ended() ){
		var s = task.getState();
		var actions = Q.get(s)
		
		//:edit {title:"Action Selection"}
		var a = argmax(actions);
		//:end edit
		
		var r = task.act(a);
		var s_ = task.getState();

		//:edit {title:"Update"}
		Q.set(s, a, (1 - ALPHA) * Q.get(s, a) + ALPHA * (r + GAMMA * valmax(Q.get(s_))))
		//:end

		path.push(a)
		step ++
	}

	console.log(path)
}