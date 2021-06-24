// A simple Node.js example of using essentia.js for feature extraction.
// Run `node main.js`

var fs = require('fs');
var esLib = require('essentia.js');
const essentia = new esLib.Essentia(esLib.EssentiaWASM);
console.log("essentia.js version: ", essentia.version);

let wav = require('node-wav');
let buffer = fs.readFileSync('../../test/data/test.wav');
// Decode wav audio file using node-wav package
let audio = wav.decode(buffer);
// Convert audio data into VectorFloat type
const audioLeftChannelData = essentia.arrayToVector(audio.channelData[0]);
const audioRightChannelData = essentia.arrayToVector(audio.channelData[1]);
// Downmix stereo audio to mono
const audioDownMixed = essentia.MonoMixer(audioLeftChannelData, audioRightChannelData).audio;

// Create overlapping frames of the audio with given frameSize and hopSize
let frames = essentia.FrameGenerator(audioDownMixed,
    1024, // frameSize
    512 // hopSize
);

// Iterate through frames and compute danceability feature
for (var i=0; i < frames.size(); i++) {
    let danceability = essentia.Danceability(frames.get(i)).danceability;
    console.log("Danceability: ", danceability);
};
// delete frames from memmory
frames.delete();

// After the use of essentia.js
essentia.delete();
