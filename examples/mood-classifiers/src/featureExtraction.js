importScripts('./lib/essentia.js-model.js');
importScripts('./lib/essentia-wasm.module.js');

const essentiaWASM = Module; // Module is EssentiaWASM, tweaked ES module version without exports
const essentia = new essentiaWASM.EssentiaJS(false);

function outputFeatures(f) {
    postMessage({
        features: f
    });
}

function computeFeatures(audioData) {
    const featuresStart = Date.now();
    const frames = essentia.FrameGenerator(audioData, 512, 256);
    const framesLength = frames.size();

    const features = {
        melSpectrum: [],
        batchSize: 0,
        melBandsSize: 96,
        patchSize: 187
    }; 
    for (let i = 0; i < framesLength; i++) {
        const spectrum = essentia.TensorflowInputMusiCNN(frames.get(i));
        features.melSpectrum.push(essentiaWASM.vectorToArray(spectrum.bands));
    }

    features.batchSize = features.melSpectrum.length;

    console.info(`Feature extraction took: ${Date.now() - featuresStart}`);

    frames.delete();
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