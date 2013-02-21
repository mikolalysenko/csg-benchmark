var $ = require("jquery-browserify");
$(document).ready(function() {
  var viewer = require("gl-shells").makeViewer({flatShaded: true});
  $.ajax("/bunny_rle.json").done(function(data) {
    viewer.updateMesh(data);
  });
});