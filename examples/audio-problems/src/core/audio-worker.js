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
// import { EssentiaWASMSaturation } from './lib/essentia-custom-extractor.web.js';
log("Imports went OK");

self.essentia = null;
self.saturationExtractor = null;
self.allowedParams = ['sampleRate', 'frameSize', 'hopSize', 'odfs', 'odfsWeights', 'sensitivity'];
self.params = {
    sampleRate: 44100,
    frameSize: 1024,
    hopSize: 512,
    odfs: ['hfc', 'complex'], // Onset Detection Function(s) list
    odfsWeights: [1, 1], // per ODF weights list
    sensitivity: 0.3
}; // changing odfs should require changing odfsWeights (at least length), and viceversa

// global storage for slicing
self.signal = null;
self.polarFrames = null;
self.saturationResults = {'starts': null , 'ends': null};
self.startStopCutResults = null;

try {
    self.essentia = new Essentia(EssentiaWASM.EssentiaWASM);
    // EssentiaWASMSaturation().then( module => {
    //     self.saturationExtractor = new module.SaturationDetectorExtractor();
    // })
} catch (err) { error(err) }


// COMMS
onmessage = function listenToMainThread(msg) {
    console.log(msg);
    switch (msg.data.request) {
        case 'analyse':
            log('received analyse cmd')
            // const signal = new Float32Array(msg.data.audio);
            self.signal = msg.data.audio;
            // self.saturationResults = computeSaturation();
            computeStartStopCut();

            postMessage({
                type: 'startStopCut',
                results: self.startStopCutResults
            });
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

            let newParams = msg.data.params;

            odfParamsAreOkay(suppliedParamList, newParams);

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
                error("Audio file has NOT been provided yet. Please upload an audio file and send it to the worker.")
                break;
            }

            if (suppliedParamList.includes('frameSize') || suppliedParamList.includes('hopSize')) {
                // re-compute FFT analysis if updated params affect it (frame or hop size changed)
                computeFFT();
            }
            // always re-compute onset positions after params update
            self.saturationResults = computeOnsets();
            postMessage(self.saturationResults);

            break;
        case 'slice':
            if (!self.signal) {
                error('no audio signal available for slicing');
                break;
            }
            if (!self.saturationResults || self.saturationResults.length <= 0) {
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

function computeSaturation () {
    this.saturationResults['starts'] = this.saturationExtractor.computeStarts(this.leftChannel);
    this.saturationResults['ends'] = this.saturationExtractor.computeEnds(this.leftChannel);
}

function computeStartStopCut () {
    self.startStopCutResults = self.essentia.StartStopCut(self.essentia.arrayToVector(self.signal));
    log('startStopCutResults');
    log(self.startStopCutResults);
}


function sliceAudio () {
    // onsets: seconds to samples
    const onsetSamplePositions = Array.from(self.saturationResults.map( (pos) => Math.round(pos * self.params.sampleRate) ));
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