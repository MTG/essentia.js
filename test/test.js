// Tests for essentia.js 
// Unit tests were not done each algorithms since they were already passed tested on C++ upstream repo
// However, in future we also need to check it is working consistenly on the web-end as well.

var chai = require('chai');
var esLib = require('../index');

describe('essentia.js', function() {
  it('should sucessfully find all the import methods of essentia.js instance', function() {
    chai.expect(esLib).to.have.any.keys([
      'EssentiaModule',
      'algorithms',
      'algorithmNames',
      'version',
      'reinstantiate',
      'shutdown',
      'delete',
      'vectorToArray',
      'arrayToVector',
      'VectorInt',
      'VectorFloat', 
      'VectorString', 
      'VectorDouble', 
      'VectorVectorFloat'
    ]);
  });
  // TODO: add more tests for testing the library on various web platforms.
  // Also regression test for feature extractors comparing using C++, Python and JS interface.
});
