var fs = require('fs');
var chai = require('chai');
var esLib = require('../index');
const essentia = new esLib.Essentia(esLib.EssentiaWASM);
const inputType = 'noise track'; // 'audio file'
let durationSec;
let INPUT_AUDIO; // always VectorFloat

if (inputType === 'audio file') {
    let wav = require('node-wav');
    let buffer = fs.readFileSync('test/data/test.wav');
    let audio = wav.decode(buffer);
    durationSec = audio.channelData[0].length / audio.sampleRate;
    const audioLeftChannelData = essentia.arrayToVector(audio.channelData[0]);
    const audioRightChannelData = essentia.arrayToVector(audio.channelData[1]);
    INPUT_AUDIO = essentia.MonoMixer(audioLeftChannelData, audioRightChannelData).audio;
} else {
    // generate noise
    const sampleRate = 44100;
    durationSec = 180;
    let noise = new Float32Array(sampleRate * durationSec);
    // testInputArray = testInputArray.map( el => Math.random() * 2 - 1 );
    for (let i = 0; i < noise.length; i++) {
        // faster than .map
        noise[i] = Math.random() * 2 - 1;
    }
    INPUT_AUDIO = essentia.arrayToVector(noise);
}

console.info('Speed comparison of VectorFloat to Float32Array conversion');
console.info(`Test input: ${durationSec}s ${inputType}`);

console.time('regular vectorToArray');
let vectorToArrayOutput = essentia.vectorToArray(INPUT_AUDIO);
console.timeEnd('regular vectorToArray');

let vectorToArrayCppOutput;

try {
    console.time('vectorToArrayCpp');
    vectorToArrayCppOutput = essentia.vectorToArrayCpp(INPUT_AUDIO);
    console.timeEnd('vectorToArrayCpp');
} catch (err) {
    console.error(err);
    console.log('either "vectorToArray" does not exist, or it does not work with essentia.js arrayToVector');
}

if (vectorToArrayCppOutput && (vectorToArrayOutput.length == vectorToArrayCppOutput.length)) {
    console.info('Comparing contents of converted arrays...');
    for (let i = 0; i < vectorToArrayOutput.length; i++) {
        if (vectorToArrayOutput[i] !== vectorToArrayCppOutput[i]) {
            console.error('Failed! Arrays are NOT equal!');
            break;
        }
    }
    console.info('Success! Arrays are equal!');
}