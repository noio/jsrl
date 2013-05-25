// projector module
var projector = (function () {
  var my = {}

  var TAG_RE = new RegExp('\/\/\:(\\w+) ?(.*)');

  my.Projector = klass({

  initialize: function(container){
    this.descriptionarea = container.find('.description');
    this.editarea = container.find('.editor');
    this.productarea = container.find('.product');
    this.button = container.find('button.run')
    console.log(container);
    this.scriptblocks = [];
    this.editables = {};
    this.running = false;
  },

  /**
  * Load a notebook from a source path
  */
  load: function(src){
    console.log(src);
    // Request the source file
    $.ajax({
      url: src, 
      method: 'get',
      dataType: 'text',
      context: this,
      success: function(data){
        this.loads(data);
      }
    });
    return this;
  },

  /**
  * Load a notebook as a string
  */
  loads: function(s){
    this.clear();

    // First, find the description section.
    var dscrstart = s.indexOf('/*');
    var dscrend = s.indexOf('*/');

    this.descriptionarea.append(s.substring(dscrstart + 2, dscrend));
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

    var blocks = [], current = null, match = null
    var lines = s.split('\n');
    
    // Loop through lines of the source file, look for "//:" comments
    for (var i = 0; i < lines.length; i ++){
      if ((match = TAG_RE.exec(lines[i])) != null){
        if (current === null){
          current = match[1];
          var data = match[2];
          var start = i;
        }
        // Check if there is a (corresponding) end tag present
        else {
          if (match[1] != 'end') throw "Mismatching start/end indicators";
          blocks.push([current, start, i, data]);
          current = null;
        }
      }
    }

    // Loop through the found blocks and process them
    var added = 0;

    for (var i = 0; i < blocks.length; i ++){
      var before = lines.slice(added, blocks[i][1]).join("\n");
      var code = lines.slice(blocks[i][1]+1, blocks[i][2]).join('\n');
      
      data = JSON.parse(blocks[i][3]);

      this.scriptblocks.push(before);
      if (blocks[i][0] == 'show'){
        this.addBlock(code, data, false);
      } else if (blocks[i][0] == 'edit'){
        this.addBlock(code, data, true);
      }

      added = blocks[i][2] + 1;
    }
    this.scriptblocks = this.scriptblocks.concat( lines.slice(added) )

    this.button.on('click', $.proxy(function(event){
      this.toggleRun();
    }, this));

    $('<div>').addClass('block').appendTo(this.editarea).hide();

    this.runInit();

  },

  toggleRun: function(){
    console.log(this.running);
    if (!this.running){
      this.running = true;
      this.runScript();
      this.button.addClass('running').html('Stop');
      this.editarea.find('.block').fadeIn();
    } else {
      this.running = false;
      this.button.removeClass('running').html('Run');
      this.editarea.find('.block').fadeOut();
    }
  },

  /**
  * Clears the current pad content
  */
  clear: function(){
    this.scriptblocks = [];
    this.editors = [];
    this.editarea.empty();
    this.descriptionarea.empty()
    this.productarea.find('.panels').empty()
    this.productarea.find('.console').empty()
    this.productarea.find('.buttons').empty()
  },

  /**
  * Add an (editable) block to the notepad
  */
  addBlock: function(code, data, editable){
    this.editarea.append('<h4>'+data.title+'</h4>');
    this.scriptblocks.push(null);
    var cm = CodeMirror(this.editarea.get(0), {
      value: $.trim(code),
      mode: 'javascript',
      height: 'dynamic',
      readOnly: editable ? false : 'nocursor',
      lineNumbers: editable,
      lineWrapping: true,
    })
    for (var i = 0; i < cm.lineCount(); i ++){
      cm.indentLine(i);
    }
    this.editors.push({cm:cm, title: data.title });
  },

  script: function(){
    var s = '';
    var q = this.editors.slice(0);
    for (var i = 0; i < this.scriptblocks.length; i++){
      if (this.scriptblocks[i] === null){
        var next = q.shift();
        s = s + '\n//' + next.title + '\n'
        s = s + next.cm.getValue();
        s = s + '\n//end ' + next.title + '\n'
      } else {
        s = s + this.scriptblocks[i] + '\n';
      }
    }
    return s;
  },

  /**
  * Runs the function "run()" from the script, in a loop until that 
  * returns true.
  */ 
  runScript: function (){
    var console = {log: $.proxy(this.trace, this)}
    var projector = this;
    eval(this.script());
    first(this.scriptdata);

    var runs = 0;
    me = this;
    
    var loop = function(){
      var stop = run(me.scriptdata, runs);
      runs ++;
      me.productarea.find('.buttons button').attr('data-justclicked', false);
      if ((stop != true) && me.running) {
        me.loopTimeout = setTimeout(loop, 0);
      } else {
        me.toggleRun();
      }
    }
    loop()
    
  },

//   function loop(count, callback){
//   var counter = 0
//   var iteration = function(){
//     var cont = callback(counter)
//     counter ++;
//     if ((cont != false) && (count == null || counter < count)){
//       setTimeout(iteration, 0)
//     }
//   }
//   iteration();
// }

  /**
  * Runs the 'setup()' function from the script
  */
  runInit: function(){
    var console = {log: $.proxy(this.trace, this)}
    var projector = this;
    eval(this.script());
    this.scriptdata = {};
    setup(this.scriptdata);
  },

  /**
  * Prints to on-screen console and to browser console
  */
  trace: function(s){
    console.log(s);
    var c = this.productarea.find('.console')
    c.append('\n' + s);
    c.scrollTop(c[0].scrollHeight); //jquery for scrolling...
  },

  /**
  * Creates panels for output products
  */
  createpanels: function(spec){
    var total = 0;
    var panels = this.productarea.find('.panels');
    for (var i = 0; i < spec.length; i ++){
      total += spec[i];
    }
    return $.map(spec, $.proxy(function(el, idx){
      var h = panels.height() * el / total;
      var div = $('<div></div>').css({height: h, position: 'relative'}).appendTo(panels);
      return div;
    },this));
  },

  createbuttons: function(spec){
    var buttons = this.productarea.find('.buttons');
    var o = {}
    for (var i = 0; i < spec.length; i++){
      var button = $('<button>' + spec[i] + '</button>');
      button.on('click', function(){
        $(this).attr('data-justclicked', true);
      })
      buttons.append(button);
      o[spec[i]] = button;
    }
    return o;
  }

  });

  return my;    
})();
