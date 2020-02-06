// Tests for essentia.js 

var chai = require('chai');
var ess = require('essentia.js');

describe('essentia.js', function() {
  // TODO: write more concise tests
  it('should sucessfully find all the essentia class and methods', function() {
    chai.assert.hasAllKeys(ess.Essentia, ['EssentiaJS', 
                                          'VectorFloat', 
                                          'VectorString', 
                                          'VectorDouble', 
                                          'VectorVectorFloat']);
  });

  // TODO: add more tests here
});
