// Tests for essentia.js 

var chai = require('chai');
var esLib = require('essentiajs');

describe('essentia.js', function() {
  // TODO: write more concise tests
  it('should sucessfully find all the essentia class and methods', function() {
    chai.assert.hasAllKeys(esLib, ['EssentiaJS', 
                                   'VectorFloat', 
                                   'VectorString', 
                                   'VectorDouble', 
                                   'VectorVectorFloat']);
  });

  // TODO: add more tests here
});
