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

self.allowedParams = ['sampleRate', 'frameSize', 'hopSize', 'odfs', 'odfsWeights', 'sensitivity'];
self.params = {
    sampleRate: 44100,
    frameSize: 1024,
    hopSize: 512,
    odfs: ['hfc'], // Onset Detection Function(s) list
    odfsWeights: [1], // per ODF weights list
    sensitivity: 0.1
}; // changing odfs should require changing odfsWeights (at least length), and viceversa
self.polarFrames = null;

// global storage for slicing
self.signal = null;
self.onsetPositions = null;

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
            self.onsetPositions = onsetsAnalysis();

            postMessage(self.onsetPositions);
            break;
        case 'updateParams':
            // guard: check for empty params obj
            if (!msg.data.params) {
                error('missing `params` object in the `updateParams` command');
                return;
            }
            let suppliedParamList = Object.keys(msg.data.params);

            // guard: check obj properties for forbidden params
            if (!paramsAreAllowed(suppliedParamList)) {
                error(`illegal parameter(s) in 'updateParams' command \n - ${getUnsupportedParams(suppliedParamList).join('\n - ')}`);
                return;
            }

            let update = msg.data.params;

            odfParamsAreOkay(suppliedParamList, update);

            self.params = {...self.params, ...update}; // update existing params obj
            log(`updated the following params: ${suppliedParamList.join(',')}`);
            log('current params are: ');
            console.info(self.params);

            if (self.polarFrames !== null && self.polarFrames.length !== 0) {
                // updateParams after file upload
                self.onsetPositions = onsetsAnalysis();
                postMessage(self.onsetPositions);
            } // else: file hasn't been uploaded and analysed for 1st time, or it has been cleared
            break;
        case 'slice':
            if (!self.signal) {
                error('no audio signal available for slicing');
                break;
            }
            if (!self.onsetPositions || self.onsetPositions.length <= 0) {
                error('no onset positions available for slicing');
                break;
            }

            const slices = sliceAudio();
            // log(slices);
            postMessage(slices);
            break;
        case 'clear':
            // audio worker state and saved analysis should be cleared
            break;
        default:
            error('Received message from main thread; no matching request found!');
            break;
    }
};



// AUDIO FUNCS

function preAnalysis (signal) {
    self.signal = signal;
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
    const alpha = self.params.sensitivity;
    const Onsets = new OnsetsWASM.Onsets(alpha, 5, self.params.sampleRate / self.params.hopSize, 0.02);

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

function sliceAudio () {
    // onsets: seconds to samples
    const onsetSamplePositions = Array.from(self.onsetPositions.map( (pos) => Math.round(pos * self.params.sampleRate) ));
    // if onsetSamplePositions[index+1] == undefined, we've reached the last onset and slice will extract from samp till the end of the array
    return onsetSamplePositions.map( (samp, index) => self.signal.slice(samp, onsetSamplePositions[index+1]) );
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