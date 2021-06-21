// Tests for essentia.js 
// Unit tests were not done each algorithms since they were already passed tested on C++ upstream repo
// However, in future we also need to check it is working consistenly on the web-end as well.
// Another set of tests should be related with testing regression of few selected feature extractors with their corresponding C++ ones.

var fs = require('fs');
var chai = require('chai');
var esLib = require('../index');
const essentia = new esLib.Essentia(esLib.EssentiaWASM);

let wav = require('node-wav');
let buffer = fs.readFileSync('test/data/test.wav');
let audio = wav.decode(buffer);
const audioLeftChannelData = essentia.arrayToVector(audio.channelData[0]);
const audioRightChannelData = essentia.arrayToVector(audio.channelData[1]);
const audioDownMixed = essentia.MonoMixer(audioLeftChannelData, audioRightChannelData).audio;


describe('essentia.js-core', function() {

  it('should sucessfully find all the classes in the main essentia package', function() {
    chai.expect(esLib).to.have.all.keys([
      'EssentiaWASM',
      'Essentia',
      'EssentiaModel',
      'EssentiaExtractor',
      'EssentiaPlot'
    ]);
  });

  it('should sucessfully find all the import methods of essentia.js instance', function() {
    chai.expect(essentia).to.have.any.keys([
      'EssentiaWASM',
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
  // Also write regression test for feature extractors comparing using C++, Python and JS interface.
});
