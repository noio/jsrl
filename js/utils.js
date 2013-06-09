/**
* Some utility functions used in different places
*/



/**
* Opens a popup window with a html <table> containing given data
*/
function showDataTable(data, title){
    myWindow=window.open('',title,'width=100,height=800,top=40,left=40');
    var table = $('<table>');
    // var row = $('<tr>').appendTo(table);
    for (var i = 0; i < data.length; i++){
        table.append($('<tr>').append('<td>').html(data[i][1].toFixed(2)));
    }
    $(myWindow.document.body).append(table);
}

    

/** 
* Does what?
*/
function intervalPlot(canvas, n_tries, total_reward, standard_errors) {
    var keys = []
    var y_values1 = []
    var y_values2 = []
    var sems = []

    for (var key in n_tries) {
        keys.push(key)
        y_values1.push(n_tries[key])
        y_values2.push(total_reward[key] / n_tries[key])

		if(standard_errors != null)
		{
        	sems.push(standard_errors[key])
		} else {
			sems.push(0)
		}
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
        // yaxis: {min: 0, max: 1.2},
		// yaxis2: {min: 0}
		yaxes: [ {min:0, max:1},{min:0, max:200} ],
		legend: {position: "se"},
    };

    var data1 = []
    var data2 = []
    
	var bar_vars = {
		show: true,	
		color: { opacity: 0.5 },
		width: 0.5,		
	}
	
    var point_vars = {
        show: true, 
        radius:7.5,
		alpha: 0.9,
        errorbars: "y",
        yerr: {show: true, color: "red", upperCap: "-", lowerCap: '-'},
    }
	
    for (var i = 0; i < y_values1.length; i++) {
        data1.push([x_ticks[i][0] -0.5, y_values1[i]])
        data2.push([x_ticks[i][0], y_values2[i], sems[i]])
    }
    var data = [
				{data: data1, color: 'red', label:'k[a]', color: "rgba(255,0,0,0.5)", bars: bar_vars, yaxis: 2},
                {data: data2, color: 'green', label:'Q[a]', points: point_vars},
               ]

    $.plot(canvas, data, options);
}

