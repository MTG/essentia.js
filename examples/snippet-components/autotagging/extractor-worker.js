try {
  importScripts("https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-model.umd.js", 
              "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.umd.js");
} catch (err) {
  // essentia-wasm.umd.js causes a NetworkError 
  // despite correct retrieval (200) and loading.
  // Catching the error allows the script to continue
  console.trace(err);
}

// Necessary 'hack': essentia-wasm.umd.js puts 
// its export named 'Module' on the exports object, 
// which does not exist on WorkerGlobalScope
const EssentiaWASM = Module;
console.log(Module);
const extractor = new EssentiaModel.EssentiaTFInputExtractor(EssentiaWASM, "musicnn");

self.onmessage = e => {
    let features = extractor.computeFrameWise(e.data, 256);
    features.audioLength = e.data.length;
    // post the feature as message to the main thread
    self.postMessage(features);
}
