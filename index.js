//-----------------------------------------------//
var gen = require('./gen.js')
//-----------------------------------------------//

var mazeExample = [
  [2, 1, 1, 1, 1, 3],
  [0, 0, 1, 0, 0, 0],
  [1, 0, 0, 0, 1, 1],
  [1, 1, 1, 0, 1, 0]
];


gen.main(mazeExample);


//LEGEND MAZE
//--------------
//Void : 0
//Wall: 1
//Starting point: 2
//Finish point: 3
//--------------