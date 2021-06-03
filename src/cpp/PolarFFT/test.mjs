import { PolarFFTWASM } from './builds/polarFFT.module.js';

const frameSize = 16;
const outFrameSize = frameSize/2 + 1;
const polarFFT = new PolarFFTWASM.PolarFFT(frameSize);

const testInputArray = new Float32Array(16);
testInputArray.forEach( (_, idx) => testInputArray[idx] = Math.random() * 2 - 1 );
const testInputVector = PolarFFTWASM.arrayToVector(testInputArray);

const polar = polarFFT.compute(testInputVector);

// Probably throw errors if wrong output type
try {
    var mags = PolarFFTWASM.vectorToArray(polar.magnitude);
    var phases = PolarFFTWASM.vectorToArray(polar.phase);
} catch (err) {
    console.error('vectorToArray failed: ', err);
}

// Check output length
const magCorrectLength = mags.length === outFrameSize;
const phaseCorrectLength = phases.length === outFrameSize;
if (magCorrectLength && phaseCorrectLength) {
    console.log('magnitudes: ', mags);
    console.log('phases: ', phases);
    console.log('Test passing!');
} 