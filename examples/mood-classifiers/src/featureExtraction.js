importScripts('./lib/essentia.js-model.umd.js');
importScripts('./lib/essentia-wasm.module.js');
// using importScripts since it works on both Chrome and Firefox
// using modified version of ES6 essentia WASM, so that it can be loaded with importScripts
const EssentiaWASM = Module;

const extractor = new EssentiaModel.EssentiaTFInputExtractor(EssentiaWASM, 'musicnn', false);

function outputFeatures(f) {
    postMessage({
        features: f
    });
}

function computeFeatures(audioData) {
    const featuresStart = Date.now();
    
    const features = extractor.computeFrameWise(audioData, 256);

    // console.log('computeFeatures: ', features.melSpectrum);

    console.info(`Feature extraction took: ${Date.now() - featuresStart}`);

    return features;
}

onmessage = function listenToMainThread(msg) {
    // listen for decoded audio
    if (msg.data.audio) {
        console.log("From FE worker: I've got audio!");
        const audio = new Float32Array(msg.data.audio);
        const features = computeFeatures(audio);
        outputFeatures(features);
    }
}