import { EssentiaWASM as ExtractorWASM} from "../extractor-2B/essentia-custom-extractor.module.js" ;
import { Essentia, EssentiaWASM } from "essentia.js";
import { frameSize, hopSize } from "./analysisParams.js";
const essentia = new Essentia(EssentiaWASM.EssentiaWASM);

export function vectorTestJS(audio) {
  const frames = essentia.FrameGenerator(audio, frameSize, hopSize);

  for (let i = 0; i < frames.size(); i++) {
    essentia.vectorToArray(frames.get(i));
  }
  return 0;
}

export function vectorTestCPP(audio) {
  const frames = ExtractorWASM.FrameGenerator(audio, frameSize, hopSize);

  for (let i = 0; i < frames.size(); i++) {
    ExtractorWASM.vect2ArrayCpp(frames.get(i));
  }
  return 0;
}