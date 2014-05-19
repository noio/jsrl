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
        table.append($('<tr>').append($('<td>').html(data[i][1].toFixed(2))));
    }
    console.log(table);
    $(myWindow.document.body).append(table);
}

function enumerate(array){
    var result = []
    for (var i = 0; i < array.length; i ++){
        result.push([i, array[i]])
    }
    return result;
}

/** 
* Plot a bar chart of action values and 
* counts and errors.
*/
function plotActions(canvas, Q, extra) {
    var actions, k = null, errors
    if (typeof extra == 'undefined'){
        extra = {}
    }
    
    if ('actions' in extra)
        actions = extra.actions
    else
        actions = Object.keys(Q);
    
    Q = $.map(actions, function(e){return Q[e]});

    if ('k' in extra)
        k = $.map(actions, function(e){return extra.k[e]});
    else
        k = null

    if ('errors' in extra)
        errors = $.map(actions, function(e){return extra.errors[e]});
    else
        errors = $.map(actions, function(e){return 0});

    if ('range' in extra)
        yrange = extra.range
    else
        yrange = {}

    // Create xticks
    var x_ticks = $.map(actions, function(e, idx){return [[idx, e]]});
    
    // Global options
    var options = {
        xaxis: {
            min: -0.5,
            max: actions.length-0.5,
            ticks: x_ticks
        },
        yaxes: [ yrange, {} ],
        legend: {position: "se"},
    };

    var data = []
    //k data
    if (k != null){
        data.push({
            data: enumerate(k),
            label: 'k[a]',
            color: "#7BBCF6",
            yaxis: 2,
            bars: {
                show: true,
                width: 0.5,
                align: "center"
            }
        })
    }

    // The main data (Q)
    var Qerr = [];
    for (var i = 0; i < Q.length; i++) {
        Qerr.push([i, Q[i], errors[i]])
    }


    data.push({ 
        data: Qerr,
        color: 'green',
        label: 'Q[a]',
        points: {
            show: true,
            radius: 7.5,
            errorbars: 'y',
            yerr: {show: true, color: "red", upperCap: '-', lowerCap: '-'}
        }
    });

    $.plot(canvas, data, options);
}