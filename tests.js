var testing = require('testing');
var helper = require("./index.js");
var Q = require("q");

function add(i, j) {
    return i+j;
}


function simple(callback) {
  helper.batchExecute(add, [[1,2]], 1).then((results) => {
      testing.assertEquals(results.length, 1, "One result is returned.", callback);
      testing.assertEquals(results[0].state, true, "One result is returned.", callback);
      testing.assertEquals(results[0].value, 3, "correct result is returned.", callback);
      testing.success(callback);
  }, (error) => {
      testing.failure(error, callback);
  });
}

function two(callback) {
  helper.batchExecute(add, [[1,2],[4,5]], 1).then((results) => {
      console.log(JSON.stringify(results));
      testing.assertEquals(results.length, 2, "two results are returned.", callback);
      testing.assertEquals(results[0].state, true, "One result is returned.", callback);
      testing.assertEquals(results[0].value, 3, "correct result is returned.", callback);
      
      testing.assertEquals(results[1].state, true, "One result is returned.", callback);
      testing.assertEquals(results[1].value, 9, "correct result is returned.", callback);
      
      
      testing.success(callback);
  }, (error) => {
      testing.failure(error, callback);
  });
}

/**
     * Run package tests.
     */
    exports.test = function(callback)
    {   
        var tests = [
            simple,
            two
        ];
        testing.run(tests, callback);
    };  
        
    // run tests if invoked directly 
    if (__filename == process.argv[1])
    {   
        exports.test(testing.show);
    }