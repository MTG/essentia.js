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
import { EssentiaWASMSaturation } from './lib/saturation-extractor.module.js';
// import { EssentiaWASMSilence } from './lib/start-stop-silence.module.js';
log("Imports went OK");

self.essentia = null;
self.saturationExtractor = new EssentiaWASMSaturation.SaturationDetectorExtractor(1024, 512);
// self.silenceExtractor = new EssentiaWASMSilence.StartStopSilenceExtractor(1024, 512);

log(saturationExtractor);

// global storage for slicing
self.signal = null;
self.saturationResults = {'starts': null , 'ends': null};
self.startStopCutResults = null;
self.silenceResults = {'starts': null , 'ends': null};

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
            computeSaturation();
            // computeSilence();

            postMessage({
                type: 'startStopCut',
                results: self.startStopCutResults
            });

            postMessage({
                type: 'saturation',
                results: self.saturationResults
            })

            // postMessage({
            //     type: 'silence',
            //     results: self.silenceResults
            // })
            break;
        case 'updateParams':
            // guard: check for empty params obj
            if (!msg.data.params) {
                error('missing `params` object in the `updateParams` command');
                return;
            }

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
    let algoOutput = self.saturationExtractor.compute(self.signal);
    self.saturationResults.starts = essentia.vectorToArray(algoOutput.starts);
    self.saturationResults.ends = essentia.vectorToArray(algoOutput.ends);
}

function computeSilence () {
    self.silenceResults['starts'] = self.silenceExtractor.computeStartframe(self.signal);
    self.silenceResults['ends'] = self.silenceExtractor.computeStopframe(self.signal);
}

function computeStartStopCut () {
    self.startStopCutResults = self.essentia.StartStopCut(self.essentia.arrayToVector(self.signal));
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