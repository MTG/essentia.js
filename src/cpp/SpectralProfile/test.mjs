import { test } from 'mocha';
import { SpectralProfileWASM } from './builds/spectralProfile.module.js';
console.info('loaded extractor');

const sampleRate = 44100;
const duration = 3 * 60; // 3min in sec

const frameSize = 1024;
const hopSize = 512;

console.time('create-algo');
const SpectralProfile = new SpectralProfileWASM.SpectralProfile(frameSize, hopSize, "mean");
console.timeEnd('create-algo');
console.info('constructor init');

console.time('generate-input');
let testInputArray = new Float32Array(sampleRate * duration);
// testInputArray = testInputArray.map( el => Math.random() * 2 - 1 );
for (let i = 0; i < testInputArray.length; i++) {
    // faster than .map
    testInputArray[i] = Math.random() * 2 - 1;
}
console.time('arrayToVector test input');
const testInputVector = SpectralProfileWASM.arrayToVector(testInputArray);
console.timeEnd('arrayToVector test input');
console.timeEnd('generate-input');
console.info('test array converted to vector');
let profileVector = null;

try {
    console.time('algo-compute');
    profileVector = SpectralProfile.compute(testInputVector);
    console.timeEnd('algo-compute');
    console.info('compute call done');
} catch (err) {
    console.error('compute failed');
}

let profileArray = new Float32Array(frameSize + 1);

try {
    console.time('vectorToArray results');
    profileArray = SpectralProfileWASM.vectorToArray(profileVector);
    console.timeEnd('vectorToArray results');
    console.info('results vectorToArray');
} catch (err) {
    console.error('Wrong return data type');
    console.error(err);
    console.log({profileVector});
}

// Check output length
const correctType = profileArray instanceof Float32Array;
const correctLength = profileArray.length === frameSize/2 + 1;

if (correctType && correctLength) {
    console.log('1/1 Test passing!');
} else {
    console.log('1/1 Test failed.');
    console.log({correctType});
    console.log({correctLength});
}
