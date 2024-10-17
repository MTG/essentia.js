import { EssentiaWASM } from "../extractor-2B/essentia-custom-extractor.module.js";
import { frameSize, hopSize } from "./analysisParams.js";

EssentiaWASM.init();
const extractor = new EssentiaWASM.ObjectOrientedTFInputMusiCNN();

export function extractor2B(audio) {
  console.log("Running extractor-2B test...");
  const frames = EssentiaWASM.FrameGenerator(audio, frameSize, hopSize);

  const melspectrogram = [];
  for (let i = 0; i < frames.size(); i++) {
    const bandsVector = extractor.compute(frames.get(i));
    // melspectrogram.push(bandsVector);
    // melspectrogram.push( EssentiaWASM.vectorToArray(bandsVector) ); // JS implementation: 5-30ms per frame call
    melspectrogram.push( EssentiaWASM.vect2ArrayCpp(bandsVector) ); // CPP implementation: 0.15-1.2ms per frame call
  }
  return melspectrogram;
}