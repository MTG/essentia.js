import { EssentiaWASM } from "../extractor-2A/essentia-custom-extractor.module.js";
import { frameSize, hopSize } from "./analysisParams.js";

const extractor = new EssentiaWASM.FullSignalTFInputMusiCNN();

export function extractor2A(audio) {
  console.log("Running extractor 2B test...");
  return extractor.compute(audio, frameSize, hopSize);
}