/**
* Some utility functions used in different places
*/

/**
* A suspended loop, tnx to: http://stackoverflow.com/q/16562221/224949
*/
function loop(count, callback, done) {
    var counter = 0;
    
    var next = function () {
        setTimeout(iteration, 0);
    };

    var iteration = function () {
        if (count == null || counter < count) {
            callback(counter, next);
        } else {
            done && done();
        }
        counter++;
    }
    
    iteration();
}
