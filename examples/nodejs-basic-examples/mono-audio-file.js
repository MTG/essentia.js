// A simple Node.js example of using essentia.js for feature extraction.
// Install dependencies 
// Run `node main.js`
var fs = require('fs');
let wav = require('node-wav');
var esLib = require('essentia.js');

const essentia = new esLib.Essentia(esLib.EssentiaWASM);
console.log("essentia.js version: ", essentia.version);

let buffer = fs.readFileSync('../../test/data/test.wav');
// Decode wav audio file using node-wav package
let audio = wav.decode(buffer);

// Assuming your input audio file is in Mono
const audioVector = essentia.arrayToVector(audio.channelData[0])

let danceability = essentia.Danceability(
    audioVector, // audio data
    8800, // maxTau
    310, // minTau
    audio.sampleRate // sampleRate
).danceability;

console.log("Danceability: ", danceability);

// After the use of essentia.js
essentia.delete();
