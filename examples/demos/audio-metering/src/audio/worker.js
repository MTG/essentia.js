// UTILS
self.log = function (msg) {
    console.info('audio-worker info:', msg);
};
self.error = function (msg) {
    throw Error(`audio-worker error: \n ${msg}`);
};

// INIT
import { Essentia, EssentiaWASM } from 'essentia.js';
log("Imports went OK");

self.essentia = null;
try {
    self.essentia = new Essentia(EssentiaWASM.EssentiaWASM);
} catch (err) { error(err) }


// COMMS
onmessage = function listenToMainThread(msg) {
    if (!msg.data.audioData) {
        error('Worker needs "audioData" property for processing');
        return;
    }

    const input = msg.data.audioData;

    let analysis = {
        loudness: getLoudness(input)
    };

    self.postMessage({
        analysis: analysis
    })
};



// AUDIO FUNCS

function getLoudness (audio) {
    let left = self.essentia.arrayToVector(audio[0]);
    let right = self.essentia.arrayToVector(audio[1]);
    return self.essentia.LoudnessEBUR128(left, right);
}
