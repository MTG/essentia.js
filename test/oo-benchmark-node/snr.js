let esLib = require('../../index');
const essentia = new esLib.Essentia(esLib.EssentiaWASM);
let snrModule = require('../../src/cpp/SNR/snr.umd.js');
let fs = require('fs');
let path = require('path');
const wav = require('node-wav');
let Benchmark = require('benchmark');
const process = require('process');

const FRAME_SIZE = 2048;
const HOP_SIZE = 1024;
const audioFilePath = path.join(__dirname, '..','data', 'mozart_c_major_30sec.wav');
var options = {};
if (process.argv[2] !== undefined){
  options = {
    minSamples: process.argv[2],
    initCount: 1,
    minTime: -Infinity,
    maxTime: -Infinity,
  };
}

snrModule.bootEssentia();
console.log('essentia::init successfully');
const frameGenOO = new snrModule.FrameGenerator(FRAME_SIZE, HOP_SIZE);
const snrOO = new snrModule.SNR(0.95, 0.98, 0.9, FRAME_SIZE, -40, 44100, true);

let stdCounter = 0;

function compareOutputValues(frames, framesOO) {
  const snrOut = {
    instantSNR: [],
    averagedSNR: [],
    spectralSNR: []
  };

  const snrOutOO = {
    instantSNR: [],
    averagedSNR: [],
    spectralSNR: []
  };

  for (var i = 0; i < frames.size(); i++){
    let tempOut = essentia.SNR( frames.get(i) , 0.95, 0.98, 0.9, FRAME_SIZE);
    snrOut.instantSNR.push(tempOut.instantSNR);
    snrOut.averagedSNR.push(tempOut.averagedSNR);
    snrOut.spectralSNR.push( essentia.vectorToArray(tempOut.spectralSNR) );
  }

  for (var i = 0; i < framesOO.size(); i++){
    let tempOut = snrOO.compute( framesOO.get(i) );
    snrOutOO.instantSNR.push(tempOut.instantSNR);
    snrOutOO.averagedSNR.push(tempOut.averagedSNR);
    snrOutOO.spectralSNR.push( snrModule.vectorToArray(tempOut.spectralSNR) );
  }

  console.log('Showing instantSNR outputs...');
  console.log('Essentia SNR output: ', snrOut.instantSNR.slice(100));
  console.log('Object-oriented SNR output: ', snrOutOO.instantSNR.slice(100));
}

fs.readFile(audioFilePath, (err, data) => {
  if (err) throw err;
  let result = wav.decode(data);
  const audioBuffer = result.channelData[0];
  
  const frames = essentia.FrameGenerator(audioBuffer, FRAME_SIZE, HOP_SIZE);
  const framesOO = frameGenOO.compute(audioBuffer);

  const suite = new Benchmark.Suite('SNR');
  
  // add tests
  suite.add('Essentia#SNR', () => {
    console.log(`std snr run ${stdCounter}`);
    for (var i = 0; i < frames.size(); i++){
      essentia.SNR( frames.get(i) , 0.95, 0.98, 0.9, FRAME_SIZE);
    }
    stdCounter++;
  }, options);

  suite.add('Essentia-OO#SNR', () => {
    for (var i = 0; i < framesOO.size(); i++){
      snrOO.compute( framesOO.get(i) );
    }
  }, options);

  // add listeners
  suite.on('cycle', function(event) {
    console.log(String(event.target));
  });
  
  suite.on('complete', function() {
    // console.log(this);
    console.log('Fastest is ' + this.filter('fastest').map('name'));
    
    const resultsObj = {
      "essentia": {
        "mean": this[0].stats.mean,
        "moe": this[0].stats.moe,
        "rme": this[0].stats.rme,
        "sem": this[0].stats.sem,
        "deviation": this[0].stats.deviation,
        "variance": this[0].stats.variance,
        "execution times": this[0].stats.sample,
        "cycle": this[0].times.cycle,
        "elapsed": this[0].times.elapsed,
        "period": this[0].times.period,
        "timeStamp": this[0].times.timeStamp,
        "count": this[0].count,
        "cycles": this[0].cycles,
        "hz": this[0].hz
      },
      "essentia-object-oriented": {
        "mean": this[1].stats.mean,
        "moe": this[1].stats.moe,
        "rme": this[1].stats.rme,
        "sem": this[1].stats.sem,
        "deviation": this[1].stats.deviation,
        "variance": this[1].stats.variance,
        "execution times": this[1].stats.sample,
        "cycle": this[1].times.cycle,
        "elapsed": this[1].times.elapsed,
        "period": this[1].times.period,
        "timeStamp": this[1].times.timeStamp,
        "count": this[1].count,
        "cycles": this[1].cycles,
        "hz": this[1].hz
      }
    }
    var json = JSON.stringify(resultsObj);
    fs.writeFile('snr.json', json, 'utf8', function (err) {
      if (err) {
        console.log("An error occured while writing SNR JSON Object to File.");
        return console.log(err);
      }
      
      console.log("SNR JSON file has been saved.");
    });
  });
  console.log('ready to run suite...');
  // run async
  suite.run({ 'async': true });

  console.log('Comparing output values...');
  compareOutputValues(frames, framesOO);
});