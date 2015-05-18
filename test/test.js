var fs = require('fs');
var stolper = require('../index.js');
var assert = require('assert');
var minify = require('html-minifier').minify;
var extend = require('extend');


var minifyOptions = {
  collapseWhitespace: true,
  conservativeCollapse: true
};


describe('Stolper', function(){
  describe('rendering of text posts', function(){

    var tests = [
      {d: 'with title', extend: {title: 'Lorem Ipsum Dolor Sit Amet'}, expect: '<h1>Lorem Ipsum Dolor Sit Amet</h1> Lorem ipsum dolor sit amet, consectetur adipisicing elit.'},
      {d: 'without title', extend: {}, expect: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'},
      {d: 'when title is null', extend: {title: null}, expect: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'}
    ];

    tests.forEach(function(test) {

      var dummycontent = {
        "posts": [{
            "type": "text",
            "body": "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          }]
      };

      extend(dummycontent.posts[0], test.extend);

      it('should work ' + test.d, function(done) {

        fs.readFile('./test/text/text.tumblr', {encoding: 'utf8'}, function(err, template) {
          if (err) throw err;

          stolper(template, dummycontent, function(html) {

            assert.equal(
              minify(html, minifyOptions),
              minify(test.expect, minifyOptions)
            );
            done();

          });
        });
      });
    });
  });

  describe('rendering of photo posts', function(){
    var tests = [
      {d: 'with caption', extend: {caption: 'Lorem Ipsum Dolor'}, expect: '<img src="500.jpg"> <p>Lorem Ipsum Dolor</p>'},
      {d: 'without captopn', extend: {}, expect: '<img src="500.jpg">'}
    ];

    tests.forEach(function(test){

      var dummycontent = {
        'posts': [{
          'type': 'photo',
          'photourl-500': '500.jpg'
        }]
      };

      extend(dummycontent.posts[0], test.extend);

      it('should work ' + test.d, function(done){

        fs.readFile('./test/photo/photo.tumblr', {encoding: 'utf8'}, function(err, template) {
          if (err) throw err;

          stolper(template, dummycontent, function(html) {

            assert.equal(
              minify(html, minifyOptions),
              minify(test.expect, minifyOptions)
            );
            done();

          });
        });

      });

    });
  });
});
