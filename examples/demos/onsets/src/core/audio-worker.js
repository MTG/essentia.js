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
self.params = {}; // changing odfs should require changing odfsWeights (at least length), and viceversa
self.fftRecomputeNeeded = true;

// global storage for slicing
self.signal = null;
self.polarFrames = null;
self.onsetPositions = null;

try {
    self.essentia = new Essentia(EssentiaWASM.EssentiaWASM);
} catch (err) { error(err) }


// COMMS
onmessage = function listenToMainThread(msg) {
    switch (msg.data.request) {
        case 'analyse': {
            log('received analyse cmd')
            // const signal = new Float32Array(msg.data.audio);
            self.signal = msg.data.audio;
            computeFFT();
            self.onsetPositions = computeOnsets();

            postMessage(self.onsetPositions);
            break;
        }
        case 'initParams': {
            let [suppliedParamList, newParams] = checkParams(msg.data.params);
            self.params = {...self.params, ...newParams}; // update existing params obj
            log(`updated the following params: ${suppliedParamList.join(',')}`);
            log('current params are: ');
            console.info(self.params);

            break;
        }
        case 'updateParams': {
            let [suppliedParamList, newParams] = checkParams(msg.data.params);

            self.params = {...self.params, ...newParams}; // update existing params obj
            log(`updated the following params: ${suppliedParamList.join(',')}`);
            log('current params are: ');
            console.info(self.params);
            
            if (suppliedParamList.length == 1 && suppliedParamList[0] == 'sampleRate') {
                // if only sample rate was updated, do not run any of the analysis
                break;
            }

            if (self.polarFrames === null || self.polarFrames.length === 0) {    
                // file hasn't been uploaded and analysed for 1st time, or it has been cleared
                self.fftRecomputeNeeded = true;
            }
            if (suppliedParamList.includes('frameSize') || suppliedParamList.includes('hopSize')) {
                // re-compute FFT analysis if updated params affect it (frame or hop size changed)
                self.fftRecomputeNeeded = true;
            }

            if (self.fftRecomputeNeeded) {
                computeFFT()
            }
            self.onsetPositions = computeOnsets();
            postMessage(self.onsetPositions);
            break;
        }
        case 'slice': {
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
        }
        case 'clear':
            // audio worker state and saved analysis should be cleared
            break;
        default:
            error('Received message from main thread; no matching request found!');
            break;
    }
};



// AUDIO FUNCS

function computeFFT () {
    self.polarFrames = []; // clear frames from previous computation
    // algo instantiation
    let PolarFFT = new PolarFFTWASM.PolarFFT(self.params.frameSize);
    // frame cutting, windowing
    let frames = self.essentia.FrameGenerator(self.signal, self.params.frameSize, self.params.hopSize);

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
    self.fftRecomputeNeeded = false;
}

function computeOnsets () {
    const alpha = 1 - self.params.sensitivity; 
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

function checkParams (params) {
    // guard: check for empty params obj
    if (!params) {
        error('missing `params` object in the `updateParams` command');
        return;
    }
    let suppliedParamList = Object.keys(params);

    // guard: check obj properties for forbidden params
    if (!paramsAreAllowed(suppliedParamList)) {
        error(`illegal parameter(s) in 'updateParams' command \n - ${getUnsupportedParams(suppliedParamList).join('\n - ')}`);
        return;
    }

    let newParams = params;

    odfParamsAreOkay(suppliedParamList, newParams);

    return [suppliedParamList, newParams];
}

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