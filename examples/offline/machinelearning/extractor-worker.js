import { EssentiaWASM } from "../../dist/essentia-wasm.module.js";
import { EssentiaTFInputExtractor } from "../../dist/essentia.js-model.es.js";

const extractor = new EssentiaTFInputExtractor(EssentiaWASM, "musicnn");

self.onmessage = e => {
    let features = extractor.computeFrameWise(e.data, 512, 256);
    features.audioLength = e.data.length;
    // post the feature as message to the main thread
    self.postMessage(features);
}
