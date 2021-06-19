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

const allowedParams = ['sampleRate', 'frameSize', 'hopSize', 'odfs', 'odfsWeights'];
let params = {
    sampleRate: 44100,
    frameSize: 1024,
    hopSize: 512,
    odfs: ['hfc'], // Onset Detection Function(s) list
    odfsWeights: [1] // per ODF weights list
}; // changing odfs should require changing odfsWeights (at least length), and viceversa

try {
    essentia = new Essentia(EssentiaWASM);
} catch (err) { error(err) }


// COMMS
onmessage = function listenToMainThread(msg) {
    switch (msg.data.request) {
        case 'analyse':
            log('received analyse cmd')
            // const signal = new Float32Array(msg.data.audio);
            const onsetPositions = essentiaAnalyse(msg.data.audio, params.frameSize, params.hopSize, params.odfs, params.odfsWeights);
            postMessage(onsetPositions);
            break;
        case 'updateParams':
            let suppliedParamList;
            if (msg.data.params) {
                suppliedParamList = Object.keys(msg.data.params);
                // check obj properties are included in allowed params
                if (paramsAreAllowed(suppliedParamList)) {
                    let update = msg.data.params;

                    odfParamsAreOkay(suppliedParamList, update);

                    params = {...params, ...update}; // update existing params obj
                    log(`updated the following params: ${suppliedParamList.join(',')}`);
                    log('current params are: ');
                    console.info(params);
                } else {
                    error(`audio-worker: illegal parameter(s) in 'updateParams' command \n - ${getUnsupportedParams(suppliedParamList).join('\n - ')}`);
                }
            } else {
                error('audio-worker: missing `params` object in the `updateParams` command');
            }
            break;
        default:
            error('Received message from main thread; no matching request found!');
            break;
    }
};



// AUDIO FUNCS
function essentiaAnalyse(signal, frameSize, hopSize, odfs, weights) {
    let PolarFFT = new PolarFFTWASM.PolarFFT(frameSize);
    let Onsets = new OnsetsWASM.Onsets(0.1, 5, params.sampleRate / hopSize, 0.02);
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
                f, params.sampleRate).onsetDetection);
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
    // check possibly all zeros onsetPositions
    if (onsetPositions.size() == 0) { return new Float32Array(0) }
    else { return essentia.vectorToArray(onsetPositions); }
}

// UTILS

function paramsAreAllowed (paramsList) {
    return paramsList.every( (p) => allowedParams.includes(p) );
}

function getUnsupportedParams (paramsList) {
    return paramsList.filter( (p) => !allowedParams.includes(p) );
}

function odfParamsAreOkay (paramList, paramValues) {
    if ( ['odfs', 'odfsWeights'].some((p) => paramList.includes(p)) ) {
        let bothOnsetParamsChanged = ['odfs', 'odfsWeights'].every( (p) => paramList.includes(p) );
        if (bothOnsetParamsChanged) {
            let onsetParamsAreEqualLength = paramValues.odfs.length == paramValues.odfsWeights.length;
            if (onsetParamsAreEqualLength) { return 0 }
            else { error('make sure `odfs` and `odfsWeights` are equal length, i.e. provide the same number of weights as ODF methods') }
        } else {
            error('always update both `odfs` and `odfsWeights` params');
        }
    } else {
        return 0;
    }
}