importScripts("./lib/essentia-wasm.module.js");
importScripts("./lib/essentia.js-model.umd.js");
const EssentiaWASM = Module;

const extractor = new EssentiaModel.EssentiaTFInputExtractor(EssentiaWASM, "musicnn");

self.onmessage = e => {
    let features = extractor.computeFrameWise(e.data, 256);
    features.audioLength = e.data.length;
    // post the feature as message to the main thread
    self.postMessage(features);
}
