import { EssentiaTFInputExtractor } from './lib/essentia.js-model.es.js';
import { EssentiaWASM } from './lib/essentia-wasm.module.js';

const essentia = new EssentiaWASM.EssentiaJS(false);
const extractor = new EssentiaTFInputExtractor(EssentiaWASM, 'musicnn', false);

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

onmessage = async function listenToMainThread(msg) {
    // listen for decoded audio
    if (msg.data.audio) {
        console.log("From FE worker: I've got audio!");
        const audio = new Float32Array(msg.data.audio);
        const features = computeFeatures(audio);
        outputFeatures(features);
    }
}