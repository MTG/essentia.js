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

// Optional: downmix stereo audio to mono
// We use MonoMixer algorithm from Essentia for that.
// We need to convert audio data into 
const audioLeftChannelData = essentia.arrayToVector(audio.channelData[0]);
const audioRightChannelData = essentia.arrayToVector(audio.channelData[1]);
const audioDownMixed = essentia.MonoMixer(audioLeftChannelData, audioRightChannelData).audio;


let danceability = essentia.Danceability(
    audioDownMixed, // audio frame vector
    8800, // maxTau
    310, // minTau
    audio.sampleRate // sampleRate
).danceability;

console.log("Danceability: ", danceability);

// After the use of essentia.js
essentia.delete();
