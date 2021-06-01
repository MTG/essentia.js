// UTILS

self.log = function (msg) {
    console.info('audio-worker info:', msg);
};
self.error = function (msg) {
    console.error('audio-worker error:', msg);
};

// INIT
import { EssentiaWASM } from './lib/essentia-wasm.module.js';
import Essentia from './lib/essentia.js-core.es.js';
import { PolarFFTWASM } from './lib/polarFFT.module.js';
log("Imports went OK");

let essentia = null;
let sampleRate = 44100;
let frameSize = 1024;
let hopSize = 512;

try {
    essentia = new Essentia(EssentiaWASM);
} catch (err) { error(err) }


// COMMS
onmessage = function listenToMainThread(msg) {
    switch (msg.data.request) {
        case 'analyse':
            log('received analyse cmd')
            // const signal = new Float32Array(msg.data.audio);
            essentiaAnalyse(msg.data.audio);
            break;
        case 'updateParams':
            if (msg.data.frameSize) { frameSize = msg.data.frameSize }
            else if (msg.data.hopSize) { hopSize = msg.data.hopSize }
            else if (msg.data.sampleRate) { sampleRate = msg.data.sampleRate }
            else { throw Error('audio-worker: unknown parameter in `updateParams` command') }
        default:
            error('Received message from main thread; no matching request found!')
    }
};



// AUDIO FUNCS
function essentiaAnalyse(signal) {
    let PolarFFT = new PolarFFTWASM.PolarFFT(frameSize);
    let frames = essentia.FrameGenerator(signal, frameSize, hopSize);

    let magnitudes = [];
    let phases = [];
    for (let i = 0; i < frames.size(); i++) {
        const currentFrame = frames.get(i);
        const windowed = essentia.vectorToArray(essentia.Windowing(currentFrame).frame);
        const polar = PolarFFT.compute(windowed); // default: normalized true, size 1024, type 'hann'
        magnitudes.push(essentia.vectorToArray(polar.magnitude));
        phases.push(essentia.vectorToArray(polar.phase));
    }
    frames.delete();
    log(magnitudes);
    log(phases);
}

/* 
    frames = essentia.FrameGenerator(signal, frameSize, hopSize)
    for (var i = 0; i < frames.size(); i++) {
        mag, phase = cartesianToPolar(FFT(essentia.Windowing(frames.get(i))))
        
    }
    frames.delete();
*/