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

// Convert back to float32 array for FrameGenerator;
const audioData = essentia.vectorToArray(audioDownMixed);
// Create overlapping frames of the audio with given frameSize and hopSize
let frames = essentia.FrameGenerator(
    audioData, // audio data as float32 typed array
    2048, // frameSize
    1024 // hopSize
);

// Iterate through frames and compute ReplayGain feature
for (var i=0; i < frames.size(); i++) {
    // Compute RMS for each frame of downmixed audio signal
    let rms = essentia.RMS(
        frames.get(i), // audio frame vector
    ).rms;
    console.log("RMS: ", rms);
};

// delete frames from memmory
frames.delete();

// After the use of essentia.js
essentia.delete();
