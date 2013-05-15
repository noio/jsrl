/**
* Some utility functions used in different places
*/
function loop(count, callback){
	var counter = 0
	var iteration = function(){
		var cont = callback(counter)
		counter ++;
		if ((cont != false) && (count == null || counter < count)){
			setTimeout(iteration, 0)
		}
	}
	iteration();
}