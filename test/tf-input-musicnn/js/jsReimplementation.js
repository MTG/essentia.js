import { Essentia, EssentiaWASM } from "essentia.js";
import { frameSize, hopSize, sampleRate } from "./analysisParams";

const essentia = new Essentia(EssentiaWASM.EssentiaWASM, true);
const numberBands= 96;
const warpingFormula = "slaneyMel";
const weighting = "linear";
const normalize = "unit_tri";
const shift = 1;
const scale = 10000;
const comp = "log10";

function tfInputMusiCNN(frameVector) {
  const windowed = essentia.Windowing(frameVector, false).frame;
  const spectrum = essentia.Spectrum(windowed, 
                                     frameSize).spectrum;
  const melbands = essentia.MelBands(spectrum, 
                                     sampleRate/2, 
                                     frameSize/2 + 1, 
                                     false, 
                                     0, 
                                     normalize,
                                     numberBands, 
                                     sampleRate,
                                     "power",
                                     warpingFormula,
                                     weighting).bands;

  const shiftedBands = essentia.UnaryOperator(melbands, scale, shift).array;
  const compressedBands = essentia.UnaryOperator(shiftedBands, 1, 0, comp).array;
  
  return essentia.vectorToArray(compressedBands);
}

export function getFeaturesJSReimplementation(audio) {
  console.log('Running js reimplementation test...');
  const frames = essentia.FrameGenerator(audio, frameSize, hopSize);

  const melspectrogram = [];
  for (let i = 0; i < frames.size(); i++) {
    melspectrogram.push(tfInputMusiCNN(frames.get(i)));
  }

  return melspectrogram;
}