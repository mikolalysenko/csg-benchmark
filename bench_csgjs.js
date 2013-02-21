var CSG = require("./csg.js");
var bunny = require("bunny");
var normals = require("normals");


var shift_bun = new Array(bunny.positions.length);
(function() {
  for(var i=0; i<shift_bun.length; ++i) {
    shift_bun[i] = bunny.positions[i].slice(0);
    shift_bun[i][0] += 2.0;
  }
})();


//Boxes a mesh into CSG.js custom data structures
function mesh2csg(cells, positions) {
  var polys = [];
  var vnormals = normals.vertexNormals(cells, positions);
  for(var i=0; i<cells.length; ++i) {
    var c = cells[i];
    var chain = [];
    for(var j=0; j<c.length; ++j) {
      chain.push(new CSG.Vertex(new CSG.Vector(positions[c[j]]), new CSG.Vector(positions[c[j]])));
    }
    polys.push(new CSG.Polygon(chain));
  }
  return CSG.fromPolygons(polys);
}

function csg2mesh(csg) {
  var cells = [];
  var positions = [];
  for(var i=0; i<csg.polygons.length; ++i) {
    var p = csg.polygons[i];
    var nf = new Array(p.vertices.length);
    for(var j=0; j<p.vertices.length; ++j) {
      nf[j] = positions.length;
      var vv = p.vertices[j].pos;
      positions.push([vv.x, vv.y, vv.z]);
    }
    cells.push(nf);
  }
  return {cells: cells, positions: positions};
}


var cstart = new Date();
var bunny1 = mesh2csg(bunny.faces, bunny.positions);
var bunny2 = mesh2csg(bunny.faces, shift_bun);
var cstop = new Date();


var start = new Date();
var result = bunny1.intersect(bunny2);
var stop = new Date();

var result = csg2mesh(result);

result.construct_time = cstop - cstart;
result.intersect_time = stop - start;

console.log(JSON.stringify(result));
