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

// global storage for slicing
self.signal = null;
self.saturationResults = {starts: null , ends: null};
self.startStopCutResults = null;
self.silenceResults = null;
self.silenceResultsSeconds = {start: null , end: null};
self.silenceThreshold = 3; //in seconds
self.silenceHeuristicsResults = {
    start: null,
    end: null
};

try {
    self.essentia = new Essentia(EssentiaWASM.EssentiaWASM);
} catch (err) { error(err) }


// COMMS
onmessage = function listenToMainThread(msg) {
    switch (msg.data.request) {
        case 'analyse':
            log('received analyse cmd')
            // const signal = new Float32Array(msg.data.audio);
            self.signal = msg.data.audio;
            computeStartStopCut();
            computeSaturation();
            computeSilence();

            if (resultsNotOkay()) {
                postMessage({
                    type: "empty",
                    results: null
                })
                break;
            }

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
                results: self.silenceHeuristicsResults
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
    self.saturationExtractor = new EssentiaWASMSaturation.SaturationDetectorExtractor(self.frameSize, self.hopSize);
    let algoOutput = self.saturationExtractor.compute(self.signal);
    self.saturationResults.starts = algoOutput.starts.size() > 0 ? essentia.vectorToArray(algoOutput.starts) : [];
    self.saturationResults.ends = algoOutput.ends.size() > 0 ? essentia.vectorToArray(algoOutput.ends): [];
    self.saturationExtractor.shutdown();
}

function computeSilence () {
    self.silenceExtractor = new EssentiaWASMSilence.StartStopSilenceExtractor(self.frameSize, self.hopSize);
    self.silenceResults = self.silenceExtractor.compute(self.signal);
    console.log('silenceResults: ', self.silenceResults);
    self.silenceExtractor.shutdown()
    transformSilenceResults();
}

function transformSilenceResults () {
    let secondsPerFrame = self.hopSize / self.sampleRate;
    self.silenceResultsSeconds.start = self.silenceResults.startFrame * secondsPerFrame;
    self.silenceResultsSeconds.end = self.silenceResults.endFrame * secondsPerFrame;
    silenceHeuristics();
}

function computeStartStopCut () {
    self.startStopCutResults = self.essentia.StartStopCut(self.essentia.arrayToVector(self.signal));
}


function silenceHeuristics() {
    self.silenceHeuristicsResults = {start: null, end: null};
    let signalDuration = self.signal.length / self.sampleRate; // seconds
    if (self.silenceResultsSeconds.start > self.silenceThreshold) {
        self.silenceHeuristicsResults.start = {
            begin: 0,
            finish: self.silenceResultsSeconds.start
        };
    }
    if (signalDuration - self.silenceResultsSeconds.end > self.silenceThreshold) {
        self.silenceHeuristicsResults.end = {
            begin: self.silenceResultsSeconds.end,
            finish: signalDuration
        };
    }
}

function resultsNotOkay () {
    let saturation = self.saturationResults.starts.length === 0 || self.saturationResults.ends.length === 0;
    let silence = !self.silenceHeuristicsResults.start && !self.silenceHeuristicsResults.end;
    let startStopCut = self.startStopCutResults.startCut === 0 && self.startStopCutResults.stopCut === 0;
    return (saturation && silence && startStopCut)
}
