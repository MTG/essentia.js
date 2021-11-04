// UTILS

self.log = function (msg) {
    console.info('audio-worker info:', msg);
};
self.error = function (msg) {
    throw Error(`audio-worker error: \n ${msg}`);
};

// INIT
import { Essentia, EssentiaWASM } from 'essentia.js';
import { EssentiaWASMSaturation } from './lib/saturation.module.js';
import { EssentiaWASMSilence } from './lib/startstopsilence.module.js';
log("Imports went OK");

self.essentia = null;
self.frameSize = 1024;
self.hopSize = 512;
self.sampleRate = 44100;
self.saturationExtractor = new EssentiaWASMSaturation.SaturationDetectorExtractor(self.frameSize, self.hopSize);
self.silenceExtractor = new EssentiaWASMSilence.StartStopSilenceExtractor(self.frameSize, self.hopSize);

log(saturationExtractor);

// global storage for slicing
self.signal = null;
self.saturationResults = {'starts': null , 'ends': null};
self.startStopCutResults = null;
self.silenceResults = null;
self.silenceResultsSeconds = {'start': null , 'end': null};

try {
    self.essentia = new Essentia(EssentiaWASM.EssentiaWASM);
} catch (err) { error(err) }


// COMMS
onmessage = function listenToMainThread(msg) {
    console.log(msg);
    switch (msg.data.request) {
        case 'analyse':
            log('received analyse cmd')
            // const signal = new Float32Array(msg.data.audio);
            self.signal = msg.data.audio;
            computeStartStopCut();
            computeSaturation();
            computeSilence();
            transformSilenceResults();

            postMessage({
                type: 'startStopCut',
                results: self.startStopCutResults
            });

            postMessage({
                type: 'saturation',
                results: self.saturationResults
            })

            postMessage({
                type: 'silence',
                results: self.silenceResultsSeconds
            })
            break;
        case 'updateSampleRate':
            // guard: check for empty params obj
            self.sampleRate = msg.data.sr;
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
    self.silenceResults = self.silenceExtractor.compute(self.signal);
}

function transformSilenceResults () {
    let secondsPerFrame = self.hopSize / self.sampleRate;
    self.silenceResultsSeconds.start = self.silenceResults.startFrame * secondsPerFrame;
    self.silenceResultsSeconds.end = self.silenceResults.endFrame * secondsPerFrame;
}

function computeStartStopCut () {
    self.startStopCutResults = self.essentia.StartStopCut(self.essentia.arrayToVector(self.signal));
}

