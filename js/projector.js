// This looks really weird, but this is to not pollute the namespace, and
// create a 'module': http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
var projector = (function () {
  var my = {}

  var TAG_RE = new RegExp('\/\/\:(\\w+) ?(.*)');

  my.Projector = $.klass({

  initialize: function(editor, screen){
    this.script = [];
    this.editables = {};
  },

  load: function(src){
    console.log(src);
    // Request the source file
    $.ajax({
      url: src, 
      method: 'get',
      type: 'text',
      success: $.bind(this, function(r){
        var blocks = [], current = null, start, match, data
        var lines = r.responseText.split('\n');
        
        // Loop through lines of the source file, look for "//:" comments
        for (var i = 0; i < lines.length; i ++){
          if ((match = TAG_RE.exec(lines[i])) != null){
            if (current === null){
              current = match[1];
              data = match[2];
              start = i;
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
        this.script = [];
        var added = 0;

        for (var i = 0; i < blocks.length; i ++){
          this.script = this.script.concat( lines.slice(added, blocks[i][1]) );
          console.log(blocks[i][3])
          data = JSON.parse(blocks[i][3]);
          code = lines.slice(blocks[i][1]+1, blocks[i][2]).join('\n')

          if (blocks[i][0] == 'show'){
            this.script.push(code);
            $('#main').append('<h4>'+data.title+'</h4>')
            $('#main').append('<code>'+code+'</code>')
          } else if (blocks[i][0] == 'edit'){
            $('#main').append('<h4>'+data.title+'</h4>')
            $('#main').append('<textarea>'+code+'</textarea>')
          }

          added = blocks[i][2] + 1;
        }
        this.script = this.script.concat( lines.slice(added) )

        this.script = this.script.join("\n")
      })
    });
    return this;
  }

  });

  return my;    
})();


/* Load up a template file */

a = new projector.Projector().load('js/lessons/lesson01.js')
console.log(a.script)
