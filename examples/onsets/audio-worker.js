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
import { OnsetsWASM } from './lib/onsets.module.js';
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
            essentiaAnalyse(msg.data.audio, frameSize, hopSize, ['hfc', 'complex_phase'], [0.8, 0.3]);
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
function essentiaAnalyse(signal, frameSize, hopSize, odfs, weights) {
    let PolarFFT = new PolarFFTWASM.PolarFFT(frameSize);
    let Onsets = new OnsetsWASM.Onsets(0.1, 5, sampleRate / hopSize, 0.02);
    let frames = essentia.FrameGenerator(signal, frameSize, hopSize);

    let odfArrays = {}; 
    for (const f of odfs) {
        odfArrays[f] = [];
    }
    
    for (let i = 0; i < frames.size(); i++) {
        let currentFrame = frames.get(i);

        let windowed = essentia.Windowing(currentFrame).frame;

        const polar = PolarFFT.compute(essentia.vectorToArray(windowed)); // default: normalized true, size 1024, type 'hann'
        // if (!seenPolar) { console.log(essentia.vectorToArray(polar.magnitude)); seenPolar = true; }
        for (const f of odfs) {
            odfArrays[f].push(essentia.OnsetDetection(
                essentia.arrayToVector(essentia.vectorToArray(polar.magnitude)), 
                essentia.arrayToVector(essentia.vectorToArray(polar.phase)), 
                f, sampleRate).onsetDetection);
        }

    }

    frames.delete();

    // create ODF matrix to be input to the Onsets algorithm
    let odfMatrix = [];
    for (const f of odfs) {
        odfMatrix.push(Float32Array.from(odfArrays[f]));
        delete odfArrays[f];
    }
    // console.info("odfMatrix: ", odfMatrix);
    const onsetPositions = Onsets.compute(odfMatrix, weights).positions;
    console.log("Onset positions: ", essentia.vectorToArray(onsetPositions));
}
