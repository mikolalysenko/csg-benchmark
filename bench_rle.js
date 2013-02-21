var rasterize = require("rle-rasterize");
var csg = require("rle-csg");
var bunny = require("bunny");
var normals = require("normals");
var numeric = require("numeric");

var SCALE = +process.argv[2] || 8.0;

var shift_bun = new Array(bunny.positions.length);
(function() {
  for(var i=0; i<shift_bun.length; ++i) {
    shift_bun[i] = bunny.positions[i].slice(0);
    shift_bun[i][0] += 2.0;
  }
})();

numeric.muleq(bunny.positions, SCALE);
numeric.muleq(shift_bun, SCALE);

//console.log("Voxelizing...");
var vstart = new Date();
var bunny1 = rasterize(bunny.cells, bunny.positions);
var bunny2 = rasterize(bunny.cells, shift_bun);
var vstop = new Date();
//console.log("Voxelize time = ", vstop - vstart);

var start = new Date();
var merged = csg.intersect(bunny1, bunny2);
var stop = new Date();

var mstart = new Date();
var result = require("rle-mesh")(merged);
var mstop = new Date();

numeric.muleq(result.positions, 1.0/SCALE);

result.voxelize_time = vstop - vstart;
result.merge_time = stop - start;
result.mesh_time = mstop - mstart;

console.log(JSON.stringify(result));
