//
var fs = require('fs');
var chai = require('chai');
var esLib = require('../index');
const extractor = new esLib.EssentiaModel.EssentiaTFInputExtractor(esLib.EssentiaWASM, "musicnn");

let wav = require('node-wav');
let buffer = fs.readFileSync('test/data/test.wav');
let audio = wav.decode(buffer);
console.log(audio.sampleRate);
let features = null;

const tf = require('@tensorflow/tfjs-node');
const modelPATH = "file://./test/data/models/msd-musicnn-1/model.json";
let musicnn = new esLib.EssentiaModel.TensorflowMusiCNN(tf, modelPATH);

describe('essentia.js-model', function() {

    it('should sucessfully run Essentia Tensorflow feature input extractor for a single frame of audio with 512 framesize.', function() {
      
      feature = extractor.compute(audio.channelData[0].slice(0, 512), 256);
      chai.expect(feature).to.have.all.keys([
        'melSpectrum',
        'patchSize',
        'frameSize',
        'melBandsSize'
      ]);
    });

    it('should sucessfully run Essentia Tensorflow feature input extractor for a whole audio file.', function() {
      
      features = extractor.computeFrameWise(audio.channelData[0].slice(0, 16000));
      chai.expect(features).to.have.all.keys([
        'melSpectrum',
        'patchSize',
        'frameSize',
        'melBandsSize'
      ]);
    });

    it('should sucessfully do prediction of TensorflowMusiCNN model using the pre-computed feature input with zero-padding.', function() {
      
      // No callback needs to be passed to use Promises with .then =>.
      musicnn
      .initialize()
      .then(() => musicnn.predict(features, true))
      .then((results) => {
        // Do something with the results
        // console.log(results);
        chai.expect(results).to.be.an('array');
      }); 
    });

  });
  