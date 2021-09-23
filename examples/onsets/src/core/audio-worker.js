// UTILS

self.log = function (msg) {
    console.info('audio-worker info:', msg);
};
self.error = function (msg) {
    throw Error(`audio-worker error: \n ${msg}`);
};

// INIT
import { Essentia, EssentiaWASM } from 'essentia.js';
// import Essentia from './lib/essentia.js-core.es.js';
import { PolarFFTWASM } from './lib/polarFFT.module.js';
import { OnsetsWASM } from './lib/onsets.module.js';
log("Imports went OK");

self.essentia = null;

self.allowedParams = ['sampleRate', 'frameSize', 'hopSize', 'odfs', 'odfsWeights'];
self.params = {
    sampleRate: 44100,
    frameSize: 1024,
    hopSize: 512,
    odfs: ['hfc'], // Onset Detection Function(s) list
    odfsWeights: [1] // per ODF weights list
}; // changing odfs should require changing odfsWeights (at least length), and viceversa
self.polarFrames = null;

// log(EssentiaWASM);
try {
    self.essentia = new Essentia(EssentiaWASM.EssentiaWASM);
} catch (err) { error(err) }


// COMMS
onmessage = function listenToMainThread(msg) {
    switch (msg.data.request) {
        case 'analyse':
            log('received analyse cmd')
            // const signal = new Float32Array(msg.data.audio);
            preAnalysis(msg.data.audio);
            const onsetPositions = onsetsAnalysis();

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

                    self.params = {...self.params, ...update}; // update existing params obj
                    log(`updated the following params: ${suppliedParamList.join(',')}`);
                    log('current params are: ');
                    console.info(self.params);

                    if (self.polarFrames !== null && self.polarFrames.length !== 0) {
                        // updateParams after file upload
                        const onsetPositions = onsetsAnalysis();
                        postMessage(onsetPositions);
                    } // else: file hasn't been uploaded and analysed for 1st time, or it has been cleared
                } else {
                    error(`audio-worker: illegal parameter(s) in 'updateParams' command \n - ${getUnsupportedParams(suppliedParamList).join('\n - ')}`);
                }
            } else {
                error('audio-worker: missing `params` object in the `updateParams` command');
            }
            break;
        case 'clear':
            console.info('audio worker state and saved analysis should be cleared');
            break;
        default:
            error('Received message from main thread; no matching request found!');
            break;
    }
};



// AUDIO FUNCS

function preAnalysis (signal) {
    self.polarFrames = []; // clear frames from previous computation
    // algo instantiation
    let PolarFFT = new PolarFFTWASM.PolarFFT(self.params.frameSize);
    // frame cutting, windowing
    let frames = self.essentia.FrameGenerator(signal, self.params.frameSize, self.params.hopSize);

    for (let i = 0; i < frames.size(); i++) {
        let currentFrame = frames.get(i);
        
        let windowed = self.essentia.Windowing(currentFrame).frame;
        
        // PolarFFT
        const polar = PolarFFT.compute(self.essentia.vectorToArray(windowed)); // default: normalized true, size 1024, type 'hann'
        
        // save polar frames for reuse
        self.polarFrames.push(polar);
    }

    frames.delete();
    PolarFFT.shutdown();
}

function onsetsAnalysis () {
    const Onsets = new OnsetsWASM.Onsets(0.1, 5, self.params.sampleRate / self.params.hopSize, 0.02);

    // create ODF matrix to be input to the Onsets algorithm
    const odfMatrix = [];
    for (const func of self.params.odfs) {
        const odfArray = self.polarFrames.map( (frame) => {
            return self.essentia.OnsetDetection(
                self.essentia.arrayToVector(self.essentia.vectorToArray(frame.magnitude)), 
                self.essentia.arrayToVector(self.essentia.vectorToArray(frame.phase)), 
                func, self.params.sampleRate).onsetDetection;
        });
        odfMatrix.push(Float32Array.from(odfArray));
    }

    // console.table(odfMatrix);
    const onsetPositions = Onsets.compute(odfMatrix, self.params.odfsWeights).positions;
    Onsets.shutdown();
    // check possibly all zeros onsetPositions
    if (onsetPositions.size() == 0) { return new Float32Array(0) }
    else { return self.essentia.vectorToArray(onsetPositions); }
}

// UTILS

function paramsAreAllowed (paramsList) {
    return paramsList.every( (p) => self.allowedParams.includes(p) );
}

function getUnsupportedParams (paramsList) {
    return paramsList.filter( (p) => !self.allowedParams.includes(p) );
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