var fs = require('fs');

var postTypes = [
  'Text',
  'Photo',
  'Panorama',
  'Photoset',
  'Quote',
  'Link',
  'Chat',
  'Audio',
  'Video',
  'Answer'
];

module.exports = function(template, dummydata, callback) {
  html = [];

  var parts = template.split(/(\{.*?\})/);
  var context = [];

  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];


    if (part !== '') {

      if (/\{block:.*\}/.test(part)) {
        var blockname = (/\{block:(.*)\}/.exec(part))[1];
        context.push(blockname.toLowerCase());

        if (blockname === 'Posts') {
          var endblock = parts.indexOf('{/block:Posts}', i);
          var relevantParts = parts.slice(i + 1, endblock);

          doPosts(relevantParts, dummydata, html);

          i = endblock;
        }

      } else if (/\{\/block:.*\}/.test(part)) {
        context.pop();

      } else if (/\{.*\}/.test(part)) {
        var variable = (/\{(.*)\}/.exec(part))[1];

        html.push(
          getVarForContext(variable, context, dummydata)
        );

      } else {
        html.push(part);
      }

    }

  }

  callback(html.join(''));

};

function blockShouldDisplay(blockname, context, data) {
  blockname = blockname.toLowerCase();
  if (blockname in data) {
    if (data[blockname] === null) {
      return false;
    } else {
      return true;
    }

  } else {
    return false;
  }

}

function getVarForContext(variable, context, data) {
  return data[variable.toLowerCase()];
};

function doPosts(parts, data, html) {
  for (var i = 0; i < data.posts.length; i++) {
    var post = data.posts[i];
    var context = []; // reset local context


    for (var j = 0; j < parts.length; j++) {
      var part = parts[j];

      if (/\{block:.*\}/.test(part)) {
        var blockname = (/\{block:(.*)\}/.exec(part))[1];

        if (postTypes.indexOf(blockname) !== -1) {

          if (post.type === blockname.toLowerCase() || context.length >= 1) {
            // push context
            context.push(blockname.toLowerCase());
          } else {
            // skip wrong types
            var endblock = parts.indexOf('{/block:' + blockname + '}', j);
            j = endblock;
          }

        } else {

          if (!blockShouldDisplay(blockname, context, post)) {
            var endblock = parts.indexOf('{/block:' + blockname + '}', j);
            j = endblock;
          }

        }


      } else if (/\{\/block:.*\}/.test(part)) {
        context.pop();

      } else if (/\{.*\}/.test(part)) {
        var variable = (/\{(.*)\}/.exec(part))[1];
        html.push(
          getVarForContext(variable, context, post)
        )

      } else {
        html.push(part);
      }


    }
  }

}
