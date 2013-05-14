

// This looks really weird, but this is to not pollute the namespace, and
// create a 'module': http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
var projector = (function () {
  var my = {}

  var TAG_RE = new RegExp('\/\/\:(\\w+) ?(.*)');

  my.Projector = klass({

  initialize: function(descriptionarea, editarea, productarea){
    this.descriptionarea = descriptionarea;
    this.editarea = editarea;
    this.productarea = productarea;
    this.scriptblocks = [];
    this.editables = {};
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

    $('<button>Run</button>').appendTo(this.editarea).on('click', $.proxy(function(event){
      this.runscript();
    }, this));

    this.runinit();

  },

  /**
  * Clears the current pad content
  */
  clear: function(){
    this.scriptblocks = [];
    this.editors = [];
    this.editarea.empty();
    this.descriptionarea.empty()
    this.productarea.find('#panels').empty()
    this.productarea.find('#console').empty()
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
  * Runs the function "run()" from the script.
  */ 
  runscript: function (){
    var console = {log: $.proxy(this.trace, this)}
    var projector = this;
    eval(this.script());
    run(this.scriptdata);
  },

  /**
  * Runs the 'initialize()' function from the script
  */
  runinit: function(){
    var console = {log: $.proxy(this.trace, this)}
    var projector = this;
    eval(this.script());
    this.scriptdata = initialize();
  },

  /**
  * Prints to on-screen console and to browser console
  */
  trace: function(s){
    console.log(s);
    var c = this.productarea.find('#console')
    c.append('\n' + s);
    c.scrollTop(c[0].scrollHeight); //jquery for scrolling...
  },

  /**
  * Creates panels for output products
  */
  createpanels: function(spec){
    var total = 0;
    var panels = this.productarea.find('#panels');
    for (var i = 0; i < spec.length; i ++){
      total += spec[i];
    }
    return $.map(spec, $.proxy(function(el, idx){
      var h = panels.height() * el / total;
      var div = $('<div></div>').css({height: h, position: 'relative'}).appendTo(panels);
      return div;
    },this));
  }


  });

  return my;    
})();


/* Load up a template file */
$(document).ready(function(){
  a = new projector.Projector($('#description'), $('#main'), $('#product')).load('js/lessons/lesson01.js');
});
